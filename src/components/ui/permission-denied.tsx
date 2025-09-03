import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionDeniedProps {
  action: string;
  requiredRole: 'ADMIN' | 'MEMBER';
  currentRole?: string;
  suggestion?: string;
}

export const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  action,
  requiredRole,
  currentRole,
  suggestion
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-base text-destructive">Permission Denied</CardTitle>
        </div>
        <CardDescription className="text-destructive/80">
          You don't have permission to {action}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">Required Role</span>
          <Badge variant="outline" className="flex items-center space-x-1">
            {requiredRole === 'ADMIN' ? <Shield className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
            <span>{requiredRole}</span>
          </Badge>
        </div>
        
        {currentRole && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">Your Role</span>
            <Badge 
              variant={isAdmin ? 'default' : 'secondary'} 
              className="flex items-center space-x-1"
            >
              {isAdmin ? <Shield className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
              <span>{currentRole}</span>
            </Badge>
          </div>
        )}

        {suggestion && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <span className="font-medium">Suggestion:</span> {suggestion}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Contact your organization admin if you need elevated permissions
        </div>
      </CardContent>
    </Card>
  );
};
