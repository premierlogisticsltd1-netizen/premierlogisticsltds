import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useAuth } from "@workspace/replit-auth-web";
import { useEffect } from 'react';

import { Layout } from './components/layout';
import Dashboard from './pages/dashboard';
import Shipments from './pages/shipments';
import NewShipment from './pages/new-shipment';
import ShipmentDetail from './pages/shipment-detail';
import Track from './pages/track';
import Login from './pages/login';
import Home from './pages/home';

const queryClient = new QueryClient();

// A wrapper to protect routes that require authentication
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading || !isAuthenticated) {
    return null; // Layout handles the global loading state
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/track" component={Track} />
      
      {/* Protected routes wrapped in Layout */}
      <Route path="/dashboard">
        <Layout><ProtectedRoute component={Dashboard} /></Layout>
      </Route>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/shipments">
        <Layout><ProtectedRoute component={Shipments} /></Layout>
      </Route>
      <Route path="/shipments/new">
        <Layout><ProtectedRoute component={NewShipment} /></Layout>
      </Route>
      <Route path="/shipments/:id">
        <Layout><ProtectedRoute component={ShipmentDetail} /></Layout>
      </Route>
      
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
