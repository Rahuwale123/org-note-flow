import React, { useState } from 'react';
import { Navbar } from './layout/Navbar';
import { NotesList } from './notes/NotesList';
import { TodosList } from './todos/TodosList';
import { UserManagement } from './admin/UserManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckSquare, Users, Settings, Shield, UserCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

type TabType = 'notes' | 'todos' | 'my-content' | 'admin';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const { user, organization } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Team Workspace
              </h1>
              <p className="text-muted-foreground">
                Collaborate on notes and manage todos with your team
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="flex items-center space-x-2">
                {isAdmin ? <Shield className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                <span>{user?.role}</span>
              </Badge>
              {organization && (
                <Badge variant="outline" className="flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>{organization.name}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card className="p-1 mb-8 inline-flex shadow-sm">
          <Button
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('notes')}
            className={cn(
              "flex items-center space-x-2",
              activeTab === 'notes' && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Team Notes</span>
          </Button>
          <Button
            variant={activeTab === 'todos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('todos')}
            className={cn(
              "flex items-center space-x-2",
              activeTab === 'todos' && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Team Todos</span>
          </Button>
          <Button
            variant={activeTab === 'my-content' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('my-content')}
            className={cn(
              "flex items-center space-x-2",
              activeTab === 'my-content' && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <User className="h-4 w-4" />
            <span>My Content</span>
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === 'admin' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex items-center space-x-2",
                activeTab === 'admin' && "bg-primary text-primary-foreground shadow-sm"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          )}
        </Card>

        {/* Tab Content */}
        <div className="animate-in fade-in-50 duration-200">
          {activeTab === 'notes' && <NotesList />}
          {activeTab === 'todos' && <TodosList />}
          {activeTab === 'my-content' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">My Content</h2>
                <Badge variant="secondary">Personal</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>My Notes</span>
                    </CardTitle>
                    <CardDescription>
                      View and manage your personal notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotesList personalOnly={true} />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      <span>My Todos</span>
                    </CardTitle>
                    <CardDescription>
                      View and manage your personal todos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TodosList personalOnly={true} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'admin' && isAdmin && organization && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Badge variant="secondary">ADMIN ONLY</Badge>
              </div>
              
              {/* User Management */}
              <UserManagement organizationId={organization.id} />

              {/* Organization Settings */}
              <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Organization Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Update organization details and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                    Edit Organization
                  </Button>
                </CardContent>
              </Card>

              {/* RBAC Information */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Role-Based Access Control</CardTitle>
                  <CardDescription>
                    Current permission settings for your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Notes Management</span>
                      <Badge variant="outline">ADMIN Only</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Todos Management</span>
                      <Badge variant="outline">ADMIN + Own Content</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">User Management</span>
                      <Badge variant="outline">ADMIN Only</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Personal Content</span>
                      <Badge variant="outline">All Users</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};