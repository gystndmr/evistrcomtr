import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LiveChat } from "@/components/live-chat";
import { CookieConsent } from "@/components/cookie-consent";

import LokmaHome from "@/pages/lokma-home";
import Application from "@/pages/application";
import Insurance from "@/pages/insurance-simple";
import Status from "@/pages/status";
import Admin from "@/pages/admin";
import PaymentSuccess from "@/pages/payment-success";
import PaymentCancel from "@/pages/payment-cancel";
import PaymentTroubleshoot from "@/pages/payment-troubleshoot";
import MockGPayPayment from "@/pages/mock-gpay-payment";
import DebugPayment from "@/pages/debug-payment";
import FAQ from "@/pages/faq";
import Requirements from "@/pages/requirements";
import ProcessingTimes from "@/pages/processing-times";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import KVKK from "@/pages/kvkk";
import CancellationPolicy from "@/pages/cancellation-policy";
import Security from "@/pages/security";
import Refund from "@/pages/refund";
import PaymentPolicy from "@/pages/payment-policy";
import MobileTest from "@/pages/mobile-test";
import NotFound from "@/pages/not-found";
import ChatAdmin from "@/pages/chat-admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LokmaHome} />
      <Route path="/application" component={Application} />
      <Route path="/apply" component={Application} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/status" component={Status} />
      <Route path="/admin" component={Admin} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/payment-cancel" component={PaymentCancel} />
      <Route path="/payment/cancel" component={PaymentCancel} />
      <Route path="/payment-troubleshoot" component={PaymentTroubleshoot} />
      <Route path="/mock-gpay-payment" component={MockGPayPayment} />
      <Route path="/debug-payment" component={DebugPayment} />
      <Route path="/faq" component={FAQ} />
      <Route path="/requirements" component={Requirements} />
      <Route path="/processing-times" component={ProcessingTimes} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/kvkk" component={KVKK} />
      <Route path="/cancellation-policy" component={CancellationPolicy} />
      <Route path="/security" component={Security} />
      <Route path="/refund" component={Refund} />
      <Route path="/payment-policy" component={PaymentPolicy} />
      <Route path="/mobile-test" component={MobileTest} />
      <Route path="/chat-admin" component={ChatAdmin} />
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
          <LiveChat />
          <CookieConsent />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
