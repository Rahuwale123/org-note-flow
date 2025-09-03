// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, CheckSquare, Building2, UserCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to NoteTodo
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            A secure, role-based workspace for team collaboration
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Smart Role Assignment</span>
              </CardTitle>
              <CardDescription>
                Automatic role detection based on organization name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Organization</span>
                  <Badge variant="default">ADMIN Role</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Existing Organization</span>
                  <Badge variant="secondary">MEMBER Role</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Organization Management</span>
              </CardTitle>
              <CardDescription>
                Create new organizations or join existing teams by name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Professional organization names</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>No auto-generated names</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Notes & Collaboration</span>
              </CardTitle>
              <CardDescription>
                Create and share notes with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>All users can create & view</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Only admins can edit & delete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span>Todo Management</span>
              </CardTitle>
              <CardDescription>
                Track tasks and manage workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Members can edit own todos</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Admins can manage all</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Get started with NoteTodo in three simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold">Enter Organization Name</h3>
                <p className="text-sm text-muted-foreground">
                  Type the name of your organization or company
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold">Role Auto-Detection</h3>
                <p className="text-sm text-muted-foreground">
                  System automatically assigns ADMIN or MEMBER role
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold">Start Collaborating</h3>
                <p className="text-sm text-muted-foreground">
                  Create notes and todos within your permissions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Examples</CardTitle>
            <CardDescription className="text-center">
              See how the smart role assignment works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Creating New Company</h4>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Organization: "Tech Solutions Inc"</p>
                  <p className="text-xs text-muted-foreground">Result: You become ADMIN</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Since "Tech Solutions Inc" doesn't exist yet, you'll create it and become the admin.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Joining Existing Team</h4>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Organization: "Tech Solutions Inc"</p>
                  <p className="text-xs text-muted-foreground">Result: You become MEMBER</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Since "Tech Solutions Inc" already exists, you'll join as a team member.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-4">
                Join thousands of teams using NoteTodo for secure collaboration
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
