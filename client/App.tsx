import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { TripProvider } from "./contexts/TripContext";
import Index from "./pages/Index";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import ReservationLookup from "./pages/ReservationLookup";
import ReservationDetails from "./pages/ReservationDetails";
import Fleet from "./pages/Fleet";
import Services from "./pages/Services";
import PaymentMethod from "./pages/PaymentMethod";
import AdminBookings from "./pages/AdminBookings";
import PaymentSummary from "./pages/PaymentSummary";
import PaymentApple from "./pages/PaymentApple";
import PaymentGoogle from "./pages/PaymentGoogle";
import PaymentPaypal from "./pages/PaymentPaypal";
import PaymentBank from "./pages/PaymentBank";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { HelpCircleIcon } from "lucide-react";

function App() {
  return (
    <LanguageProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Booking flow */}
            <Route path="/book" element={<BookingForm />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />

            {/* Payment flow */}
            <Route path="/payment-method" element={<PaymentMethod />} />
            <Route path="/payment-summary" element={<PaymentSummary />} />
            <Route path="/payment-apple" element={<PaymentApple />} />
            <Route path="/payment-google" element={<PaymentGoogle />} />
            <Route path="/payment-paypal" element={<PaymentPaypal />} />
            <Route path="/payment-bank" element={<PaymentBank />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-error" element={<PaymentError />} />

            {/* Reservation lookup */}
            <Route path="/mi-reserva" element={<ReservationLookup />} />
            <Route path="/mi-reserva/:id" element={<ReservationDetails />} />

            {/* Service pages */}
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/services" element={<Services />} />
            <Route path="/support" element={<PlaceholderPage title="Support Center" description="Get help with bookings, payments, account issues, or general questions. Our support team is here to assist you 24/7." icon={HelpCircleIcon} />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminBookings />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TripProvider>
    </LanguageProvider>
  );
}

export default App;
