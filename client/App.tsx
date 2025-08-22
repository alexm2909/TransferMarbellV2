import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { TripProvider } from "./contexts/TripContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PasswordRecovery from "./pages/PasswordRecovery";
import DriverRegistration from "./pages/DriverRegistration";
import DriverRegistrationPending from "./pages/DriverRegistrationPending";
import Fleet from "./pages/Fleet";
import Services from "./pages/Services";
import ChatPage from "./pages/ChatPage";
import AdminPanel from "./pages/AdminPanel";
import EnhancedAdminPanel from "./pages/EnhancedAdminPanel";
import FleetManagerPanel from "./pages/FleetManagerPanel";
import BusinessPanel from "./pages/BusinessPanel";
import DriverPanel from "./pages/DriverPanel";
import OptimizedDriverPanel from "./pages/OptimizedDriverPanel";
import DriverEarnings from "./pages/DriverEarnings";
import PaymentMethod from "./pages/PaymentMethod";
import PaymentSummary from "./pages/PaymentSummary";
import PaymentApple from "./pages/PaymentApple";
import PaymentGoogle from "./pages/PaymentGoogle";
import PaymentPaypal from "./pages/PaymentPaypal";
import PaymentBank from "./pages/PaymentBank";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import ViewBookings from "./pages/ViewBookings";
import ReferFriends from "./pages/ReferFriends";
import TripMarketplace from "./pages/TripMarketplace";
import UserSettings from "./pages/UserSettings";
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
    <LanguageProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Booking Flow - Client Only */}
            <Route
              path="/book"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <BookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />

            {/* Payment Flow - Client Only */}
            <Route
              path="/payment-method"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentMethod />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-summary"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-apple"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentApple />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-google"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentGoogle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-paypal"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentPaypal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-bank"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentBank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-error"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <PaymentError />
                </ProtectedRoute>
              }
            />

            {/* Authentication */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route
              path="/driver-registration"
              element={<DriverRegistration />}
            />
            <Route
              path="/driver-registration-pending"
              element={<DriverRegistrationPending />}
            />

            {/* Chat - Both Drivers and Clients */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["client", "driver", "admin"]}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* Driver Panel - Driver Only */}
            <Route
              path="/driver-panel"
              element={
                <ProtectedRoute allowedRoles={["driver", "admin"]}>
                  <OptimizedDriverPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-earnings"
              element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverEarnings />
                </ProtectedRoute>
              }
            />

            {/* Admin Panel - Redirect to Dashboard */}
            <Route
              path="/admin-panel"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="/fleet-panel"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FleetManagerPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/business-panel"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BusinessPanel />
                </ProtectedRoute>
              }
            />

            {/* Client Features - Client Only */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ViewBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/refer-friends"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ReferFriends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["client", "driver", "admin"]}>
                  <UserSettings />
                </ProtectedRoute>
              }
            />

            {/* Driver/Fleet Manager Features */}
            <Route
              path="/trip-marketplace"
              element={
                <ProtectedRoute allowedRoles={["driver", "admin"]}>
                  <TripMarketplace />
                </ProtectedRoute>
              }
            />

            {/* User Role Pages */}
            <Route
              path="/driver"
              element={<Navigate to="/driver-panel" replace />}
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
        <Toaster />
      </TripProvider>
    </LanguageProvider>
  );
}

export default App;
