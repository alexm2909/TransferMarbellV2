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
import MultiVehicleSelector from "@/components/MultiVehicleSelector";
import UserMenu from "@/components/UserMenu";
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

interface VehicleSelection {
  vehicleId: string;
  quantity: number;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [childSeats, setChildSeats] = useState<ChildSeat[]>([]);
  const [luggageItems, setLuggageItems] = useState<LuggageItem[]>([]);
  const [multiCarMode, setMultiCarMode] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleSelection[]>([]);
  const [showMultiVehicleSelector, setShowMultiVehicleSelector] = useState(false);
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

  const isVehicleCompatible = (vehicle: typeof vehicleTypes[0]) => {
    if (multiCarMode) return true; // In multi-car mode, all vehicles are available

    const totalPassengers = parseInt(bookingData.passengers) + parseInt(bookingData.children);
    const totalLuggage = parseInt(bookingData.luggage);

    return totalPassengers <= vehicle.maxPassengers && totalLuggage <= vehicle.maxLuggage;
  };

  const getTotalCapacityFromMultiVehicles = () => {
    let totalPassengers = 0;
    let totalLuggage = 0;

    selectedVehicles.forEach(selection => {
      const vehicle = vehicleTypes.find(v => v.id === selection.vehicleId);
      if (vehicle) {
        totalPassengers += vehicle.maxPassengers * selection.quantity;
        totalLuggage += vehicle.maxLuggage * selection.quantity;
      }
    });

    return { totalPassengers, totalLuggage };
  };

  const toggleMultiCarMode = () => {
    setMultiCarMode(!multiCarMode);
    if (!multiCarMode) {
      // Entering multi-car mode - clear single vehicle selection
      setBookingData({ ...bookingData, vehicleType: "" });
      setSelectedVehicles([]);
    } else {
      // Exiting multi-car mode - clear multi-vehicle selection
      setSelectedVehicles([]);
    }
  };

