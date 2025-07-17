import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import Application from "@/pages/application";
import Insurance from "@/pages/insurance";
import Status from "@/pages/status";
import Admin from "@/pages/admin";
import PaymentSuccess from "@/pages/payment-success";
import MockGPayPayment from "@/pages/mock-gpay-payment";
import DebugPayment from "@/pages/debug-payment";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/application" component={Application} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/status" component={Status} />
      <Route path="/admin" component={Admin} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/mock-gpay-payment" component={MockGPayPayment} />
      <Route path="/debug-payment" component={DebugPayment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
