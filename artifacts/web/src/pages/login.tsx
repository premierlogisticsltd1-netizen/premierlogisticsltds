import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Truck } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight">SWIFT COURIER</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-3">Log in to your operations hub</h1>
          <p className="text-muted-foreground mb-8">
            Access the centralized dashboard for tracking, dispatching, and managing logistics operations.
          </p>

          <button
            onClick={() => login()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-6 rounded-md transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Log in to Dashboard
          </button>
        </div>
      </div>
      
      <div className="hidden lg:block flex-1 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c8263e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-xl text-sidebar-foreground font-medium mb-4">
            "Precision beats speed, but Swift Courier delivers both. A masterclass in logistics operations."
          </blockquote>
          <p className="text-sidebar-foreground/50 text-sm font-mono uppercase tracking-wider">
            SYSTEM // READY
          </p>
        </div>
      </div>
    </div>
  );
}
