import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Home from "@/pages/home";
import Application from "@/pages/application";
import Insurance from "@/pages/insurance";
import PaymentFormV2 from "@/pages/payment-formV2";
import ThreeDSAuth from "@/pages/3ds-auth";
import Status from "@/pages/status";
import Admin from "@/pages/admin";
import ChatAdmin from "@/pages/chat-admin";
import DebugPayment from "@/pages/debug-payment";
import PaymentSuccess from "@/pages/payment-success";
import PaymentCancel from "@/pages/payment-cancel";
import PaymentError from "@/pages/payment-error";
import GPayStatus from "@/pages/gpay-status";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Requirements from "@/pages/requirements";
import FAQ from "@/pages/faq";
import Security from "@/pages/security";
import ProcessingTimes from "@/pages/processing-times";
import Refund from "@/pages/refund";
import KVKK from "@/pages/kvkk";
import CancellationPolicy from "@/pages/cancellation-policy";
import PaymentPolicy from "@/pages/payment-policy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/application" component={Application} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/payment-formV2" component={PaymentFormV2} />
      <Route path="/3ds-auth" component={ThreeDSAuth} />
      <Route path="/status" component={Status} />
      <Route path="/admin" component={Admin} />
      <Route path="/chat-admin" component={ChatAdmin} />
      <Route path="/debug-payment" component={DebugPayment} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment/cancel" component={PaymentCancel} />
      <Route path="/payment/error" component={PaymentError} />
      <Route path="/gpay-status" component={GPayStatus} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/requirements" component={Requirements} />
      <Route path="/faq" component={FAQ} />
      <Route path="/security" component={Security} />
      <Route path="/processing-times" component={ProcessingTimes} />
      <Route path="/refund" component={Refund} />
      <Route path="/kvkk" component={KVKK} />
      <Route path="/cancellation-policy" component={CancellationPolicy} />
      <Route path="/payment-policy" component={PaymentPolicy} />
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
