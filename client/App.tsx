import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import {
  CarIcon,
  UsersIcon,
  BuildingIcon,
  ShieldIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Role Pages */}
        <Route
          path="/driver"
          element={
            <PlaceholderPage
              title="Driver Portal"
              description="Manage your vehicles, view available transfers, track earnings, and communicate with passengers. Complete your driver registration to get started."
              icon={CarIcon}
            />
          }
        />

        <Route
          path="/fleet-manager"
          element={
            <PlaceholderPage
              title="Fleet Manager Dashboard"
              description="Manage your fleet of drivers and vehicles. Assign transfers, monitor performance, and oversee operations across your fleet."
              icon={UsersIcon}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <PlaceholderPage
              title="Admin Control Panel"
              description="Manage all platform operations including user verification, pricing approvals, dispute resolution, and system configuration."
              icon={ShieldIcon}
            />
          }
        />

        {/* Service Pages */}
        <Route
          path="/business"
          element={
            <PlaceholderPage
              title="Business Solutions"
              description="Corporate transfer solutions for businesses. Manage group bookings, generate reports, and streamline your company's transportation needs."
              icon={BuildingIcon}
            />
          }
        />

        <Route
          path="/fleet"
          element={
            <PlaceholderPage
              title="Our Fleet"
              description="Explore our diverse range of vehicles from economy to luxury. Find the perfect vehicle for your transfer needs."
              icon={CarIcon}
            />
          }
        />

        <Route
          path="/services"
          element={
            <PlaceholderPage
              title="Our Services"
              description="Comprehensive private transfer services including airport transfers, city rides, business transport, and special occasion transfers."
              icon={SettingsIcon}
            />
          }
        />

        <Route
          path="/support"
          element={
            <PlaceholderPage
              title="Support Center"
              description="Get help with bookings, payments, account issues, or general questions. Our support team is here to assist you 24/7."
              icon={HelpCircleIcon}
            />
          }
        />

        {/* Authentication Pages */}
        <Route
          path="/signin"
          element={
            <PlaceholderPage
              title="Sign In"
              description="Access your Transfermarbell account to manage bookings, view trip history, and update your preferences."
            />
          }
        />

        <Route
          path="/signup"
          element={
            <PlaceholderPage
              title="Create Account"
              description="Join Transfermarbell and start booking premium private transfers. Choose your account type: Client, Driver, or Fleet Manager."
            />
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
