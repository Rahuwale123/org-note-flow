// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to NoteTodo</CardTitle>
          <CardDescription>
            Collaborate on notes and manage todos with your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-primary-glow">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Join your team's workspace and start collaborating
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
