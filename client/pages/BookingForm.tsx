import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import RouteMap from "@/components/RouteMap";
import ChildrenAgeSelector from "@/components/ChildrenAgeSelector";
import { useAuth } from "@/hooks/useAuth";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  CarIcon,
  PlaneIcon,
  BabyIcon,
  ShieldIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

interface ChildSeat {
  childIndex: number;
  age: number;
  seatType: string;
  description: string;
  price: number;
}

interface BookingData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  children: string;
  luggage: string;
  vehicleType: string;
  flightNumber: string;
  childSeats: string;
  specialRequests: string;
  paymentPreference: string;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [childSeats, setChildSeats] = useState<ChildSeat[]>([]);
  const [bookingData, setBookingData] = useState<BookingData>({
    origin: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    children: "0",
    luggage: "1",
    vehicleType: "",
    flightNumber: "",
    childSeats: "0",
    specialRequests: "",
    paymentPreference: "full",
  });

  const vehicleTypes = [
    {
      id: "economy",
      name: "Economy",
      capacity: "1-3 passengers",
      price: "From €25",
      description: "Comfortable sedan for city transfers",
      features: ["Air conditioning", "Professional driver", "Free Wi-Fi"],
    },
    {
      id: "comfort",
      name: "Comfort",
      capacity: "1-3 passengers",
      price: "From €35",
      description: "Premium comfort with extra space",
      features: [
        "Leather seats",
        "Extra legroom",
        "Phone charger",
        "Water bottles",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      capacity: "1-3 passengers",
      price: "From €50",
      description: "Luxury vehicles for special occasions",
      features: ["Luxury sedan", "Premium amenities", "Concierge service"],
    },
    {
      id: "van",
      name: "Van",
      capacity: "4-8 passengers",
      price: "From €65",
      description: "Spacious van for groups and families",
      features: [
        "Large trunk space",
        "Group seating",
        "Extra luggage capacity",
      ],
    },
    {
      id: "luxury",
      name: "Luxury",
      capacity: "1-3 passengers",
      price: "From €80",
      description: "Ultimate luxury experience",
      features: ["Premium luxury car", "VIP treatment", "Red carpet service"],
    },
  ];

  useEffect(() => {
    // Load pre-booking data from localStorage
    const preBookingData = localStorage.getItem("preBookingData");
    if (preBookingData) {
      const parsed = JSON.parse(preBookingData);
      setBookingData((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Redirect to login page
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/signin?redirect=book");
      return;
    }

    // Process booking
    console.log("Booking submitted:", bookingData);
    console.log("Child seats:", childSeats);

    // Generate booking ID
    const bookingId = "TM" + Date.now().toString().slice(-6);

    // Here you would typically send the data to your backend
    // For demo, we'll simulate a successful booking
    setTimeout(() => {
      navigate(`/booking-confirmation?id=${bookingId}`);
    }, 1000);
  };

  const handleChildSeatsChange = (seats: ChildSeat[]) => {
    setChildSeats(seats);
    setBookingData(prev => ({
      ...prev,
      childSeats: seats.length.toString()
    }));
  };

  const calculateEstimatedPrice = () => {
    const basePrice = vehicleTypes.find((v) => v.id === bookingData.vehicleType)?.price || "€25";
    const basePriceNum = parseInt(basePrice.replace(/[^\d]/g, ''));
    const childSeatsPrice = childSeats.reduce((total, seat) => total + seat.price, 0);
    return `€${basePriceNum + childSeatsPrice}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm border-b">
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
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldIcon className="w-8 h-8 text-ocean" />
              </div>
              <CardTitle className="text-2xl font-bold text-navy mb-2">
                Sign In Required
              </CardTitle>
              <p className="text-gray-600">
                Please sign in to your account to complete your booking
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-ocean-light/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-navy mb-2">
                  Your booking details will be saved
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>From:</strong> {bookingData.origin}
                  </p>
                  <p>
                    <strong>To:</strong> {bookingData.destination}
                  </p>
                  <p>
                    <strong>Date:</strong> {bookingData.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {bookingData.time}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link to="/signin?redirect=book" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup?redirect=book" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-ocean text-ocean hover:bg-ocean hover:text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
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
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-ocean text-ocean">
                Completing Booking
              </Badge>
              {user && (
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  {user.name}
                </Badge>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  My Account
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOutIcon className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-navy">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to book your private transfer
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route Map */}
              <RouteMap
                origin={bookingData.origin}
                destination={bookingData.destination}
                className="w-full"
              />

              {/* Journey Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-ocean" />
                    Journey Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-green-500" />
                        Origen
                      </label>
                      <AddressAutocomplete
                        placeholder="Aeropuerto, hotel, dirección..."
                        value={bookingData.origin}
                        onChange={(value) =>
                          setBookingData({
                            ...bookingData,
                            origin: value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-red-500" />
                        Destino
                      </label>
                      <AddressAutocomplete
                        placeholder="Aeropuerto, hotel, dirección..."
                        value={bookingData.destination}
                        onChange={(value) =>
                          setBookingData({
                            ...bookingData,
                            destination: value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={bookingData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            time: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passengers & Luggage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-ocean" />
                    Passengers & Luggage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Adults
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
                      <label className="text-sm font-medium text-gray-700">
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


                  </div>

                  {/* Children Age Selector */}
                  {parseInt(bookingData.children) > 0 && (
                    <div className="mt-6">
                      <ChildrenAgeSelector
                        numberOfChildren={parseInt(bookingData.children)}
                        onChildSeatsChange={handleChildSeatsChange}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CarIcon className="w-5 h-5 text-ocean" />
                    Select Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicleTypes.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-ocean ${
                          bookingData.vehicleType === vehicle.id
                            ? "border-ocean bg-ocean-light/20"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          setBookingData({
                            ...bookingData,
                            vehicleType: vehicle.id,
                          })
                        }
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {vehicle.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {vehicle.capacity}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-ocean/10 text-ocean"
                          >
                            {vehicle.price}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {vehicle.description}
                        </p>
                        <div className="space-y-1">
                          {vehicle.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs text-gray-500"
                            >
                              <div className="w-1 h-1 bg-ocean rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneIcon className="w-5 h-5 text-ocean" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Flight Number (Optional)
                      </label>
                      <Input
                        placeholder="e.g., IB1234"
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Payment Preference
                      </label>
                      <Select
                        value={bookingData.paymentPreference}
                        onValueChange={(value) =>
                          setBookingData({
                            ...bookingData,
                            paymentPreference: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Pay Full Amount</SelectItem>
                          <SelectItem value="partial">
                            Pay Deposit (20%)
                          </SelectItem>
                          <SelectItem value="destination">
                            Pay at Destination
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-md focus:border-ocean focus:ring-ocean resize-none"
                      rows={3}
                      placeholder="Any special requirements or requests..."
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          specialRequests: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-ocean" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Route</span>
                      <span className="font-medium text-right">
                        {bookingData.origin
                          ? bookingData.origin.substring(0, 15) +
                            (bookingData.origin.length > 15 ? "..." : "")
                          : "Origin"}{" "}
                        →{" "}
                        {bookingData.destination
                          ? bookingData.destination.substring(0, 15) +
                            (bookingData.destination.length > 15 ? "..." : "")
                          : "Destination"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-medium">
                        {bookingData.date} {bookingData.time}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Passengers</span>
                      <span className="font-medium">
                        {bookingData.passengers} adults
                        {bookingData.children !== "0" &&
                          `, ${bookingData.children} children`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Luggage</span>
                      <span className="font-medium">
                        {bookingData.luggage} pieces
                      </span>
                    </div>
                    {bookingData.vehicleType && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vehicle</span>
                        <span className="font-medium">
                          {
                            vehicleTypes.find(
                              (v) => v.id === bookingData.vehicleType,
                            )?.name
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Estimated Price</span>
                      <span className="text-ocean">
                        {calculateEstimatedPrice()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Final price will be confirmed after booking
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-3"
                    disabled={!bookingData.vehicleType}
                  >
                    Complete Booking
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    By booking, you agree to our terms and conditions
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
