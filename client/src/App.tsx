import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import POS from "./pages/POS";
import ERPDashboard from "./pages/erp/Dashboard";
import Inventory from "./pages/erp/Inventory";
import UserManagement from "./pages/erp/UserManagement";

function Router() {
  return (
    <Switch>
      {/* เมื่อเข้า / จะไปหน้า Welcome โดยอัตโนมัติ */}
      <Route path="/" component={() => <Redirect to="/welcome" />} />

      {/* หน้าหลัก */}
      <Route path="/welcome" component={Welcome} />

      {/* ระบบ POS */}
      <Route path="/pos" component={POS} />

      {/* ระบบ ERP */}
      <Route path="/erp" component={ERPDashboard} />
      <Route path="/erp/inventory" component={Inventory} />
      <Route path="/erp/users" component={UserManagement} />

      {/* หน้าอื่น ๆ */}
      <Route path="/home" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;