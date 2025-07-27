import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import NotificationCenter from "@/components/NotificationCenter";
import UserMenu from "@/components/UserMenu";
import AvailableTransfersCard from "@/components/AvailableTransfersCard";
import {
  CarIcon,
  UsersIcon,
  CalendarIcon,
  SettingsIcon,
  LogOutIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  EuroIcon,
  BuildingIcon,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  // Redirect to signin if not authenticated
  if (!isLoading && !isAuthenticated) {
    navigate("/signin");
    return null;
  }

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      client: "Cliente",
      driver: "Conductor",
      "fleet-manager": "Jefe de Flota",
      admin: "Administrador",
      business: "Empresa",
    };
    return roleMap[role as keyof typeof roleMap] || "Dashboard";
  };

  const getRoleIcon = (role: string) => {
    const iconMap = {
      client: "👤",
      driver: "🚗",
      "fleet-manager": "👥",
      admin: "⚙️",
      business: "🏢",
    };
    return iconMap[role as keyof typeof iconMap] || "👤";
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
              <NotificationCenter userRole={user?.role || "client"} />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">
            Bienvenido, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de control para {getRoleBadge(user?.role || "")}
          </p>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* CLIENT DASHBOARD */}
            {user?.role === "client" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-ocean" />
                      Mis Reservas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-ocean-light/10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              Málaga Airport → Hotel Majestic
                            </h3>
                            <p className="text-sm text-gray-600">
                              Mañana, 14:30
                            </p>
                          </div>
                          <Badge className="bg-success text-white">
                            Confirmado
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            2 pasajeros, 1 maleta
                          </span>
                          <span className="font-bold text-ocean">€35</span>
                        </div>
                      </div>
                      <div className="text-center py-6">
                        <Link to="/book">
                          <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                            Nueva Reserva
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* DRIVER DASHBOARD */}
            {user?.role === "driver" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CarIcon className="w-5 h-5 text-ocean" />
                      Traslados Disponibles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              Aeropuerto → Hotel Majestic
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              Mañana 14:30
                            </p>
                          </div>
                          <span className="text-lg font-bold text-ocean">
                            €35
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          2 pasajeros, 1 maleta • Distancia: 25km
                        </p>
                        <Button
                          size="sm"
                          className="bg-ocean hover:bg-ocean/90"
                        >
                          Aceptar Traslado
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              Marbella → Aeropuerto Gibraltar
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              28 Dic, 09:00
                            </p>
                          </div>
                          <span className="text-lg font-bold text-ocean">
                            €80
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          4 pasajeros, 3 maletas • Distancia: 45km
                        </p>
                        <Button
                          size="sm"
                          className="bg-ocean hover:bg-ocean/90"
                        >
                          Aceptar Traslado
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-ocean" />
                      Estadísticas de Hoy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-ocean-light/20 rounded-lg">
                        <div className="text-xl font-bold text-ocean">3</div>
                        <div className="text-xs text-gray-600">Viajes</div>
                      </div>
                      <div className="text-center p-3 bg-coral-light/20 rounded-lg">
                        <div className="text-xl font-bold text-coral">€105</div>
                        <div className="text-xs text-gray-600">Ganado</div>
                      </div>
                      <div className="text-center p-3 bg-success/20 rounded-lg">
                        <div className="text-xl font-bold text-success">
                          4.9
                        </div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* FLEET MANAGER DASHBOARD */}
            {user?.role === "fleet-manager" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-ocean" />
                      Resumen de Flota
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-ocean-light/20 rounded-lg">
                        <div className="text-2xl font-bold text-ocean">8</div>
                        <div className="text-sm text-gray-600">
                          Conductores Activos
                        </div>
                      </div>
                      <div className="text-center p-4 bg-coral-light/20 rounded-lg">
                        <div className="text-2xl font-bold text-coral">12</div>
                        <div className="text-sm text-gray-600">
                          Traslados Hoy
                        </div>
                      </div>
                      <div className="text-center p-4 bg-success/20 rounded-lg">
                        <div className="text-2xl font-bold text-success">
                          €420
                        </div>
                        <div className="text-sm text-gray-600">
                          Ingresos Hoy
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Carlos Rodríguez</span>
                          <span className="text-sm text-gray-500 ml-2">
                            BMW Serie 5
                          </span>
                        </div>
                        <Badge className="bg-success text-white">Activo</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Ana Fernández</span>
                          <span className="text-sm text-gray-500 ml-2">
                            Mercedes E-Class
                          </span>
                        </div>
                        <Badge className="bg-warning text-white">
                          En Servicio
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Miguel Torres</span>
                          <span className="text-sm text-gray-500 ml-2">
                            Audi A6
                          </span>
                        </div>
                        <Badge variant="secondary">Descanso</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ADMIN DASHBOARD */}
            {user?.role === "admin" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-ocean" />
                      Resumen del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-ocean-light/20 rounded-lg">
                        <div className="text-xl font-bold text-ocean">156</div>
                        <div className="text-xs text-gray-600">
                          Usuarios Total
                        </div>
                      </div>
                      <div className="text-center p-3 bg-coral-light/20 rounded-lg">
                        <div className="text-xl font-bold text-coral">24</div>
                        <div className="text-xs text-gray-600">
                          Conductores Activos
                        </div>
                      </div>
                      <div className="text-center p-3 bg-success/20 rounded-lg">
                        <div className="text-xl font-bold text-success">89</div>
                        <div className="text-xs text-gray-600">
                          Reservas Hoy
                        </div>
                      </div>
                      <div className="text-center p-3 bg-warning/20 rounded-lg">
                        <div className="text-xl font-bold text-warning">3</div>
                        <div className="text-xs text-gray-600">Pendientes</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-yellow-50">
                        <div>
                          <span className="font-medium">
                            Solicitud Conductor
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Miguel Torres
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          Revisar
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-yellow-50">
                        <div>
                          <span className="font-medium">Subida de Precio</span>
                          <span className="text-sm text-gray-500 ml-2">
                            +€5 Ruta Aeropuerto
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          Revisar
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                        <div>
                          <span className="font-medium">Disputa de Pago</span>
                          <span className="text-sm text-gray-500 ml-2">
                            Reserva #TM001234
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          Resolver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* BUSINESS DASHBOARD */}
            {user?.role === "business" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-ocean" />
                      Reservas Corporativas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-ocean-light/20 rounded-lg">
                        <div className="text-2xl font-bold text-ocean">45</div>
                        <div className="text-sm text-gray-600">Este Mes</div>
                      </div>
                      <div className="text-center p-4 bg-coral-light/20 rounded-lg">
                        <div className="text-2xl font-bold text-coral">8</div>
                        <div className="text-sm text-gray-600">Esta Semana</div>
                      </div>
                      <div className="text-center p-4 bg-success/20 rounded-lg">
                        <div className="text-2xl font-bold text-success">
                          €1,240
                        </div>
                        <div className="text-sm text-gray-600">
                          Gasto Mensual
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">
                            Recogida Aeropuerto
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Huésped: Sr. Johnson
                          </span>
                        </div>
                        <Badge className="bg-success text-white">
                          Confirmado
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Tour Ejecutivo</span>
                          <span className="text-sm text-gray-500 ml-2">
                            Grupo VIP
                          </span>
                        </div>
                        <Badge className="bg-warning text-white">
                          En Curso
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">
                            Transfer Conferencia
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Mañana 09:00
                          </span>
                        </div>
                        <Badge variant="secondary">Programado</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Messages Card for all users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="w-5 h-5 text-ocean" />
                  Mensajes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.role === "client" && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          Carlos (Conductor)
                        </span>
                        <span className="text-xs text-gray-500">
                          Hace 5 min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Ya estoy llegando al aeropuerto. Estaré en la zona de
                        llegadas.
                      </p>
                    </div>
                  </div>
                )}
                {(user?.role === "driver" ||
                  user?.role === "fleet-manager") && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          Ana García (Cliente)
                        </span>
                        <span className="text-xs text-gray-500">
                          Hace 2 min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        ¿Cuánto tiempo falta para llegar? Muchas gracias.
                      </p>
                    </div>
                  </div>
                )}
                {user?.role === "admin" && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">Sistema</span>
                        <span className="text-xs text-gray-500">
                          Hace 10 min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nueva solicitud de conductor requiere aprobación.
                      </p>
                    </div>
                  </div>
                )}
                {user?.role === "business" && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          Transfermarbell
                        </span>
                        <span className="text-xs text-gray-500">
                          Hace 1 hora
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Resumen mensual de servicios disponible para descarga.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.role === "client" && (
                  <>
                    <Link to="/book">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                      >
                        <CarIcon className="w-4 h-4 mr-2" />
                        Reservar Traslado
                      </Button>
                    </Link>
                    <Link to="/chat">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquareIcon className="w-4 h-4 mr-2" />
                        Chat con Conductor
                      </Button>
                    </Link>
                    <Link to="/my-bookings">
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Ver Reservas
                      </Button>
                    </Link>
                    <Link to="/refer-friends">
                      <Button variant="outline" className="w-full justify-start">
                        <UsersIcon className="w-4 h-4 mr-2" />
                        Referir Amigos
                      </Button>
                    </Link>
                  </>
                )}
                {user?.role === "driver" && (
                  <>
                    <Link to="/driver-panel">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                      >
                        <CarIcon className="w-4 h-4 mr-2" />
                        Panel de Conductor
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      Ver Mapa
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Horarios
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <EuroIcon className="w-4 h-4 mr-2" />
                      Ganancias
                    </Button>
                  </>
                )}
                {user?.role === "fleet-manager" && (
                  <>
                    <Link to="/fleet-panel">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                      >
                        <UsersIcon className="w-4 h-4 mr-2" />
                        Panel de Flota
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUpIcon className="w-4 h-4 mr-2" />
                      Estadísticas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Configuración
                    </Button>
                  </>
                )}
                {user?.role === "admin" && (
                  <>
                    <Link to="/admin-panel">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                      >
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Panel Admin
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Usuarios
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUpIcon className="w-4 h-4 mr-2" />
                      Reportes
                    </Button>
                  </>
                )}
                {user?.role === "business" && (
                  <>
                    <Link to="/business-panel">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                      >
                        <BuildingIcon className="w-4 h-4 mr-2" />
                        Panel Empresarial
                      </Button>
                    </Link>
                    <Link to="/book">
                      <Button variant="outline" className="w-full justify-start">
                        <CarIcon className="w-4 h-4 mr-2" />
                        Nueva Reserva
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <EuroIcon className="w-4 h-4 mr-2" />
                      Facturación
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Miembro desde</span>
                    <span className="font-medium">Ene 2024</span>
                  </div>
                  {user?.role === "client" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total viajes</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ahorrado</span>
                        <span className="font-medium text-success">€45</span>
                      </div>
                    </>
                  )}
                  {user?.role === "driver" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Viajes realizados</span>
                        <span className="font-medium">234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating promedio</span>
                        <span className="font-medium text-success">4.8/5</span>
                      </div>
                    </>
                  )}
                  {(user?.role === "fleet-manager" ||
                    user?.role === "admin" ||
                    user?.role === "business") && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Servicios gestionados
                        </span>
                        <span className="font-medium">1,567</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Eficiencia</span>
                        <span className="font-medium text-success">98.5%</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estado</span>
                    <Badge className="bg-success text-white text-xs">
                      Activo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
