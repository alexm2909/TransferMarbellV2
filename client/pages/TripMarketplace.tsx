import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import {
  CarIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  LuggageIcon,
  EuroIcon,
  PhoneIcon,
  MessageSquareIcon,
  PlaneIcon,
  FilterIcon,
  SearchIcon,
  StarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  ArrowLeftIcon,
} from "lucide-react";

interface Trip {
  id: string;
  client: string;
  clientPhone: string;
  route: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  vehicleType: "economy" | "comfort" | "premium" | "luxury";
  price: number;
  distance: number;
  duration: number;
  flightNumber?: string;
  specialRequests?: string;
  bookingTime: string;
  urgency: "low" | "medium" | "high";
  status: "available" | "claimed" | "assigned";
  claimedBy?: string;
  assignedBy?: string;
}

export default function TripMarketplace() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Redirect if not authenticated or not driver/fleet-manager
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !["driver", "fleet-manager"].includes(user?.role || ""))) {
      navigate("/signin");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Mock trips data
  useEffect(() => {
    const mockTrips: Trip[] = [
      {
        id: "MT001",
        client: "Roberto López",
        clientPhone: "+34 600 111 222",
        route: "Aeropuerto de Málaga ��� Hotel Villa Padierna",
        origin: "Aeropuerto de Málaga (AGP)",
        destination: "Hotel Villa Padierna, Benahavís",
        date: "2024-12-23",
        time: "16:00",
        passengers: 3,
        luggage: 2,
        vehicleType: "premium",
        price: 85,
        distance: 45,
        duration: 55,
        flightNumber: "RY4521",
        specialRequests: "Cliente VIP, coche premium requerido",
        bookingTime: "2024-12-22 10:30",
        urgency: "high",
        status: "available",
      },
      {
        id: "MT002",
        client: "Sarah Johnson",
        clientPhone: "+44 7700 900 123",
        route: "Marbella Centro → Aeropuerto de Gibraltar",
        origin: "Hotel Meliá Don Pepe, Marbella",
        destination: "Aeropuerto de Gibraltar (GIB)",
        date: "2024-12-23",
        time: "08:30",
        passengers: 2,
        luggage: 4,
        vehicleType: "comfort",
        price: 90,
        distance: 75,
        duration: 85,
        flightNumber: "BA492",
        specialRequests: "Salida temprana, mucho equipaje",
        bookingTime: "2024-12-22 18:45",
        urgency: "medium",
        status: "available",
      },
      {
        id: "MT003",
        client: "Familie Schmidt",
        clientPhone: "+49 170 123 4567",
        route: "Puerto Banús → Estación María Zambrano",
        origin: "Puerto Banús, Marbella",
        destination: "Estación María Zambrano, Málaga",
        date: "2024-12-24",
        time: "12:15",
        passengers: 4,
        luggage: 3,
        vehicleType: "economy",
        price: 45,
        distance: 60,
        duration: 70,
        specialRequests: "Familia con niños, asientos infantiles necesarios",
        bookingTime: "2024-12-22 20:12",
        urgency: "low",
        status: "available",
      },
      {
        id: "MT004",
        client: "Marco Rossi",
        clientPhone: "+39 333 123 4567",
        route: "Hotel Puente Romano → Aeropuerto de Málaga",
        origin: "Hotel Puente Romano, Marbella",
        destination: "Aeropuerto de Málaga (AGP)",
        date: "2024-12-23",
        time: "13:45",
        passengers: 1,
        luggage: 1,
        vehicleType: "comfort",
        price: 65,
        distance: 55,
        duration: 60,
        flightNumber: "VY2104",
        bookingTime: "2024-12-23 09:15",
        urgency: "medium",
        status: "available",
      },
      {
        id: "MT005",
        client: "Anna Kowalski",
        clientPhone: "+48 500 123 456",
        route: "Estepona → Aeropuerto de Sevilla",
        origin: "Hotel Kempinski, Estepona",
        destination: "Aeropuerto de Sevilla (SVQ)",
        date: "2024-12-24",
        time: "06:00",
        passengers: 2,
        luggage: 2,
        vehicleType: "luxury",
        price: 150,
        distance: 200,
        duration: 180,
        flightNumber: "FR2847",
        specialRequests: "Salida muy temprana, vehículo de lujo solicitado",
        bookingTime: "2024-12-23 14:20",
        urgency: "high",
        status: "available",
      },
      {
        id: "MT006",
        client: "Jean Dubois",
        clientPhone: "+33 6 12 34 56 78",
        route: "Málaga Centro → Ronda",
        origin: "Hotel AC Málaga Palacio",
        destination: "Parador de Ronda",
        date: "2024-12-25",
        time: "10:30",
        passengers: 3,
        luggage: 2,
        vehicleType: "comfort",
        price: 75,
        distance: 100,
        duration: 90,
        specialRequests: "Tour turístico, parada en mirador",
        bookingTime: "2024-12-23 16:45",
        urgency: "low",
        status: "available",
      },
    ];

    setTrips(mockTrips);
    setFilteredTrips(mockTrips);
  }, []);

  // Filter trips based on search and filters
  useEffect(() => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterVehicleType !== "all") {
      filtered = filtered.filter(trip => trip.vehicleType === filterVehicleType);
    }

    if (filterDate !== "all") {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      
      if (filterDate === "today") {
        filtered = filtered.filter(trip => trip.date === today);
      } else if (filterDate === "tomorrow") {
        filtered = filtered.filter(trip => trip.date === tomorrow);
      }
    }

    setFilteredTrips(filtered);
  }, [trips, searchTerm, filterVehicleType, filterDate]);

  const getVehicleTypeLabel = (type: string) => {
    const types = {
      economy: "Económico",
      comfort: "Confort",
      premium: "Premium",
      luxury: "Lujo"
    };
    return types[type as keyof typeof types] || type;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Urgente";
      case "medium":
        return "Normal";
      case "low":
        return "Flexible";
      default:
        return "Normal";
    }
  };

  const handleClaimTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowClaimModal(true);
  };

  const confirmClaimTrip = () => {
    if (selectedTrip && user) {
      // Update trip status
      setTrips(prev => prev.map(trip => 
        trip.id === selectedTrip.id 
          ? { ...trip, status: user.role === "admin" ? "assigned" : "claimed" as const, claimedBy: user.name, assignedBy: user.role === "admin" ? user.name : undefined }
          : trip
      ));
      
      setShowClaimModal(false);
      setSelectedTrip(null);

      // Show success message
      alert(user.role === "admin"
        ? `Viaje asignado a tu flota: ${selectedTrip.route}`
        : `Viaje reclamado exitosamente: ${selectedTrip.route}`
      );
    }
  };

  const availableTrips = filteredTrips.filter(trip => trip.status === "available");
  const myTrips = filteredTrips.filter(trip => trip.claimedBy === user?.name || trip.assignedBy === user?.name);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="w-8 h-8 text-ocean mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy">
                Mercado de Viajes
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {user?.role === "fleet-manager" 
                  ? "Asigna viajes a tu flota o reclámalos para distribuir"
                  : "Encuentra y reclama los viajes que te convengan"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {availableTrips.length} viajes disponibles
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por ruta, cliente o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterVehicleType} onValueChange={setFilterVehicleType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="economy">Económico</SelectItem>
                    <SelectItem value="comfort">Confort</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Lujo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="tomorrow">Mañana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1">
            <TabsTrigger value="available" className="text-xs sm:text-sm py-2">
              Viajes Disponibles ({availableTrips.length})
            </TabsTrigger>
            <TabsTrigger value="my-trips" className="text-xs sm:text-sm py-2">
              Mis Viajes ({myTrips.length})
            </TabsTrigger>
          </TabsList>

          {/* Available Trips */}
          <TabsContent value="available" className="space-y-4">
            {availableTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No hay viajes disponibles
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filterVehicleType !== "all" || filterDate !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Nuevos viajes aparecerán aquí cuando estén disponibles"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {availableTrips.map((trip) => (
                  <Card key={trip.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-navy text-sm sm:text-base break-words">
                              {trip.route}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getUrgencyColor(trip.urgency)}>
                              {getUrgencyLabel(trip.urgency)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getVehicleTypeLabel(trip.vehicleType)}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              €{trip.price}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Cliente:</span>
                          <p className="font-medium">{trip.client}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fecha/Hora:</span>
                          <p className="font-medium">{trip.date} {trip.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pasajeros:</span>
                          <p className="font-medium">{trip.passengers} pax, {trip.luggage} maletas</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Distancia:</span>
                          <p className="font-medium">{trip.distance}km (~{trip.duration}min)</p>
                        </div>
                      </div>

                      {trip.flightNumber && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded text-xs sm:text-sm">
                          <PlaneIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Vuelo: {trip.flightNumber}</span>
                        </div>
                      )}

                      {trip.specialRequests && (
                        <div className="mb-4 p-3 bg-gray-50 rounded text-xs sm:text-sm">
                          <span className="font-medium text-gray-800">Solicitudes especiales:</span>
                          <p className="text-gray-700 mt-1">{trip.specialRequests}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleClaimTrip(trip)}
                          className="w-full sm:flex-1 bg-ocean hover:bg-ocean/90 text-xs sm:text-sm"
                        >
                          {user?.role === "fleet-manager" ? "Asignar a Flota" : "Reclamar Viaje"}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => alert(`Llamando a ${trip.client}: ${trip.clientPhone}`)}
                            className="flex-1 sm:flex-none text-xs"
                          >
                            <PhoneIcon className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Llamar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none text-xs"
                          >
                            <MessageSquareIcon className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Chat</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Trips */}
          <TabsContent value="my-trips" className="space-y-4">
            {myTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes viajes {user?.role === "fleet-manager" ? "asignados" : "reclamados"}
                  </h3>
                  <p className="text-gray-500">
                    Los viajes que {user?.role === "fleet-manager" ? "asignes" : "reclames"} aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {myTrips.map((trip) => (
                  <Card key={trip.id} className="border border-green-200 bg-green-50/50">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-navy text-sm sm:text-base">
                          {trip.route}
                        </h3>
                        <Badge className="bg-green-100 text-green-800">
                          {trip.status === "assigned" ? "Asignado" : "Reclamado"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Cliente:</span>
                          <p className="font-medium">{trip.client}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fecha/Hora:</span>
                          <p className="font-medium">{trip.date} {trip.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Precio:</span>
                          <p className="font-medium text-green-600">€{trip.price}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estado:</span>
                          <p className="font-medium">{getUrgencyLabel(trip.urgency)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Iniciando navegación a ${trip.origin}`)}
                          className="flex-1 text-xs"
                        >
                          Navegar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                Confirmar {user?.role === "fleet-manager" ? "Asignación" : "Reclamación"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedTrip.route}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Cliente:</span>
                      <p className="font-medium">{selectedTrip.client}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Precio:</span>
                      <p className="font-medium text-green-600">€{selectedTrip.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha:</span>
                      <p className="font-medium">{selectedTrip.date} {selectedTrip.time}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehículo:</span>
                      <p className="font-medium">{getVehicleTypeLabel(selectedTrip.vehicleType)}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {user?.role === "fleet-manager" 
                    ? "¿Confirmas que quieres asignar este viaje a tu flota? Podrás distribuirlo entre tus conductores después."
                    : "¿Confirmas que quieres reclamar este viaje? Una vez confirmado, te comprometes a realizarlo."
                  }
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowClaimModal(false);
                      setSelectedTrip(null);
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmClaimTrip}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
