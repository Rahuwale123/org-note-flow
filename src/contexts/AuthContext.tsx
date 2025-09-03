import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { organizationsApi } from '../api/organizations';
import { clearAuthHeaders, setAuthToken } from '../api/client';
import type { User, Organization, LoginRequest, SignupRequest } from '../types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setAuthToken(token); // Set token in API client
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
        clearAuthHeaders();
      }
    } else {
      // Ensure clean state if no token
      setIsAuthenticated(false);
      setUser(null);
      clearAuthHeaders();
    }

    // Cleanup function for page unload
    const handleBeforeUnload = () => {
      // Don't clear tokens on page unload - let them persist for session
      // This allows users to refresh the page without being logged out
    };

    // Cleanup function for page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden (user switched tabs or minimized)
        // We can add logic here if needed
      } else {
        // Page is visible again
        // Check if token is still valid
        const token = localStorage.getItem('access_token');
        if (token) {
          setAuthToken(token);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Get organization data when user is authenticated
  const { data: organization, isLoading: isOrgLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: organizationsApi.getMyOrganization,
    enabled: isAuthenticated && !!user,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Clear any existing data first
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      
      // Set new authentication data
      localStorage.setItem('access_token', data.access_token);
      setAuthToken(data.access_token);
      
      // Set authentication state
      setIsAuthenticated(true);
      
      // Fetch user data after successful login
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Invalidate queries to refetch data with new token
        queryClient.invalidateQueries({ queryKey: ['organization'] });
        
        toast({
          title: 'Success',
          description: 'Successfully logged in!',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If we can't fetch user data, logout the user
        logout();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Login failed',
        variant: 'destructive',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // After signup, we need to login
      toast({
        title: 'Success',
        description: 'Account created! Please log in.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Signup failed',
        variant: 'destructive',
      });
    },
  });

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync(data);
  };

  const signup = async (data: SignupRequest) => {
    await signupMutation.mutateAsync(data);
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    
    // Clear React state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear API client headers
    clearAuthHeaders();
    
    // Clear all React Query cache
    queryClient.clear();
    
    // Force a page reload to ensure clean state
    window.location.href = '/login';
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending || isOrgLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        organization: organization || null,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};