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
import TimeSelector from "@/components/TimeSelector";
import LuggageSizeSelector from "@/components/LuggageSizeSelector";
import LuggageCountSelector from "@/components/LuggageCountSelector";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookings } from "@/hooks/useDatabase";
import { database } from "@/services/database";
import {
  CalendarIcon,
  ClockIcon,
  EuroIcon,
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
  hasReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
}

interface LuggageItem {
  index: number;
  size: "small" | "medium" | "large" | "xlarge";
  description: string;
  price: number;
}

interface LuggageCount {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const { createBooking } = useBookings();
  const [childSeats, setChildSeats] = useState<ChildSeat[]>([]);
  const [luggageItems, setLuggageItems] = useState<LuggageItem[]>([]);

  const [luggageCount, setLuggageCount] = useState<LuggageCount>({
    small: 0,
    medium: 0,
    large: 0,
    xlarge: 0,
  });
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
    hasReturnTrip: false,
    returnDate: "",
    returnTime: "",
  });

  const vehicleTypes = [
    {
      id: "economy",
      name: "Economy",
      capacity: "1-3 passengers",
      maxPassengers: 3,
      maxLuggage: 2,
      price: "From €25",
      description: "Comfortable sedan for city transfers",
      features: ["Air conditioning", "Professional driver", "Free Wi-Fi"],
    },
    {
      id: "comfort",
      name: "Comfort",
      capacity: "1-3 passengers",
      maxPassengers: 3,
      maxLuggage: 3,
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
      maxPassengers: 3,
      maxLuggage: 3,
      price: "From €50",
      description: "Luxury vehicles for special occasions",
      features: ["Luxury sedan", "Premium amenities", "Concierge service"],
    },
    {
      id: "van",
      name: "Van",
      capacity: "4-8 passengers",
      maxPassengers: 8,
      maxLuggage: 8,
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
      maxPassengers: 3,
      maxLuggage: 2,
      price: "From €80",
      description: "Ultimate luxury experience",
      features: ["Premium luxury car", "VIP treatment", "Red carpet service"],
    },
  ];

  // Calculate the minimum number of cars needed for a vehicle type
  const calculateRequiredCars = (vehicle: (typeof vehicleTypes)[0]) => {
    const totalPassengers = parseInt(bookingData.passengers) + parseInt(bookingData.children);
    const totalLuggage = parseInt(bookingData.luggage);

    const passengerCars = Math.ceil(totalPassengers / vehicle.maxPassengers);
    const luggageCars = Math.ceil(totalLuggage / vehicle.maxLuggage);

    return Math.max(passengerCars, luggageCars, 1);
  };

  const isVehicleCompatible = (vehicle: (typeof vehicleTypes)[0]) => {
    const requiredCars = calculateRequiredCars(vehicle);
    // A vehicle is compatible if we can determine how many cars are needed
    return requiredCars <= 10; // Set a reasonable maximum
  };

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

    if (!isAuthenticated || !user) {
      // Redirect to login page
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/signin?redirect=book");
      return;
    }

    // Calculate pricing and required cars
    const selectedVehicle = vehicleTypes.find((v) => v.id === bookingData.vehicleType);
    const basePrice = selectedVehicle ? parseInt(selectedVehicle.price.replace(/[^\d]/g, "")) : 25;
    const requiredCars = selectedVehicle ? calculateRequiredCars(selectedVehicle) : 1;
    const childSeatsPrice = childSeats.reduce((total, seat) => total + seat.price, 0);
    const totalPrice = (basePrice * requiredCars) + childSeatsPrice;

    // Create booking in database
    const newBooking = createBooking({
      clientId: user.id,
      status: "pending",
      tripDetails: {
        origin: {
          address: bookingData.origin
        },
        destination: {
          address: bookingData.destination
        },
        date: bookingData.date,
        time: bookingData.time,
        passengers: parseInt(bookingData.passengers),
        luggage: {
          small: luggageCount.small,
          medium: luggageCount.medium,
          large: luggageCount.large
        },
        children: bookingData.children ? {
          count: parseInt(bookingData.children),
          ages: childSeats.map(seat => seat.age)
        } : undefined,
        specialRequests: bookingData.specialRequests,
        carsRequired: requiredCars
      },
      vehicleType: selectedVehicle?.name || bookingData.vehicleType,
      pricing: {
        basePrice,
        extras: childSeats.map(seat => ({
          name: seat.description,
          price: seat.price
        })),
        totalPrice,
        currency: "EUR"
      },
      payment: {
        status: "pending"
      },
      clientData: {
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      }
    });

    // Save booking data to localStorage for the payment process
    const fullBookingData = {
      ...bookingData,
      childSeats: childSeats,
      bookingId: newBooking.id,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pendingBooking", JSON.stringify(fullBookingData));

    // Redirect to payment method selection page
    navigate("/payment-method");
  };

  const handleChildSeatsChange = (seats: ChildSeat[]) => {
    setChildSeats(seats);
    setBookingData((prev) => ({
      ...prev,
      childSeats: seats.length.toString(),
    }));
  };

  const handleLuggageChange = (luggage: LuggageItem[]) => {
    setLuggageItems(luggage);
  };

  const handleLuggageCountChange = (counts: LuggageCount) => {
    setLuggageCount(counts);
  };

  const calculateEstimatedPrice = () => {
    const basePrice =
      vehicleTypes.find((v) => v.id === bookingData.vehicleType)?.price ||
      "€25";
    const basePriceNum = parseInt(basePrice.replace(/[^\d]/g, ""));
    const childSeatsPrice = childSeats.reduce(
      (total, seat) => total + seat.price,
      0,
    );
    // Las maletas ya no tienen coste extra, solo sirven para indicar el tipo de vehículo necesario

    // Añadir precio del viaje de vuelta si está seleccionado
    const returnTripPrice = bookingData.hasReturnTrip ? basePriceNum : 0;

    const totalPrice = basePriceNum + childSeatsPrice + returnTripPrice;
    return `€${totalPrice}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center flex-shrink-0">
                  <CarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent truncate">
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
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center flex-shrink-0">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent truncate">
                Transfermarbell
              </span>
            </Link>

            {/* Desktop and Mobile Navigation */}
            <div className="flex items-center space-x-2">
              <UserMenu />
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
            {t("booking.backToHome")}
          </Link>
          <h1 className="text-3xl font-bold text-navy">
            {t("booking.completeBooking")}
          </h1>
          <p className="text-gray-600 mt-2">{t("booking.fillDetails")}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ruta del Viaje */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-ocean" />
                    Ruta del Viaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Map first */}
                  <div className="w-full">
                    <RouteMap
                      origin={bookingData.origin}
                      destination={bookingData.destination}
                      className="w-full rounded-lg"
                    />
                  </div>

                  {/* Origin and Destination in one row */}
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
                  </div>

                  {/* Route Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-ocean-light/10 border border-ocean/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinIcon className="w-5 h-5 text-ocean" />
                        <span className="text-sm font-medium text-ocean">
                          Distancia
                        </span>
                      </div>
                      <p className="text-lg font-bold text-navy">~55 km</p>
                    </div>
                    <div className="p-4 bg-coral-light/10 border border-coral/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="w-5 h-5 text-coral" />
                        <span className="text-sm font-medium text-coral">
                          Duración
                        </span>
                      </div>
                      <p className="text-lg font-bold text-navy">~45 min</p>
                    </div>
                    <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <EuroIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Precio Est.
                        </span>
                      </div>
                      <p className="text-lg font-bold text-navy">desde €35</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Journey Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-ocean" />
                    {t("booking.journeyDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 text-center block">
                        Fecha
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
                        className="border-gray-200 focus:border-ocean focus:ring-ocean text-center"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 text-center block">
                        Hora
                      </label>
                      <TimeSelector
                        value={bookingData.time}
                        onChange={(value) =>
                          setBookingData({
                            ...bookingData,
                            time: value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean"
                        required
                      />
                    </div>
                  </div>

                  {/* Return Trip Option */}
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Checkbox
                        id="returnTrip"
                        checked={bookingData.hasReturnTrip}
                        onCheckedChange={(checked) =>
                          setBookingData({
                            ...bookingData,
                            hasReturnTrip: checked as boolean,
                            returnDate: "",
                            returnTime: "",
                          })
                        }
                        className="border-ocean data-[state=checked]:bg-ocean"
                      />
                      <label
                        htmlFor="returnTrip"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        ¿Añadir viaje de vuelta?
                      </label>
                    </div>

                    {bookingData.hasReturnTrip && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-ocean-light/10 border border-ocean/20 rounded-lg">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-ocean" />
                            Fecha de Vuelta
                          </label>
                          <Input
                            type="date"
                            value={bookingData.returnDate}
                            min={
                              bookingData.date ||
                              new Date().toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                returnDate: e.target.value,
                              })
                            }
                            className="border-gray-200 focus:border-ocean focus:ring-ocean custom-date-input"
                            required={bookingData.hasReturnTrip}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-ocean" />
                            Hora de Vuelta
                          </label>
                          <TimeSelector
                            value={bookingData.returnTime}
                            onChange={(value) =>
                              setBookingData({
                                ...bookingData,
                                returnTime: value,
                              })
                            }
                            className="border-gray-200 focus:border-ocean focus:ring-ocean"
                            placeholder="Seleccionar hora de vuelta"
                            required={bookingData.hasReturnTrip}
                          />
                        </div>
                      </div>
                    )}
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
                  {/* Mobile-optimized passenger/luggage/cars selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-ocean/40 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-0 sm:flex-col flex-1">
                        <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-ocean sm:mb-2 flex-shrink-0" />
                        <label className="text-sm font-medium text-gray-700 sm:mb-2 flex-1 sm:flex-none sm:text-center">
                          Adultos
                        </label>
                      </div>
                      <div className="w-28 sm:w-full">
                        <Select
                          value={bookingData.passengers}
                          onValueChange={(value) =>
                            setBookingData({
                              ...bookingData,
                              passengers: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20,
                            ].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "adulto" : "adultos"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-ocean/40 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-0 sm:flex-col flex-1">
                        <BabyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-coral sm:mb-2 flex-shrink-0" />
                        <label className="text-sm font-medium text-gray-700 sm:mb-2 flex-1 sm:flex-none sm:text-center">
                          Niños
                        </label>
                      </div>
                      <div className="w-28 sm:w-full">
                        <Select
                          value={bookingData.children}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, children: value })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "niño" : "niños"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-ocean/40 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-0 sm:flex-col flex-1">
                        <LuggageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-navy sm:mb-2 flex-shrink-0" />
                        <label className="text-sm font-medium text-gray-700 sm:mb-2 flex-1 sm:flex-none sm:text-center">
                          Maletas
                        </label>
                      </div>
                      <div className="w-28 sm:w-full">
                        <Select
                          value={bookingData.luggage}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, luggage: value })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "maleta" : "maletas"}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-center space-x-3 sm:space-x-0 sm:flex-col flex-1">
                        <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 sm:mb-2 flex-shrink-0" />
                        <label className="text-sm font-medium text-blue-700 sm:mb-2 flex-1 sm:flex-none sm:text-center">
                          Coches Requeridos
                        </label>
                      </div>
                      <div className="w-28 sm:w-full">
                        {(() => {
                          const selectedVehicle = vehicleTypes.find(v => v.id === bookingData.vehicleType);
                          if (selectedVehicle) {
                            const requiredCars = calculateRequiredCars(selectedVehicle);
                            return (
                              <div className="text-center p-2 bg-blue-100 rounded-lg">
                                <div className="text-lg font-bold text-blue-800">
                                  {requiredCars}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {requiredCars === 1 ? "coche" : "coches"}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-center p-2 bg-gray-100 rounded-lg">
                              <div className="text-sm text-gray-500">
                                Selecciona vehículo
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Segunda fila: Configuración detallada */}
                  {(parseInt(bookingData.children) > 0 ||
                    parseInt(bookingData.luggage) > 0) && (
                    <div className="mt-6 space-y-6">
                      {/* Selector de edad de niños */}
                      {parseInt(bookingData.children) > 0 && (
                        <ChildrenAgeSelector
                          numberOfChildren={parseInt(bookingData.children)}
                          onChildSeatsChange={handleChildSeatsChange}
                        />
                      )}

                      {/* Selector de maletas - modo simple o por cantidades */}
                      {parseInt(bookingData.luggage) > 0 &&
                        (parseInt(bookingData.luggage) <= 3 ? (
                          <LuggageSizeSelector
                            numberOfLuggage={parseInt(bookingData.luggage)}
                            onLuggageChange={handleLuggageChange}
                          />
                        ) : (
                          <LuggageCountSelector
                            totalLuggage={parseInt(bookingData.luggage)}
                            onLuggageCountChange={handleLuggageCountChange}
                          />
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CarIcon className="w-5 h-5 text-ocean" />
                    {t("booking.vehicleSelection")}
                    {parseInt(bookingData.cars) > 1 && (
                      <Badge
                        variant="secondary"
                        className="bg-purple/10 text-purple"
                      >
                        {bookingData.cars} coches
                      </Badge>
                    )}
                  </CardTitle>
                  {parseInt(bookingData.cars) > 1 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Capacidad total con {bookingData.cars} vehículos del tipo
                      seleccionado
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicleTypes.map((vehicle) => {
                      const isCompatible = isVehicleCompatible(vehicle);
                      const totalPassengers =
                        parseInt(bookingData.passengers) +
                        parseInt(bookingData.children);
                      const totalLuggage = parseInt(bookingData.luggage);
                      const carsCount = calculateRequiredCars(vehicle);

                      const isSelected = bookingData.vehicleType === vehicle.id;

                      return (
                        <div
                          key={vehicle.id}
                          className={`border-2 rounded-lg p-4 transition-all relative ${
                            !isCompatible
                              ? "border-red-200 bg-red-50/50 cursor-not-allowed opacity-60"
                              : isSelected
                                ? "border-ocean bg-ocean/10 cursor-pointer"
                                : "border-gray-200 cursor-pointer hover:border-ocean"
                          }`}
                          onClick={() => {
                            if (isCompatible) {
                              setBookingData({
                                ...bookingData,
                                vehicleType: vehicle.id,
                              });
                            }
                          }}
                        >
                          {/* Overlay para vehículos no compatibles */}
                          {!isCompatible && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              No Compatible
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3
                                className={`font-semibold ${
                                  isCompatible
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                }`}
                              >
                                {vehicle.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {vehicle.capacity}
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                {carsCount > 1 ? (
                                  <span>
                                    Capacidad total ({carsCount} coches):{" "}
                                    {vehicle.maxPassengers * carsCount}{" "}
                                    pasajeros, {vehicle.maxLuggage * carsCount}{" "}
                                    maletas
                                  </span>
                                ) : (
                                  <span>
                                    Max: {vehicle.maxPassengers} pasajeros,{" "}
                                    {vehicle.maxLuggage} maletas
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${
                                isCompatible
                                  ? "bg-gradient-to-r from-ocean to-coral text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {carsCount > 1 ? (
                                <div className="text-center">
                                  <div className="text-xs opacity-90">
                                    desde
                                  </div>
                                  <div>{vehicle.price}</div>
                                  <div className="text-xs opacity-90">
                                    × {carsCount}
                                  </div>
                                </div>
                              ) : (
                                vehicle.price
                              )}
                            </div>
                          </div>

                          <p
                            className={`text-sm mb-3 ${
                              isCompatible ? "text-gray-600" : "text-gray-500"
                            }`}
                          >
                            {vehicle.description}
                          </p>

                          {/* Mostrar problemas de compatibilidad */}
                          {!isCompatible && (
                            <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                              <div className="font-medium mb-1">
                                Requisitos no cumplidos:
                              </div>
                              {totalPassengers >
                                vehicle.maxPassengers * carsCount && (
                                <div>
                                  • Demasiados pasajeros ({totalPassengers} &gt;{" "}
                                  {vehicle.maxPassengers * carsCount})
                                </div>
                              )}
                              {totalLuggage >
                                vehicle.maxLuggage * carsCount && (
                                <div>
                                  • Demasiadas maletas ({totalLuggage} &gt;{" "}
                                  {vehicle.maxLuggage * carsCount})
                                </div>
                              )}
                              <div className="mt-1 text-purple-600 font-medium">
                                💡 Selecciona más coches en el selector numérico
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            {vehicle.features.map((feature, index) => (
                              <div
                                key={index}
                                className={`flex items-center text-xs ${
                                  isCompatible
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full mr-2 ${
                                    isCompatible ? "bg-ocean" : "bg-gray-400"
                                  }`}
                                ></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneIcon className="w-5 h-5 text-ocean" />
                    {t("booking.additionalDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("booking.flightNumber")} (Opcional)
                      </label>
                      <Input
                        placeholder="ej. IB1234"
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
                        Preferencia de Pago
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
                      {t("booking.specialRequests")} (Opcional)
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-md focus:border-ocean focus:ring-ocean resize-none"
                      rows={3}
                      placeholder="Cualquier requisito o solicitud especial..."
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
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Route</span>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="flex flex-col items-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="w-0.5 h-6 bg-gray-300"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {bookingData.origin || "Origen"}
                            </div>
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {bookingData.destination || "Destino"}
                            </div>
                          </div>
                        </div>
                      </div>
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
                          {parseInt(bookingData.cars) > 1 &&
                            ` (${bookingData.cars} coches)`}
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
