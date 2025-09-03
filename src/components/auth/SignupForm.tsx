import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Check, Info } from 'lucide-react';
import { apiClient } from '../../api/client';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  organization_name: z.string().min(2, 'Organization name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface Organization {
  id: number;
  name: string;
  created_at: string;
}

export const SignupForm: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [showOrganizationList, setShowOrganizationList] = useState(false);
  const [organizationExists, setOrganizationExists] = useState<boolean | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const watchedOrganizationName = watch('organization_name');

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await apiClient.get('/api/v1/organizations/public');
        setOrganizations(response.data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  // Filter organizations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrganizations(organizations);
    } else {
      const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }
  }, [searchQuery, organizations]);

  // Check if organization exists
  useEffect(() => {
    if (watchedOrganizationName && watchedOrganizationName.trim().length > 0) {
      const exists = organizations.some(org => 
        org.name.toLowerCase() === watchedOrganizationName.toLowerCase()
      );
      setOrganizationExists(exists);
    } else {
      setOrganizationExists(null);
    }
  }, [watchedOrganizationName, organizations]);

  const handleOrganizationSelect = (orgName: string) => {
    setValue('organization_name', orgName);
    setSearchQuery(orgName);
    setShowOrganizationList(false);
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        username: data.username,
        password: data.password,
        organization_name: data.organization_name,
      });
      navigate('/login');
    } catch (error) {
      // Error is handled in context
    }
  };

  const getRoleBadge = () => {
    if (!watchedOrganizationName || watchedOrganizationName.trim().length === 0) {
      return <Badge variant="outline">Enter organization name</Badge>;
    }
    
    if (organizationExists) {
      return <Badge variant="secondary">MEMBER Role</Badge>;
    } else {
      return <Badge variant="default">ADMIN Role</Badge>;
    }
  };

  const getRoleDescription = () => {
    if (!watchedOrganizationName || watchedOrganizationName.trim().length === 0) {
      return "Enter an organization name to continue";
    }
    
    if (organizationExists) {
      return `You'll join "${watchedOrganizationName}" as a team member`;
    } else {
      return `You'll create "${watchedOrganizationName}" and become the admin`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center">
            Join your team's workspace or create a new organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                {...register('username')}
                className="transition-all duration-200 focus:shadow-sm"
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register('password')}
                className="transition-all duration-200 focus:shadow-sm"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className="transition-all duration-200 focus:shadow-sm"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Organization Name Field */}
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization Name</Label>
              <div className="relative">
                <Input
                  id="organization_name"
                  type="text"
                  placeholder="Enter organization name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setValue('organization_name', e.target.value);
                    setShowOrganizationList(true);
                  }}
                  onFocus={() => setShowOrganizationList(true)}
                  className="transition-all duration-200 focus:shadow-sm pr-10"
                />
                <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                
                {/* Organization Dropdown */}
                {showOrganizationList && filteredOrganizations.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredOrganizations.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleOrganizationSelect(org.name)}
                        className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between"
                      >
                        <span className="text-sm">{org.name}</span>
                        {searchQuery === org.name && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Role Indicator */}
              <div className="flex justify-center mt-2">
                {getRoleBadge()}
              </div>
              
              {/* Role Description */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {getRoleDescription()}
                </p>
              </div>
              
              {/* Organization Status */}
              {watchedOrganizationName && watchedOrganizationName.trim().length > 0 && (
                <div className={`p-2 rounded-md text-xs flex items-center space-x-2 ${
                  organizationExists 
                    ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                }`}>
                  {organizationExists ? (
                    <>
                      <Info className="h-3 w-3" />
                      <span>Organization exists - you'll join as a member</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-3 w-3" />
                      <span>New organization - you'll become the admin</span>
                    </>
                  )}
                </div>
              )}
              
              {errors.organization_name && (
                <p className="text-sm text-destructive">{errors.organization_name.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};