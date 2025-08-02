import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsWidget from "@/components/StatsWidget";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import {
  CarIcon,
  UsersIcon,
  TrendingUpIcon,
  MapPinIcon,
  ClockIcon,
  EuroIcon,
  CalendarIcon,
  PhoneIcon,
  MessageSquareIcon,
  SettingsIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EditIcon,
  StarIcon,
} from "lucide-react";

export default function FleetManagerPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Redirect if not admin
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const drivers = [
    {
      id: "D001",
      name: "Carlos Rodríguez",
      phone: "+34 600 123 456",
      email: "carlos.rodriguez@email.com",
      vehicle: "BMW Serie 5 (2020)",
      plate: "1234 ABC",
      status: "active",
      location: "Málaga Airport",
      rating: 4.9,
      totalTrips: 234,
      todayTrips: 3,
      todayEarnings: 105,
      availability: "available",
      joinDate: "2023-06-15",
      documents: {
        license: { valid: true, expires: "2025-06-15" },
        insurance: { valid: true, expires: "2024-12-31" },
        itv: { valid: true, expires: "2025-03-20" },
      }
    },
    {
      id: "D002",
      name: "Ana Fernández",
      phone: "+34 600 654 321",
      email: "ana.fernandez@email.com",
      vehicle: "Mercedes E-Class (2019)",
      plate: "5678 DEF",
      status: "active",
      location: "En viaje → Marbella",
      rating: 4.8,
      totalTrips: 189,
      todayTrips: 2,
      todayEarnings: 80,
      availability: "busy",
      joinDate: "2023-08-20",
      documents: {
        license: { valid: true, expires: "2025-08-20" },
        insurance: { valid: true, expires: "2024-11-30" },
        itv: { valid: false, expires: "2024-12-01" },
      }
    },
    {
      id: "D003",
      name: "Miguel Torres",
      phone: "+34 600 789 012",
      email: "miguel.torres@email.com",
      vehicle: "Audi A6 (2021)",
      plate: "9012 GHI",
      status: "inactive",
      location: "Desconectado",
      rating: 4.7,
      totalTrips: 156,
      todayTrips: 0,
      todayEarnings: 0,
      availability: "offline",
      joinDate: "2023-10-10",
      documents: {
        license: { valid: true, expires: "2025-10-10" },
        insurance: { valid: true, expires: "2024-12-15" },
        itv: { valid: true, expires: "2025-05-10" },
      }
    },
    {
      id: "D004",
      name: "Lucía Morales",
      phone: "+34 600 345 678",
      email: "lucia.morales@email.com",
      vehicle: "Volkswagen Passat (2020)",
      plate: "3456 JKL",
      status: "active",
      location: "Puerto Banús",
      rating: 4.9,
      totalTrips: 298,
      todayTrips: 4,
      todayEarnings: 140,
      availability: "available",
      joinDate: "2023-04-05",
      documents: {
        license: { valid: true, expires: "2025-04-05" },
        insurance: { valid: true, expires: "2024-12-20" },
        itv: { valid: true, expires: "2025-02-15" },
      }
    }
  ];

  const recentTrips = [
    {
      id: "T001",
      driver: "Carlos Rodríguez",
      client: "Juan Pérez",
      route: "Málaga Airport → Hotel Majestic",
      date: "2024-12-22",
      time: "14:30",
      status: "completed",
      earnings: "€35",
      rating: 5,
    },
    {
      id: "T002",
      driver: "Ana Fernández",
      client: "María González",
      route: "Marbella → Gibraltar Airport",
      date: "2024-12-22",
      time: "09:15",
      status: "in_progress",
      earnings: "€80",
      rating: null,
    },
    {
      id: "T003",
      driver: "Lucía Morales",
      client: "Pedro Sánchez",
      route: "Puerto Banús → Estepona",
      date: "2024-12-22",
      time: "11:45",
      status: "completed",
      earnings: "€25",
      rating: 4,
    },
  ];

  const unassignedTrips = [
    {
      id: "UT001",
      client: "Roberto López",
      clientPhone: "+34 600 111 222",
      route: "Aeropuerto de Málaga → Hotel Villa Padierna",
      origin: "Aeropuerto de Málaga (AGP)",
      destination: "Hotel Villa Padierna, Benahavís",
      date: "2024-12-23",
      time: "16:00",
      passengers: 3,
      luggage: 2,
      vehicleType: "premium",
      price: 85,
      flightNumber: "RY4521",
      specialRequests: "Cliente VIP, coche premium requerido",
      bookingTime: "2024-12-22 10:30",
    },
    {
      id: "UT002",
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
      flightNumber: "BA492",
      specialRequests: "Salida temprana, mucho equipaje",
      bookingTime: "2024-12-22 18:45",
    },
    {
      id: "UT003",
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
      flightNumber: "",
      specialRequests: "Familia con niños, asientos infantiles necesarios",
      bookingTime: "2024-12-22 20:12",
    },
    {
      id: "UT004",
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
      flightNumber: "VY2104",
      specialRequests: "",
      bookingTime: "2024-12-23 09:15",
    },
  ];

  const getTotalEarnings = () => {
    return drivers.reduce((sum, driver) => sum + driver.todayEarnings, 0);
  };

  const getAvailableDrivers = () => {
    return drivers.filter(d => d.availability === "available").length;
  };

  const getActiveDrivers = () => {
    return drivers.filter(d => d.status === "active").length;
  };

  const getTotalTripsToday = () => {
    return drivers.reduce((sum, driver) => sum + driver.todayTrips, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const assignTrip = (driverId: string, tripId?: string) => {
    if (tripId) {
      // Assign specific trip to driver
      const driver = drivers.find(d => d.id === driverId);
      const trip = unassignedTrips.find(t => t.id === tripId);
      if (driver && trip) {
        alert(`Viaje ${trip.route} asignado a ${driver.name}`);
        setShowAssignModal(false);
        setSelectedTrip(null);
      }
    } else {
      // Show available trips for assignment
      setSelectedDriver(driverId);
      setShowAssignModal(true);
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    const types = {
      economy: "Económico",
      comfort: "Confort",
      premium: "Premium",
      luxury: "Lujo"
    };
    return types[type as keyof typeof types] || type;
  };

  const canDriverTakeTrip = (driver: any, trip: any) => {
    // Check if driver is available and meets trip requirements
    if (driver.availability !== "available") return false;

    // Add logic for vehicle type compatibility
    const driverVehicleTypes = {
      "BMW Serie 5": ["comfort", "premium"],
      "Mercedes E-Class": ["comfort", "premium", "luxury"],
      "Audi A6": ["comfort", "premium"],
      "Volkswagen Passat": ["economy", "comfort"]
    };

    const compatibleTypes = driverVehicleTypes[driver.vehicle.split('(')[0].trim() as keyof typeof driverVehicleTypes] || ["economy"];
    return compatibleTypes.includes(trip.vehicleType);
  };

  const contactDriver = (driverId: string, method: 'call' | 'message') => {
    const driver = drivers.find(d => d.id === driverId);
    if (method === 'call') {
      alert(`Llamando a ${driver?.name}: ${driver?.phone}`);
    } else {
      alert(`Enviando mensaje a ${driver?.name}`);
    }
  };

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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
            Panel de Gestión de Flota
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Administra tu flota de conductores y vehículos
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsWidget
            title="Conductores Activos"
            value={getActiveDrivers()}
            change={{ value: "+1", type: "increase", period: "esta semana" }}
            icon={UsersIcon}
            color="ocean"
            subtitle={`${getAvailableDrivers()} disponibles ahora`}
          />
          <StatsWidget
            title="Viajes Hoy"
            value={getTotalTripsToday()}
            change={{ value: "+15%", type: "increase", period: "vs ayer" }}
            icon={CarIcon}
            color="coral"
            subtitle="En toda la flota"
          />
          <StatsWidget
            title="Ingresos Hoy"
            value={`€${getTotalEarnings()}`}
            change={{ value: "+22%", type: "increase", period: "vs ayer" }}
            icon={EuroIcon}
            color="success"
            subtitle="Total de la flota"
          />
          <StatsWidget
            title="Rating Promedio"
            value="4.8"
            change={{ value: "+0.1", type: "increase", period: "este mes" }}
            icon={StarIcon}
            color="warning"
            subtitle="Satisfacción del cliente"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="drivers" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="drivers" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Conductores</span>
              <span className="sm:hidden">Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Viajes</span>
              <span className="sm:hidden">Trips</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Vehículos</span>
              <span className="sm:hidden">Cars</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Análisis</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-ocean" />
                    Gestión de Conductores
                  </CardTitle>
                  <Button className="bg-ocean hover:bg-ocean/90">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Añadir Conductor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {drivers.map((driver) => (
                    <Card key={driver.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-ocean">
                                {driver.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-navy text-sm sm:text-base">{driver.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 break-words">{driver.vehicle}</p>
                              <p className="text-xs text-gray-500">{driver.plate}</p>
                            </div>
                          </div>
                          <Badge
                            className={`${getStatusColor(driver.availability)} text-xs px-2 py-1 whitespace-nowrap self-start`}
                            variant="outline"
                          >
                            {driver.availability === "available" && "Disponible"}
                            {driver.availability === "busy" && "Ocupado"}
                            {driver.availability === "offline" && "Offline"}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Ubicación:</span>
                            <span className="font-medium text-right text-xs sm:text-sm truncate ml-2">{driver.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-medium text-xs sm:text-sm">{driver.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Viajes hoy:</span>
                            <span className="font-medium">{driver.todayTrips}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Ganado hoy:</span>
                            <span className="font-medium text-green-600">€{driver.todayEarnings}</span>
                          </div>
                        </div>

                        {/* Document Status */}
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Documentos:</h4>
                          <div className="flex gap-1 justify-between">
                            <div className={`flex-1 text-center p-1 rounded text-xs ${
                              driver.documents.license.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Lic.
                            </div>
                            <div className={`flex-1 text-center p-1 rounded text-xs ${
                              driver.documents.insurance.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Seg.
                            </div>
                            <div className={`flex-1 text-center p-1 rounded text-xs ${
                              driver.documents.itv.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              ITV
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {driver.availability === "available" && (
                            <Button
                              size="sm"
                              onClick={() => assignTrip(driver.id)}
                              className="w-full sm:flex-1 bg-ocean hover:bg-ocean/90 text-xs sm:text-sm"
                            >
                              Asignar Viaje
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => contactDriver(driver.id, 'call')}
                              className="flex-1 sm:flex-none"
                            >
                              <PhoneIcon className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => contactDriver(driver.id, 'message')}
                              className="flex-1 sm:flex-none"
                            >
                              <MessageSquareIcon className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                              <EditIcon className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-4 sm:space-y-6">
            {/* Unassigned Trips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="w-5 h-5 text-orange-500" />
                  Viajes Sin Asignar ({unassignedTrips.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unassignedTrips.map((trip) => (
                    <Card key={trip.id} className="border border-orange-200 bg-orange-50/50">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                              <h3 className="font-semibold text-navy text-sm sm:text-base pr-2 mb-1 sm:mb-0">{trip.route}</h3>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  {getVehicleTypeLabel(trip.vehicleType)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  €{trip.price}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
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
                                <span className="text-gray-600">Teléfono:</span>
                                <p className="font-medium text-xs">{trip.clientPhone}</p>
                              </div>
                            </div>
                            {trip.specialRequests && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                <span className="font-medium text-blue-800">Solicitudes:</span>
                                <p className="text-blue-700">{trip.specialRequests}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedTrip(trip.id);
                                setShowAssignModal(true);
                              }}
                              className="bg-ocean hover:bg-ocean/90 w-full sm:w-auto text-xs sm:text-sm"
                            >
                              Asignar a Conductor
                            </Button>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => alert(`Llamando a ${trip.client}: ${trip.clientPhone}`)}
                                className="flex-1 sm:flex-none text-xs"
                              >
                                <PhoneIcon className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Llamar</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 sm:flex-none text-xs"
                              >
                                <MessageSquareIcon className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Chat</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {unassignedTrips.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p>No hay viajes sin asignar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-ocean" />
                  Viajes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <Card key={trip.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                              <h3 className="font-semibold text-navy text-sm sm:text-base pr-2">{trip.route}</h3>
                              <Badge
                                className={
                                  trip.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : trip.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {trip.status === "completed" && "Completado"}
                                {trip.status === "in_progress" && "En Progreso"}
                                {trip.status === "pending" && "Pendiente"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
                              <div>
                                <span className="text-gray-600">Conductor:</span>
                                <p className="font-medium">{trip.driver}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Cliente:</span>
                                <p className="font-medium">{trip.client}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Fecha/Hora:</span>
                                <p className="font-medium">{trip.date} {trip.time}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Ingresos:</span>
                                <p className="font-medium text-green-600">{trip.earnings}</p>
                              </div>
                            </div>
                            {trip.rating && (
                              <div className="mt-2 flex items-center">
                                <span className="text-xs sm:text-sm text-gray-600 mr-2">Valoración:</span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < trip.rating!
                                          ? "text-yellow-500 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 text-xs sm:text-sm font-medium">{trip.rating}/5</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-ocean" />
                  Gestión de Vehículos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gestión de Vehículos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Funcionalidad en desarrollo. Aquí podrás gestionar mantenimiento, seguros y documentación de vehículos.
                  </p>
                  <Button className="bg-ocean hover:bg-ocean/90">
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-ocean" />
                  Análisis y Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUpIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Análisis Avanzado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Próximamente tendrás acceso a gráficos detallados, reportes de rendimiento y análisis predictivo.
                  </p>
                  <Button className="bg-ocean hover:bg-ocean/90">
                    Ver Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-ocean" />
                  Asignar Viaje a Conductor
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTrip(null);
                  }}
                >
                  <XCircleIcon className="w-5 h-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const trip = unassignedTrips.find(t => t.id === selectedTrip);
                if (!trip) return null;

                return (
                  <div className="space-y-6">
                    {/* Trip Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-navy mb-3">{trip.route}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                          <span className="text-gray-600">Precio:</span>
                          <p className="font-medium text-green-600">€{trip.price}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo vehículo:</span>
                          <p className="font-medium">{getVehicleTypeLabel(trip.vehicleType)}</p>
                        </div>
                        {trip.flightNumber && (
                          <div>
                            <span className="text-gray-600">Vuelo:</span>
                            <p className="font-medium">{trip.flightNumber}</p>
                          </div>
                        )}
                      </div>
                      {trip.specialRequests && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <span className="font-medium text-blue-800">Solicitudes especiales:</span>
                          <p className="text-blue-700 text-sm">{trip.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    {/* Available Drivers */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Conductores Disponibles</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {drivers
                          .filter(driver => canDriverTakeTrip(driver, trip))
                          .map((driver) => (
                            <Card
                              key={driver.id}
                              className="border border-gray-200 hover:border-ocean cursor-pointer transition-colors"
                              onClick={() => assignTrip(driver.id, trip.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                                      <span className="text-sm font-bold text-ocean">
                                        {driver.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-navy">{driver.name}</h3>
                                      <p className="text-sm text-gray-600">{driver.vehicle}</p>
                                      <div className="flex items-center mt-1">
                                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                        <span className="text-sm">{driver.rating}</span>
                                        <span className="text-xs text-gray-500 ml-2">{driver.totalTrips} viajes</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-green-100 text-green-800 mb-1">
                                      Disponible
                                    </Badge>
                                    <p className="text-xs text-gray-500">{driver.location}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        {drivers.filter(driver => canDriverTakeTrip(driver, trip)).length === 0 && (
                          <div className="text-center py-6 text-gray-500">
                            <XCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p>No hay conductores disponibles para este viaje</p>
                            <p className="text-sm mt-1">Tipo de vehículo requerido: {getVehicleTypeLabel(trip.vehicleType)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
