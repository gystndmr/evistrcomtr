import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import VisaApplication from "@/pages/visa-application";
import InsuranceApplication from "@/pages/insurance-application";
import ApplicationStatus from "@/pages/application-status";
import AdminPanel from "@/pages/admin-panel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/visa-application" component={VisaApplication} />
      <Route path="/insurance-application" component={InsuranceApplication} />
      <Route path="/application-status" component={ApplicationStatus} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;