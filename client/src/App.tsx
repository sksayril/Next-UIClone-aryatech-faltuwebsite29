import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import VideoDetail from "@/pages/VideoDetail";

function Router() {
  return (
    <WouterRouter>
      <Switch>
        <Route path="/video/:slug" component={VideoDetail} />
        <Route path="/" component={Home} />
        {/* Catch-all for Home - handles /, /page-X, and other home routes */}
        <Route component={Home} />
      </Switch>
    </WouterRouter>
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
