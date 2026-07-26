import { useEffect, useRef } from "react";
import {
  ClerkProvider, SignIn, SignUp, useUser, useClerk,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";

import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Shipments from "./pages/shipments";
import NewShipment from "./pages/new-shipment";
import ShipmentDetail from "./pages/shipment-detail";
import Track from "./pages/track";
import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Pricing from "./pages/pricing";
import Faqs from "./pages/faqs";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Portal from "./pages/portal";
import Quotes from "./pages/quotes";
import Invoices from "./pages/invoices";
import Drivers from "./pages/drivers";
import Admin from "./pages/admin";
import Reports from "./pages/reports";
import Customers from "./pages/customers";
import Industries from "./pages/industries";
import Coverage from "./pages/coverage";
import Testimonials from "./pages/testimonials";
import Blog from "./pages/blog";
import Careers from "./pages/careers";
import ContactMessages from "./pages/contact-messages";

// ─── Clerk key resolution ────────────────────────────────────────────────────
// publishableKeyFromHost resolves the correct key for the request host so the
// same build works across dev previews and custom Clerk domains in production.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// Empty string in dev (Clerk hits FAPI directly). Auto-populated in production.
// Do NOT gate on import.meta.env.PROD — the empty dev value is intentional.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Clerk passes full paths; wouter's setLocation prepends base — strip it.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

// ─── Appearance ─────────────────────────────────────────────────────────────
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#ff6208",
    colorForeground: "#09090f",
    colorMutedForeground: "#717182",
    colorDanger: "#ef4444",
    colorBackground: "#f9f9f9",
    colorInput: "#e4e4ee",
    colorInputForeground: "#09090f",
    colorNeutral: "#e4e4ee",
    fontFamily: "'Montserrat', sans-serif",
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-xl w-[440px] max-w-full overflow-hidden shadow-xl border border-gray-100",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-gray-900 font-bold",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700 font-medium",
    formFieldLabel: "text-gray-700 font-medium",
    footerActionLink: "text-[#ff6208] hover:text-[#e55500] font-semibold",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-[#ff6208]",
    formFieldSuccessText: "text-green-600",
    alertText: "text-gray-800",
    logoBox: "py-2",
    logoImage: "h-10",
    socialButtonsBlockButton: "border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors",
    formButtonPrimary: "bg-[#ff6208] hover:bg-[#e55500] text-white font-semibold transition-colors",
    formFieldInput: "border border-gray-200 bg-white text-gray-900 focus:border-[#ff6208] focus:ring-[#ff6208]",
    footerAction: "bg-gray-50 border-t border-gray-100",
    dividerLine: "bg-gray-200",
    alert: "bg-red-50 border border-red-100",
    otpCodeFieldInput: "border border-gray-200 bg-white text-gray-900",
    formFieldRow: "gap-3",
    main: "px-6",
  },
};

const queryClient = new QueryClient();

// ─── Sign-in / Sign-up pages ─────────────────────────────────────────────────
function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
            Operations Hub
          </p>
        </div>
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
            Create Account
          </p>
        </div>
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

// ─── Cache invalidator on user change ───────────────────────────────────────
function ClerkCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const id = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== id) {
        qc.clear();
      }
      prevUserIdRef.current = id;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

// ─── Protected route ─────────────────────────────────────────────────────────
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isSignedIn, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (isLoaded && !isSignedIn) setLocation("/sign-in");
  }, [isLoaded, isSignedIn, setLocation]);
  if (!isLoaded || !isSignedIn) return null;
  return <Component />;
}

// ─── Router ──────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Switch>
      {/* Clerk auth pages — paths must be exact, /*? matches sub-routes */}
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />

      {/* Legacy /login redirect */}
      <Route path="/login" component={SignInPage} />

      {/* Public pages */}
      <Route path="/" component={Home} />
      <Route path="/track" component={Track} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/faqs" component={Faqs} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/industries" component={Industries} />
      <Route path="/coverage" component={Coverage} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />

      {/* Protected staff / admin pages */}
      <Route path="/dashboard">
        <Layout><ProtectedRoute component={Dashboard} /></Layout>
      </Route>
      <Route path="/shipments/new">
        <Layout><ProtectedRoute component={NewShipment} /></Layout>
      </Route>
      <Route path="/shipments/:id">
        <Layout><ProtectedRoute component={ShipmentDetail} /></Layout>
      </Route>
      <Route path="/shipments">
        <Layout><ProtectedRoute component={Shipments} /></Layout>
      </Route>
      <Route path="/portal">
        <Layout><ProtectedRoute component={Portal} /></Layout>
      </Route>
      <Route path="/quotes">
        <Layout><ProtectedRoute component={Quotes} /></Layout>
      </Route>
      <Route path="/invoices">
        <Layout><ProtectedRoute component={Invoices} /></Layout>
      </Route>
      <Route path="/customers">
        <Layout><ProtectedRoute component={Customers} /></Layout>
      </Route>
      <Route path="/drivers">
        <Layout><ProtectedRoute component={Drivers} /></Layout>
      </Route>
      <Route path="/reports">
        <Layout><ProtectedRoute component={Reports} /></Layout>
      </Route>
      <Route path="/admin">
        <Layout><ProtectedRoute component={Admin} /></Layout>
      </Route>
      <Route path="/admin/contact-messages">
        <Layout><ProtectedRoute component={ContactMessages} /></Layout>
      </Route>

      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

// ─── ClerkProvider + routing integration ─────────────────────────────────────
function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: { title: "Welcome back", subtitle: "Sign in to your Premier Logistics account" },
        },
        signUp: {
          start: { title: "Create your account", subtitle: "Join Premier Logistics today" },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
