import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import { CookieConsent } from "@/components/cookie-consent";

import Home from "@/pages/home";
import Application from "@/pages/application";
import Status from "@/pages/status";
import Insurance from "@/pages/insurance";
import FAQ from "@/pages/faq";
import Requirements from "@/pages/requirements";
import ProcessingTimes from "@/pages/processing-times";
import CancellationPolicy from "@/pages/cancellation-policy";
import Refund from "@/pages/refund";
import Security from "@/pages/security";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import KVKK from "@/pages/kvkk";
import PaymentPolicy from "@/pages/payment-policy";
import PaymentSuccess from "@/pages/payment-success";
import PaymentCancel from "@/pages/payment-cancel";
import PaymentError from "@/pages/payment-error";
import GPayStatus from "@/pages/gpay-status";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/application" component={Application} />
      <Route path="/status" component={Status} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/faq" component={FAQ} />
      <Route path="/requirements" component={Requirements} />
      <Route path="/processing-times" component={ProcessingTimes} />
      <Route path="/cancellation-policy" component={CancellationPolicy} />
      <Route path="/refund" component={Refund} />
      <Route path="/security" component={Security} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/kvkk" component={KVKK} />
      <Route path="/payment-policy" component={PaymentPolicy} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-cancel" component={PaymentCancel} />
      <Route path="/payment-error" component={PaymentError} />
      <Route path="/gpay-status" component={GPayStatus} />
      <Route path="/admin" component={Admin} />
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
          {/* <CookieConsent /> */}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;