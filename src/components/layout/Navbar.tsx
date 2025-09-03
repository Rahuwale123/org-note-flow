import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, organization, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">NoteTodo</h1>
            {organization && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">{organization.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};