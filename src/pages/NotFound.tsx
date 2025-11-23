"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        We couldn't find the page you were looking for. It might have been moved
        or deleted.
      </p>
      <Button
        variant="ghost"
        className="mt-8 bg-primary text-secondary "
        onClick={() => navigate("/")}
      >
        Return to Home
      </Button>
    </div>
  );
}
