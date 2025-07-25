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

  // Redirect if not fleet manager
  if (user?.role !== "fleet-manager") {
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

  const assignTrip = (driverId: string) => {
    alert(`Asignar viaje al conductor ${driverId}`);
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
                👥 Gestión de Flota
              </Badge>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Panel de Gestión de Flota
          </h1>
          <p className="text-gray-600">
            Administra tu flota de conductores y vehículos
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <Tabs defaultValue="drivers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drivers">Conductores</TabsTrigger>
            <TabsTrigger value="trips">Viajes</TabsTrigger>
            <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((driver) => (
                    <Card key={driver.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-ocean">
                                {driver.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-navy">{driver.name}</h3>
                              <p className="text-sm text-gray-600">{driver.vehicle}</p>
                              <p className="text-xs text-gray-500">{driver.plate}</p>
                            </div>
                          </div>
                          <Badge
                            className={getStatusColor(driver.availability)}
                            variant="outline"
                          >
                            {driver.availability === "available" && "Disponible"}
                            {driver.availability === "busy" && "Ocupado"}
                            {driver.availability === "offline" && "Desconectado"}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Ubicación:</span>
                            <span className="font-medium">{driver.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-medium">{driver.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Viajes hoy:</span>
                            <span className="font-medium">{driver.todayTrips}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Ganado hoy:</span>
                            <span className="font-medium text-green-600">€{driver.todayEarnings}</span>
                          </div>
                        </div>

                        {/* Document Status */}
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Documentos:</h4>
                          <div className="grid grid-cols-3 gap-1">
                            <div className={`text-center p-1 rounded text-xs ${
                              driver.documents.license.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Licencia
                            </div>
                            <div className={`text-center p-1 rounded text-xs ${
                              driver.documents.insurance.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Seguro
                            </div>
                            <div className={`text-center p-1 rounded text-xs ${
                              driver.documents.itv.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              ITV
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {driver.availability === "available" && (
                            <Button
                              size="sm"
                              onClick={() => assignTrip(driver.id)}
                              className="flex-1 bg-ocean hover:bg-ocean/90"
                            >
                              Asignar Viaje
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => contactDriver(driver.id, 'call')}
                          >
                            <PhoneIcon className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => contactDriver(driver.id, 'message')}
                          >
                            <MessageSquareIcon className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <EditIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
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
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-navy">{trip.route}</h3>
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                                <span className="text-sm text-gray-600 mr-2">Valoración:</span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < trip.rating!
                                          ? "text-yellow-500 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 text-sm font-medium">{trip.rating}/5</span>
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
    </div>
  );
}
