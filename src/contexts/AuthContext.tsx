import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { organizationsApi } from '../api/organizations';
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
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Get organization data when user is authenticated
  const { data: organization, isLoading: isOrgLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: organizationsApi.getMyOrganization,
    enabled: isAuthenticated && !!user,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      // We don't get user data from login, so we'll fetch it after
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast({
        title: 'Success',
        description: 'Successfully logged in!',
      });
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
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