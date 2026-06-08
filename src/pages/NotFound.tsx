import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-7xl font-light tracking-tight text-foreground">404</h1>
        <p className="mb-2 text-xl text-foreground">This page doesn't exist.</p>
        <p className="mb-8 text-sm text-muted-foreground break-all">
          <code className="px-2 py-1 rounded bg-muted/40">{location.pathname}</code>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
