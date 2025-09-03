import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-card">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-destructive">404</CardTitle>
          <CardDescription className="text-lg">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-gradient-to-r from-primary to-primary-glow">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
