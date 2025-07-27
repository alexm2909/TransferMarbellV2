import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  MessageSquareIcon,
  RepeatIcon,
  StarIcon,
  EyeIcon,
  MoreHorizontalIcon,
  XIcon,
} from "lucide-react";

interface Booking {
  id: string;
  status: "upcoming" | "completed" | "cancelled" | "in_progress";
  origin: string;
  destination: string;
  date: string;
  time: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  children: number;
  luggage: number;
  vehicleType: string;
  driverName?: string;
  driverPhone?: string;
  flightNumber?: string;
  price: number;
  paymentStatus: "paid" | "pending" | "refunded";
  createdAt: string;
  rating?: number;
}

export default function ViewBookings() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
      return;
    }

    // Load mock bookings - in a real app, this would come from API
    const mockBookings: Booking[] = [
      {
        id: "TM001234",
        status: "upcoming",
        origin: "Aeropuerto de Málaga (AGP)",
        destination: "Hotel Majestic, Marbella",
        date: "2024-12-30",
        time: "14:30",
        passengers: 2,
        children: 0,
        luggage: 2,
        vehicleType: "comfort",
        driverName: "Carlos Rodríguez",
        driverPhone: "+34 600 123 456",
        flightNumber: "IB6754",
        price: 45,
        paymentStatus: "paid",
        createdAt: "2024-12-27 10:15",
      },
      {
        id: "TM001235",
        status: "completed",
        origin: "Hotel Villa Padierna, Benahavís",
        destination: "Aeropuerto de Gibraltar (GIB)",
        date: "2024-12-20",
        time: "09:00",
        returnDate: "2024-12-22",
        returnTime: "16:30",
        passengers: 4,
        children: 2,
        luggage: 4,
        vehicleType: "van",
        driverName: "Ana Fernández",
        driverPhone: "+34 655 987 654",
        price: 130,
        paymentStatus: "paid",
        createdAt: "2024-12-18 16:22",
        rating: 5,
      },
      {
        id: "TM001236",
        status: "completed",
        origin: "Puerto Banús",
        destination: "Estación AVE Málaga",
        date: "2024-12-15",
        time: "11:45",
        passengers: 1,
        children: 0,
        luggage: 1,
        vehicleType: "economy",
        driverName: "Miguel Torres",
        driverPhone: "+34 678 555 123",
        price: 35,
        paymentStatus: "paid",
        createdAt: "2024-12-14 19:30",
        rating: 4,
      },
      {
        id: "TM001237",
        status: "cancelled",
        origin: "Marbella Centro",
        destination: "Aeropuerto de Málaga (AGP)",
        date: "2024-12-10",
        time: "08:00",
        passengers: 2,
        children: 1,
        luggage: 3,
        vehicleType: "comfort",
        price: 55,
        paymentStatus: "refunded",
        createdAt: "2024-12-08 14:20",
      },
    ];

    setBookings(mockBookings);
  }, [isAuthenticated, isLoading, navigate]);

  const getVehicleDetails = (type: string) => {
    const vehicles = {
      economy: { name: "Economy", icon: "🚗" },
      comfort: { name: "Comfort", icon: "🚙" },
      premium: { name: "Premium", icon: "🚗" },
      van: { name: "Van", icon: "🚐" },
      luxury: { name: "Luxury", icon: "🚗" },
    };
    return vehicles[type as keyof typeof vehicles] || vehicles.economy;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      upcoming: {
        label: "Próximo",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      in_progress: {
        label: "En Curso",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      completed: {
        label: "Completado",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.upcoming;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      paid: { label: "Pagado", className: "bg-green-100 text-green-700" },
      pending: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-700",
      },
      refunded: {
        label: "Reembolsado",
        className: "bg-blue-100 text-blue-700",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const upcomingBookings = filteredBookings.filter(
    (b) => b.status === "upcoming" || b.status === "in_progress",
  );
  const completedBookings = filteredBookings.filter(
    (b) => b.status === "completed",
  );
  const cancelledBookings = filteredBookings.filter(
    (b) => b.status === "cancelled",
  );

  const handleRepeatBooking = (booking: Booking) => {
    // Pre-fill booking form with previous booking data
    const preBookingData = {
      origin: booking.origin,
      destination: booking.destination,
      date: "",
      time: booking.time,
    };
    localStorage.setItem("preBookingData", JSON.stringify(preBookingData));
    navigate("/book");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Cargando reservas...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-navy">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">
            Historial completo de tus traslados con Transfermarbell
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por destino, origen o número de reserva..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Link to="/book">
                <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                  Nueva Reserva
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming" className="relative">
              Próximas
              {upcomingBookings.length > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white text-xs">
                  {upcomingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completadas
              {completedBookings.length > 0 && (
                <Badge className="ml-2 bg-gray-600 text-white text-xs">
                  {completedBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Canceladas
              {cancelledBookings.length > 0 && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">
                  {cancelledBookings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes reservas próximas
                  </h3>
                  <p className="text-gray-500 mb-6">
                    ¡Reserva tu próximo traslado ahora!
                  </p>
                  <Link to="/book">
                    <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                      Nueva Reserva
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onRepeat={handleRepeatBooking}
                  onViewDetails={setSelectedBooking}
                />
              ))
            )}
          </TabsContent>

          {/* Completed Bookings */}
          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes reservas completadas
                  </h3>
                  <p className="text-gray-500">
                    Tus viajes completados aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onRepeat={handleRepeatBooking}
                  onViewDetails={setSelectedBooking}
                />
              ))
            )}
          </TabsContent>

          {/* Cancelled Bookings */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <XIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes reservas canceladas
                  </h3>
                  <p className="text-gray-500">
                    Las reservas canceladas aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onRepeat={handleRepeatBooking}
                  onViewDetails={setSelectedBooking}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          getVehicleDetails={getVehicleDetails}
        />
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  onRepeat: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
}

function BookingCard({ booking, onRepeat, onViewDetails }: BookingCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      upcoming: {
        label: "Próximo",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      in_progress: {
        label: "En Curso",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      completed: {
        label: "Completado",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.upcoming;
  };

  const getVehicleDetails = (type: string) => {
    const vehicles = {
      economy: { name: "Economy", icon: "🚗" },
      comfort: { name: "Comfort", icon: "🚙" },
      premium: { name: "Premium", icon: "🚗" },
      van: { name: "Van", icon: "🚐" },
      luxury: { name: "Luxury", icon: "🚗" },
    };
    return vehicles[type as keyof typeof vehicles] || vehicles.economy;
  };

  const statusBadge = getStatusBadge(booking.status);
  const vehicle = getVehicleDetails(booking.vehicleType);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusBadge.className} variant="outline">
                {statusBadge.label}
              </Badge>
              <span className="text-sm text-gray-500">#{booking.id}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {booking.origin} → {booking.destination}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {booking.date}
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {booking.time}
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                {booking.passengers} + {booking.children}
              </div>
              <div className="flex items-center gap-1">
                <LuggageIcon className="w-4 h-4" />
                {booking.luggage} maletas
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-ocean mb-1">
              €{booking.price}
            </div>
            <div className="text-sm text-gray-500">
              {vehicle.icon} {vehicle.name}
            </div>
            {booking.rating && (
              <div className="flex items-center mt-1">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm">{booking.rating}/5</span>
              </div>
            )}
          </div>
        </div>

        {booking.returnDate && (
          <div className="mb-4 p-3 bg-ocean-light/10 border border-ocean/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-ocean">
              <RepeatIcon className="w-4 h-4" />
              <span className="font-medium">
                Viaje de vuelta: {booking.returnDate} a las {booking.returnTime}
              </span>
            </div>
          </div>
        )}

        {booking.driverName && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Conductor:</span>{" "}
              {booking.driverName}
            </div>
            {booking.driverPhone && (
              <div className="text-sm text-gray-600">{booking.driverPhone}</div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(booking)}
              className="w-full sm:w-auto"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
            {booking.status === "upcoming" && (
              <Link
                to={`/chat?transfer=${booking.id}`}
                className="w-full sm:w-auto"
              >
                <Button size="sm" variant="outline" className="w-full">
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            {booking.status === "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRepeat(booking)}
                className="w-full sm:w-auto border-ocean text-ocean hover:bg-ocean hover:text-white"
              >
                <RepeatIcon className="w-4 h-4 mr-2" />
                Repetir
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  getVehicleDetails: (type: string) => { name: string; icon: string };
}

function BookingDetailsModal({
  booking,
  onClose,
  getVehicleDetails,
}: BookingDetailsModalProps) {
  const vehicle = getVehicleDetails(booking.vehicleType);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Detalles de Reserva #{booking.id}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Details */}
          <div>
            <h3 className="font-semibold mb-3">Información del Viaje</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Origen:</span>
                <span className="font-medium">{booking.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destino:</span>
                <span className="font-medium">{booking.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha y Hora:</span>
                <span className="font-medium">
                  {booking.date} a las {booking.time}
                </span>
              </div>
              {booking.returnDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Vuelta:</span>
                  <span className="font-medium">
                    {booking.returnDate} a las {booking.returnTime}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Vehículo:</span>
                <span className="font-medium">
                  {vehicle.icon} {vehicle.name}
                </span>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div>
            <h3 className="font-semibold mb-3">Pasajeros</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <UsersIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                <div className="font-medium">{booking.passengers}</div>
                <div className="text-xs text-gray-600">Adultos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">👶</div>
                <div className="font-medium">{booking.children}</div>
                <div className="text-xs text-gray-600">Niños</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <LuggageIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                <div className="font-medium">{booking.luggage}</div>
                <div className="text-xs text-gray-600">Maletas</div>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {booking.driverName && (
            <div>
              <h3 className="font-semibold mb-3">Conductor</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{booking.driverName}</div>
                {booking.driverPhone && (
                  <div className="text-sm text-gray-600">
                    {booking.driverPhone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-3">Información de Pago</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg">€{booking.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <Badge
                  className={
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : booking.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }
                >
                  {booking.paymentStatus === "paid"
                    ? "Pagado"
                    : booking.paymentStatus === "pending"
                      ? "Pendiente"
                      : "Reembolsado"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de reserva:</span>
                <span className="font-medium">{booking.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {booking.status === "upcoming" && (
              <Link to={`/chat?transfer=${booking.id}`} className="flex-1">
                <Button className="w-full bg-ocean hover:bg-ocean/90">
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Chat con Conductor
                </Button>
              </Link>
            )}
            {booking.status === "completed" && (
              <Button
                className="flex-1 bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90"
                onClick={() => {
                  // Implement repeat booking logic
                  onClose();
                }}
              >
                <RepeatIcon className="w-4 h-4 mr-2" />
                Repetir Reserva
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
