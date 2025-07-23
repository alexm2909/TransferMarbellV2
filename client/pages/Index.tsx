import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CarIcon,
  ShieldCheckIcon,
  StarIcon,
  MessageSquareIcon,
  MenuIcon,
  XIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preBookingData, setPreBookingData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
  });

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Professional Drivers",
      desc: "Licensed and verified drivers",
    },
    {
      icon: StarIcon,
      title: "Top Rated Service",
      desc: "4.9/5 average rating",
    },
    {
      icon: MessageSquareIcon,
      title: "Real-time Chat",
      desc: "Chat with your driver",
    },
  ];

  const handlePreBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store pre-booking data in localStorage for later use
    localStorage.setItem("preBookingData", JSON.stringify(preBookingData));

    // Navigate to complete booking form
    navigate("/book");
  };

  const isPreFormValid =
    preBookingData.origin &&
    preBookingData.destination &&
    preBookingData.date &&
    preBookingData.time;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/services"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Services
              </Link>
              <Link
                to="/fleet"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Fleet
              </Link>
              <Link
                to="/business"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Business
              </Link>
              <Link
                to="/support"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Support
              </Link>
              <Link to="/signin">
                <Button
                  variant="outline"
                  className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/services"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/fleet"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fleet
                </Link>
                <Link
                  to="/business"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business
                </Link>
                <Link
                  to="/support"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <div className="flex space-x-3 px-3 pt-2">
                  <Link to="/signin" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-ocean text-ocean hover:bg-ocean hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-navy mb-6">
              Premium Private Transfers
              <span className="block bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book professional airport transfers, city rides, and private
              transportation across Costa del Sol. Reliable, comfortable, and
              always on time.
            </p>
          </div>

          {/* Simplified Pre-Booking Form */}
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Book Your Transfer
                </h2>
                <p className="text-gray-600">
                  Enter your journey details to get started
                </p>
              </div>

              <form onSubmit={handlePreBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-ocean" />
                      From
                    </label>
                    <AddressAutocomplete
                      placeholder="Aeropuerto, hotel, dirección..."
                      value={preBookingData.origin}
                      onChange={(value) =>
                        setPreBookingData({ ...preBookingData, origin: value })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-coral" />
                      To
                    </label>
                    <AddressAutocomplete
                      placeholder="Aeropuerto, hotel, dirección..."
                      value={preBookingData.destination}
                      onChange={(value) =>
                        setPreBookingData({
                          ...preBookingData,
                          destination: value,
                        })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-ocean" />
                      Date
                    </label>
                    <Input
                      type="date"
                      value={preBookingData.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setPreBookingData({
                          ...preBookingData,
                          date: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-ocean" />
                      Time
                    </label>
                    <Input
                      type="time"
                      value={preBookingData.time}
                      onChange={(e) =>
                        setPreBookingData({
                          ...preBookingData,
                          time: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isPreFormValid}
                  className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue Booking
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Next: Select vehicle type, passengers, and complete your
                  booking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Why Choose Transfermarbell?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium private transfer
              service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-ocean" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-gradient-to-r from-ocean-light to-coral-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Book Your Transfer?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Transfermarbell for
            their private transportation needs across Costa del Sol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold px-8"
              onClick={() =>
                document
                  .querySelector("form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Now
            </Button>
            <Link to="/fleet">
              <Button
                variant="outline"
                size="lg"
                className="border-ocean text-ocean hover:bg-ocean hover:text-white font-semibold px-8"
              >
                View Our Fleet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                  <CarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Transfermarbell</span>
              </div>
              <p className="text-gray-300">
                Premium private transfers across Costa del Sol
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Airport Transfers</li>
                <li>City Transfers</li>
                <li>Business Transport</li>
                <li>Group Bookings</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Driver Portal</li>
                <li>Fleet Manager</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Transfermarbell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
