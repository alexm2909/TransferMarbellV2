import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  CarIcon,
  PlaneIcon,
  ShieldCheckIcon,
  StarIcon,
  MessageSquareIcon,
} from "lucide-react";

export default function Index() {
  const [bookingData, setBookingData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    children: "0",
    luggage: "1",
    vehicleType: "",
    flightNumber: "",
  });

  const vehicleTypes = [
    { id: "economy", name: "Economy", capacity: "1-3", price: "From €25" },
    { id: "comfort", name: "Comfort", capacity: "1-3", price: "From €35" },
    { id: "premium", name: "Premium", capacity: "1-3", price: "From €50" },
    { id: "van", name: "Van", capacity: "4-8", price: "From €65" },
    { id: "luxury", name: "Luxury", capacity: "1-3", price: "From €80" },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Services
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Fleet
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Business
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                Support
              </a>
              <Button
                variant="outline"
                className="border-ocean text-ocean hover:bg-ocean hover:text-white"
              >
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                Book Now
              </Button>
            </div>
          </div>
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

          {/* Booking Form */}
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-ocean" />
                    From
                  </label>
                  <Input
                    placeholder="Airport, hotel, address..."
                    value={bookingData.origin}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, origin: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-coral" />
                    To
                  </label>
                  <Input
                    placeholder="Airport, hotel, address..."
                    value={bookingData.destination}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        destination: e.target.value,
                      })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-ocean" />
                    Date
                  </label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-ocean" />
                    Time
                  </label>
                  <Input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, time: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-ocean" />
                    Passengers
                  </label>
                  <Select
                    value={bookingData.passengers}
                    onValueChange={(value) =>
                      setBookingData({ ...bookingData, passengers: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Children
                  </label>
                  <Select
                    value={bookingData.children}
                    onValueChange={(value) =>
                      setBookingData({ ...bookingData, children: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <LuggageIcon className="w-4 h-4 text-ocean" />
                    Luggage
                  </label>
                  <Select
                    value={bookingData.luggage}
                    onValueChange={(value) =>
                      setBookingData({ ...bookingData, luggage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PlaneIcon className="w-4 h-4 text-ocean" />
                    Flight (optional)
                  </label>
                  <Input
                    placeholder="IB1234"
                    value={bookingData.flightNumber}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        flightNumber: e.target.value,
                      })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                  />
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="space-y-4 mb-6">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CarIcon className="w-4 h-4 text-ocean" />
                  Select Vehicle Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {vehicleTypes.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-ocean ${
                        bookingData.vehicleType === vehicle.id
                          ? "border-ocean bg-ocean-light"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          vehicleType: vehicle.id,
                        })
                      }
                    >
                      <div className="text-center">
                        <CarIcon className="w-8 h-8 mx-auto mb-2 text-ocean" />
                        <h3 className="font-semibold text-gray-900">
                          {vehicle.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {vehicle.capacity} pax
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {vehicle.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-4 text-lg"
              >
                Search Available Transfers
              </Button>
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
