import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '../../api/organizations';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, UserCheck, Trash2, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '../../types';

interface UserManagementProps {
  organizationId: number;
}

export const UserManagement: React.FC<UserManagementProps> = ({ organizationId }) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingUser, setUpdatingUser] = useState<number | null>(null);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['organization-users', organizationId],
    queryFn: () => organizationsApi.getOrganizationUsers(organizationId),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      organizationsApi.updateUserRole(organizationId, userId, { role }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization-users', organizationId] });
      toast({
        title: 'Success',
        description: `User role updated to ${variables.role}`,
      });
      setUpdatingUser(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update user role',
        variant: 'destructive',
      });
      setUpdatingUser(null);
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: number) => organizationsApi.removeUser(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-users', organizationId] });
      toast({
        title: 'Success',
        description: 'User removed from organization',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to remove user',
        variant: 'destructive',
      });
    },
  });

  const handleRoleUpdate = (userId: number, newRole: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: 'Error',
        description: 'Cannot change your own role',
        variant: 'destructive',
      });
      return;
    }
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleRemoveUser = (userId: number) => {
    if (userId === currentUser?.id) {
      toast({
        title: 'Error',
        description: 'Cannot remove yourself from the organization',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Are you sure you want to remove this user from the organization?')) {
      removeUserMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">Failed to load users</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">User Management</h2>
        <Badge variant="secondary">{users?.length || 0} Users</Badge>
      </div>

      {users && users.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
              <p className="text-sm text-muted-foreground">Users will appear here once they join</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users?.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {user.role === 'ADMIN' ? (
                        <Shield className="h-4 w-4 text-primary" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <Badge 
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                    {user.id === currentUser?.id && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Role Update */}
                    {user.id !== currentUser?.id && (
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleUpdate(user.id, newRole)}
                        disabled={updatingUser === user.id}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">MEMBER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {/* Remove User */}
                    {user.id !== currentUser?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        disabled={removeUserMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Warning Card */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium">Admin Actions</p>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Be careful when changing user roles or removing users. These actions cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