  const handleMultiVehicleSelection = (vehicleId: string) => {
    if (selectedVehicles.includes(vehicleId)) {
      setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
    } else {
      setSelectedVehicles([...selectedVehicles, vehicleId]);
    }
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

    if (!isAuthenticated) {
      // Redirect to login page
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/signin?redirect=book");
      return;
    }

    // Save booking data to localStorage for the payment process
    const fullBookingData = {
      ...bookingData,
      childSeats: childSeats,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pendingBooking", JSON.stringify(fullBookingData));

    // Redirect to payment summary page
    navigate("/payment-summary");
  };

  const handleChildSeatsChange = (seats: ChildSeat[]) => {
    setChildSeats(seats);
    setBookingData(prev => ({
      ...prev,
      childSeats: seats.length.toString()
    }));
  };

  const handleLuggageChange = (luggage: LuggageItem[]) => {
    setLuggageItems(luggage);
  };

  const calculateEstimatedPrice = () => {
    const basePrice = vehicleTypes.find((v) => v.id === bookingData.vehicleType)?.price || "€25";
    const basePriceNum = parseInt(basePrice.replace(/[^\d]/g, ''));
    const childSeatsPrice = childSeats.reduce((total, seat) => total + seat.price, 0);
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
                            min={bookingData.date || new Date().toISOString().split("T")[0]}
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
                  {/* Mobile-optimized passenger/luggage selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-ocean/40 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-0 sm:flex-col flex-1">
                        <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-ocean sm:mb-2 flex-shrink-0" />
                        <label className="text-sm font-medium text-gray-700 sm:mb-2 flex-1 sm:flex-none sm:text-center">
                          Adultos
                        </label>
                      </div>
                      <div className="w-20 sm:w-full">
                        <Select
                          value={bookingData.passengers}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, passengers: value })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'adulto' : 'adultos'}
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
                      <div className="w-20 sm:w-full">
                        <Select
                          value={bookingData.children}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, children: value })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'niño' : 'niños'}
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
                      <div className="w-20 sm:w-full">
                        <Select
                          value={bookingData.luggage}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, luggage: value })
                          }
                        >
                          <SelectTrigger className="w-full min-w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'maleta' : 'maletas'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Segunda fila: Configuración detallada dividida en dos columnas */}
                  {(parseInt(bookingData.children) > 0 || parseInt(bookingData.luggage) > 0) && (
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Columna 1: Selector de edad de niños */}
                      {parseInt(bookingData.children) > 0 && (
                        <div>
                          <ChildrenAgeSelector
                            numberOfChildren={parseInt(bookingData.children)}
                            onChildSeatsChange={handleChildSeatsChange}
                          />
                        </div>
                      )}

                      {/* Columna 2: Selector de tamaño de maletas */}
                      {parseInt(bookingData.luggage) > 0 && (
                        <div>
                          <LuggageSizeSelector
                            numberOfLuggage={parseInt(bookingData.luggage)}
                            onLuggageChange={handleLuggageChange}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Selection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CarIcon className="w-5 h-5 text-ocean" />
                      {multiCarMode ? "Seleccionar Varios Vehículos" : "Select Vehicle"}
                    </CardTitle>
                    <Button
                      onClick={toggleMultiCarMode}
                      variant={multiCarMode ? "default" : "outline"}
                      size="sm"
                      className={multiCarMode ? "bg-purple text-white" : "border-purple text-purple hover:bg-purple hover:text-white"}
                    >
                      {multiCarMode ? "Modo Individual" : "Reservar Varios Coches"}
                    </Button>
                  </div>
                  {multiCarMode && (
                    <p className="text-sm text-gray-600 mt-2">
                      Modo empresarial: Selecciona múltiples vehículos para grandes grupos.
                      Vehículos seleccionados: {selectedVehicles.length}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicleTypes.map((vehicle) => {
                      const isCompatible = isVehicleCompatible(vehicle);
                      const totalPassengers = parseInt(bookingData.passengers) + parseInt(bookingData.children);
                      const totalLuggage = parseInt(bookingData.luggage);

                      const isSelected = multiCarMode
                        ? selectedVehicles.includes(vehicle.id)
                        : bookingData.vehicleType === vehicle.id;

                      return (
                        <div
                          key={vehicle.id}
                          className={`border-2 rounded-lg p-4 transition-all relative ${
                            multiCarMode
                              ? isSelected
                                ? "border-purple bg-purple/10 cursor-pointer"
                                : "border-gray-200 cursor-pointer hover:border-purple"
                              : !isCompatible
                              ? "border-red-200 bg-red-50/50 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "border-ocean bg-ocean/10 cursor-pointer"
                              : "border-gray-200 cursor-pointer hover:border-ocean"
                          }`}
                          onClick={() => {
                            if (multiCarMode) {
                              handleMultiVehicleSelection(vehicle.id);
                            } else if (isCompatible) {
                              setBookingData({
                                ...bookingData,
                                vehicleType: vehicle.id,
                              });
                            }
                          }}
                        >
                          {/* Overlay para vehículos no compatibles (solo en modo individual) */}
                          {!multiCarMode && !isCompatible && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              No Compatible
                            </div>
                          )}

                          {/* Indicator for multi-car mode */}
                          {multiCarMode && isSelected && (
                            <div className="absolute top-2 right-2 bg-purple text-white text-xs px-2 py-1 rounded-full font-medium">
                              Seleccionado
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className={`font-semibold ${
                                isCompatible ? "text-gray-900" : "text-gray-500"
                              }`}>
                                {vehicle.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {vehicle.capacity}
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                Max: {vehicle.maxPassengers} pasajeros, {vehicle.maxLuggage} maletas
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={isCompatible ? "bg-ocean/10 text-ocean" : "bg-gray-100 text-gray-500"}
                            >
                              {vehicle.price}
                            </Badge>
                          </div>

                          <p className={`text-sm mb-3 ${
                            isCompatible ? "text-gray-600" : "text-gray-500"
                          }`}>
                            {vehicle.description}
                          </p>

                          {/* Mostrar problemas de compatibilidad */}
                          {!isCompatible && (
                            <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                              <div className="font-medium mb-1">Requisitos no cumplidos:</div>
                              {totalPassengers > vehicle.maxPassengers && (
                                <div>• Demasiados pasajeros ({totalPassengers} &gt; {vehicle.maxPassengers})</div>
                              )}
                              {totalLuggage > vehicle.maxLuggage && (
                                <div>• Demasiadas maletas ({totalLuggage} &gt; {vehicle.maxLuggage})</div>
                              )}
                            </div>
                          )}

                          <div className="space-y-1">
                            {vehicle.features.map((feature, index) => (
                              <div
                                key={index}
                                className={`flex items-center text-xs ${
                                  isCompatible ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                <div className={`w-1 h-1 rounded-full mr-2 ${
                                  isCompatible ? "bg-ocean" : "bg-gray-400"
                                }`}></div>
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
