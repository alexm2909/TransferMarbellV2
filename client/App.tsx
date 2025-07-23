import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Fleet from "./pages/Fleet";
import Services from "./pages/Services";
import ChatPage from "./pages/ChatPage";
import AdminPanel from "./pages/AdminPanel";
import FleetManagerPanel from "./pages/FleetManagerPanel";
import BusinessPanel from "./pages/BusinessPanel";
import DriverPanel from "./pages/DriverPanel";
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

        {/* Booking Flow */}
        <Route path="/book" element={<BookingForm />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        {/* Authentication */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Chat and Advanced Panels */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/driver-panel" element={<DriverPanel />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/fleet-panel" element={<FleetManagerPanel />} />
        <Route path="/business-panel" element={<BusinessPanel />} />

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

        <Route path="/fleet" element={<Fleet />} />

        <Route path="/services" element={<Services />} />

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

                {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
