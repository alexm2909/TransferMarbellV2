import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsWidget from "@/components/StatsWidget";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  PhoneIcon,
  MessageSquareIcon,
  EuroIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  NavigationIcon,
  ArrowLeftIcon,
  CalendarIcon,
  LuggageIcon,
  BabyIcon,
  StarIcon,
  TrendingUpIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

interface Transfer {
  id: string;
  status: "available" | "accepted" | "in_progress" | "completed" | "cancelled";
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  children: number;
  luggage: number;
  childSeats: number;
  price: number;
  distance: number;
  duration: number;
  clientName: string;
  clientPhone: string;
  flightNumber?: string;
  specialRequests?: string;
  vehicleType: string;
  paymentMethod: string;
  bookingTime: string;
}

export default function DriverPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState("Marbella Centro");

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "driver")) {
      navigate("/signin");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Initialize mock transfers
  useEffect(() => {
    const mockTransfers: Transfer[] = [
      {
        id: "TM001",
        status: "available",
        origin: "Aeropuerto de Málaga (AGP)",
        destination: "Hotel Majestic, Marbella",
        date: "2024-12-28",
        time: "14:30",
        passengers: 2,
        children: 0,
        luggage: 2,
        childSeats: 0,
        price: 45,
        distance: 65,
        duration: 55,
        clientName: "Ana García",
        clientPhone: "+34 612 345 678",
        flightNumber: "IB6754",
        specialRequests: "Favor de esperar en Llegadas con cartel",
        vehicleType: "comfort",
        paymentMethod: "card",
        bookingTime: "2024-12-27 10:15",
      },
      {
        id: "TM002",
        status: "available",
        origin: "Hotel Villa Padierna, Benahavís",
        destination: "Aeropuerto de Gibraltar (GIB)",
        date: "2024-12-28",
        time: "09:00",
        passengers: 4,
        children: 2,
        luggage: 4,
        childSeats: 2,
        price: 85,
        distance: 45,
        duration: 50,
        clientName: "James Wilson",
        clientPhone: "+44 7700 900123",
        specialRequests: "Sillas infantiles para niños de 3 y 6 años",
        vehicleType: "van",
        paymentMethod: "cash",
        bookingTime: "2024-12-27 16:22",
      },
      {
        id: "TM003",
        status: "accepted",
        origin: "Puerto Banús",
        destination: "Estación AVE Málaga",
        date: "2024-12-28",
        time: "11:45",
        passengers: 1,
        children: 0,
        luggage: 1,
        childSeats: 0,
        price: 35,
        distance: 75,
        duration: 65,
        clientName: "Carlos Ruiz",
        clientPhone: "+34 987 654 321",
        vehicleType: "economy",
        paymentMethod: "card",
        bookingTime: "2024-12-27 19:30",
      },
    ];
    setTransfers(mockTransfers);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAcceptTransfer = (transferId: string) => {
    setTransfers(transfers.map(t => 
      t.id === transferId ? { ...t, status: "accepted" } : t
    ));
    // Here you would typically make an API call
  };

  const handleDeclineTransfer = (transferId: string) => {
    setTransfers(transfers.filter(t => t.id !== transferId));
    // Here you would typically make an API call
  };

  const handleCompleteTransfer = (transferId: string) => {
    setTransfers(transfers.map(t => 
      t.id === transferId ? { ...t, status: "completed" } : t
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: { label: "Disponible", variant: "secondary" as const },
      accepted: { label: "Aceptado", variant: "default" as const },
      in_progress: { label: "En Curso", variant: "default" as const },
      completed: { label: "Completado", variant: "secondary" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.available;
  };

  const getVehicleTypeName = (type: string) => {
    const typeMap = {
      economy: "Economy",
      comfort: "Comfort",
      premium: "Premium",
      van: "Van",
      luxury: "Luxury",
    };
    return typeMap[type as keyof typeof typeMap] || "Standard";
  };

  const availableTransfers = transfers.filter(t => t.status === "available");
  const activeTransfers = transfers.filter(t => t.status === "accepted" || t.status === "in_progress");
  const completedTransfers = transfers.filter(t => t.status === "completed");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Cargando panel de conductor...</p>
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="border-ocean text-ocean">
                🚗 Conductor
              </Badge>
              {user && (
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  {user.name}
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isOnline ? 'En Línea' : 'Desconectado'}
                </span>
              </div>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOutIcon className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Badge className={`${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1`}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy">
                Panel de Conductor
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus traslados y ganancias
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Badge className={`${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white w-fit`}>
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                {isOnline ? 'Disponible' : 'No Disponible'}
              </Badge>
              <Button
                onClick={() => setIsOnline(!isOnline)}
                variant={isOnline ? "destructive" : "default"}
                className={`w-full sm:w-auto ${isOnline ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {isOnline ? 'Desconectar' : 'Conectar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <StatsWidget
            title="Hoy"
            value="3"
            subtitle="Traslados"
            icon={CarIcon}
            trend={12}
            colorScheme="ocean"
          />
          <StatsWidget
            title="Ganancias"
            value="€165"
            subtitle="Hoy"
            icon={EuroIcon}
            trend={8}
            colorScheme="coral"
          />
          <StatsWidget
            title="Rating"
            value="4.9"
            subtitle="Promedio"
            icon={StarIcon}
            trend={2}
            colorScheme="success"
          />
          <StatsWidget
            title="Disponibles"
            value={availableTransfers.length.toString()}
            subtitle="Traslados"
            icon={NavigationIcon}
            colorScheme="navy"
          />
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available" className="relative">
              Disponibles
              {availableTransfers.length > 0 && (
                <Badge className="ml-2 bg-ocean text-white text-xs">
                  {availableTransfers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Activos
              {activeTransfers.length > 0 && (
                <Badge className="ml-2 bg-coral text-white text-xs">
                  {activeTransfers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
            <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          </TabsList>

          {/* Available Transfers */}
          <TabsContent value="available" className="space-y-4">
            <div className="space-y-4">
              {availableTransfers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No hay traslados disponibles
                    </h3>
                    <p className="text-gray-500">
                      Cuando haya nuevos traslados disponibles, aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                availableTransfers.map((transfer) => (
                  <Card key={transfer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge {...getStatusBadge(transfer.status)} />
                            <span className="text-sm text-gray-500">#{transfer.id}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {transfer.origin} → {transfer.destination}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {transfer.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {transfer.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <UsersIcon className="w-4 h-4" />
                              {transfer.passengers} + {transfer.children} niños
                            </div>
                            <div className="flex items-center gap-1">
                              <LuggageIcon className="w-4 h-4" />
                              {transfer.luggage} maletas
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-ocean mb-1">
                            €{transfer.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transfer.distance}km • {transfer.duration}min
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              Cliente
                            </h4>
                            <p className="font-medium">{transfer.clientName}</p>
                            <p className="text-sm text-gray-600">{transfer.clientPhone}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              Detalles
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getVehicleTypeName(transfer.vehicleType)}
                            </p>
                            {transfer.flightNumber && (
                              <p className="text-sm text-gray-600">
                                Vuelo: {transfer.flightNumber}
                              </p>
                            )}
                            {transfer.childSeats > 0 && (
                              <p className="text-sm text-gray-600">
                                <BabyIcon className="w-3 h-3 inline mr-1" />
                                {transfer.childSeats} sillas infantiles
                              </p>
                            )}
                          </div>
                        </div>
                        {transfer.specialRequests && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              Solicitudes Especiales
                            </h4>
                            <p className="text-sm text-gray-600">
                              {transfer.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTransfer(transfer)}
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Link to={`/chat?transfer=${transfer.id}`}>
                            <Button size="sm" variant="outline">
                              <MessageSquareIcon className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          </Link>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeclineTransfer(transfer.id)}
                          >
                            <XIcon className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptTransfer(transfer.id)}
                          >
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Aceptar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Active Transfers */}
          <TabsContent value="active" className="space-y-4">
            <div className="space-y-4">
              {activeTransfers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <NavigationIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No tienes traslados activos
                    </h3>
                    <p className="text-gray-500">
                      Los traslados aceptados aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                activeTransfers.map((transfer) => (
                  <Card key={transfer.id} className="border-ocean/20 bg-ocean-light/5">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-ocean text-white">
                              {getStatusBadge(transfer.status).label}
                            </Badge>
                            <span className="text-sm text-gray-500">#{transfer.id}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {transfer.origin} → {transfer.destination}
                          </h3>
                          <p className="text-lg font-bold text-ocean">
                            {transfer.date} a las {transfer.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-ocean mb-1">
                            €{transfer.price}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Información del Cliente
                            </h4>
                            <p className="font-medium">{transfer.clientName}</p>
                            <p className="text-sm text-gray-600 mb-2">{transfer.clientPhone}</p>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <PhoneIcon className="w-4 h-4 mr-2" />
                                Llamar
                              </Button>
                              <Link to={`/chat?transfer=${transfer.id}`}>
                                <Button size="sm" variant="outline">
                                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                                  Chat
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Navegación
                            </h4>
                            <Button size="sm" className="bg-ocean hover:bg-ocean/90 mb-2 w-full">
                              <NavigationIcon className="w-4 h-4 mr-2" />
                              Abrir en Maps
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 w-full"
                              onClick={() => handleCompleteTransfer(transfer.id)}
                            >
                              <CheckIcon className="w-4 h-4 mr-2" />
                              Marcar Completado
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Completed Transfers */}
          <TabsContent value="completed" className="space-y-4">
            <div className="space-y-4">
              {completedTransfers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No hay traslados completados
                    </h3>
                    <p className="text-gray-500">
                      Tus traslados completados aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                completedTransfers.map((transfer) => (
                  <Card key={transfer.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant="secondary">Completado</Badge>
                          <h3 className="text-lg font-semibold mt-2">
                            {transfer.origin} → {transfer.destination}
                          </h3>
                          <p className="text-gray-600">
                            {transfer.date} • {transfer.clientName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-success">
                            €{transfer.price}
                          </div>
                          <div className="flex items-center mt-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm">5.0</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Earnings */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsWidget
                title="Hoy"
                value="€165"
                subtitle="3 traslados"
                icon={EuroIcon}
                trend={12}
                colorScheme="ocean"
              />
              <StatsWidget
                title="Esta Semana"
                value="€890"
                subtitle="15 traslados"
                icon={TrendingUpIcon}
                trend={8}
                colorScheme="coral"
              />
              <StatsWidget
                title="Este Mes"
                value="€3,240"
                subtitle="67 traslados"
                icon={CalendarIcon}
                trend={15}
                colorScheme="success"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Ganancias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span>Ganancias Brutas</span>
                    <span className="font-semibold">€3,240</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Comisión Plataforma (15%)</span>
                    <span className="text-red-600">-€486</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Combustible Estimado</span>
                    <span className="text-red-600">-€324</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Ganancias Netas</span>
                    <span className="text-green-600">€2,430</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transfer Details Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Detalles del Traslado #{selectedTransfer.id}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransfer(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Información del Viaje</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Origen:</span>
                      <p className="font-medium">{selectedTransfer.origin}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Destino:</span>
                      <p className="font-medium">{selectedTransfer.destination}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha y Hora:</span>
                      <p className="font-medium">{selectedTransfer.date} a las {selectedTransfer.time}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Distancia:</span>
                      <p className="font-medium">{selectedTransfer.distance}km • {selectedTransfer.duration} minutos</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <p className="font-medium">{selectedTransfer.clientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <p className="font-medium">{selectedTransfer.clientPhone}</p>
                    </div>
                    {selectedTransfer.flightNumber && (
                      <div>
                        <span className="text-gray-600">Vuelo:</span>
                        <p className="font-medium">{selectedTransfer.flightNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Detalles del Servicio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <UsersIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{selectedTransfer.passengers}</div>
                    <div className="text-xs text-gray-600">Adultos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BabyIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{selectedTransfer.children}</div>
                    <div className="text-xs text-gray-600">Niños</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <LuggageIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{selectedTransfer.luggage}</div>
                    <div className="text-xs text-gray-600">Maletas</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CarIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium">{getVehicleTypeName(selectedTransfer.vehicleType)}</div>
                    <div className="text-xs text-gray-600">Vehículo</div>
                  </div>
                </div>
              </div>

              {selectedTransfer.specialRequests && (
                <div>
                  <h3 className="font-semibold mb-3">Solicitudes Especiales</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm">{selectedTransfer.specialRequests}</p>
                  </div>
                </div>
              )}

              <div className="bg-ocean-light/10 border border-ocean/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total del Traslado</span>
                  <span className="text-2xl font-bold text-ocean">€{selectedTransfer.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Método de pago: {selectedTransfer.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}
                </p>
              </div>

              {selectedTransfer.status === 'available' && (
                <div className="flex space-x-4">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleDeclineTransfer(selectedTransfer.id);
                      setSelectedTransfer(null);
                    }}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Rechazar Traslado
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleAcceptTransfer(selectedTransfer.id);
                      setSelectedTransfer(null);
                    }}
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Aceptar Traslado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
