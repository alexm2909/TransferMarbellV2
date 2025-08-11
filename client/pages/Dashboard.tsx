import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import NotificationCenter from "@/components/NotificationCenter";
import UserMenu from "@/components/UserMenu";
import AvailableTransfersCard from "@/components/AvailableTransfersCard";
import { useBookings, useNotifications, useSystemStats } from "@/hooks/useDatabase";
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
  const { bookings } = useBookings(user?.id);
  const { notifications, unreadCount } = useNotifications(user?.id || '');
  const { stats } = useSystemStats();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Early return for unauthenticated users
  if (!isLoading && !isAuthenticated) {
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
      admin: "Administrador",
    };
    return roleMap[role as keyof typeof roleMap] || "Dashboard";
  };

  const getRoleIcon = (role: string) => {
    const iconMap = {
      client: "👤",
      driver: "🚗",
      admin: "⚙️",
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
                {/* Driver Application Status */}
                {user?.driverStatus && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CarIcon className="w-5 h-5 text-purple" />
                        Estado de Solicitud de Conductor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-ocean-light/20 to-coral-light/20 rounded-lg border border-ocean/30">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.driverStatus === "pending" && "Solicitud Pendiente de Aprobación"}
                            {user.driverStatus === "approved" && "¡Solicitud Aprobada!"}
                            {user.driverStatus === "rejected" && "Solicitud Rechazada"}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {user.driverStatus === "pending" && "Tu solicitud está siendo revisada por nuestro equipo."}
                            {user.driverStatus === "approved" && "Ya puedes comenzar a recibir solicitudes de viaje."}
                            {user.driverStatus === "rejected" && "Contacta con soporte para más información."}
                          </p>
                        </div>
                        <Badge
                          className={
                            user.driverStatus === "pending" ? "bg-amber-100 text-amber-800" :
                            user.driverStatus === "approved" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {user.driverStatus === "pending" && "Pendiente"}
                          {user.driverStatus === "approved" && "Aprobado"}
                          {user.driverStatus === "rejected" && "Rechazado"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Become a Driver CTA */}
                {!user?.driverStatus && (
                  <Card className="mb-6 bg-gradient-to-r from-purple/10 to-ocean/10 border-purple/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple mb-2">
                            ¿Quieres ser conductor?
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Únete a nuestro equipo de conductores profesionales y empieza a ganar dinero con tu vehículo.
                          </p>
                        </div>
                        <Link to="/driver-registration">
                          <Button className="bg-purple hover:bg-purple/90 text-white">
                            Aplicar
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-ocean" />
                      Mis Reservas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings && bookings.length > 0 ? (
                        bookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4 bg-ocean-light/10">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">
                                  {booking.tripDetails.origin.address} → {booking.tripDetails.destination.address}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(booking.tripDetails.date).toLocaleDateString('es-ES')} - {booking.tripDetails.time}
                                </p>
                              </div>
                              <Badge className={
                                booking.status === 'completed' ? 'bg-green-500 text-white' :
                                booking.status === 'confirmed' || booking.status === 'assigned' ? 'bg-blue-500 text-white' :
                                booking.status === 'in_progress' ? 'bg-yellow-500 text-white' :
                                'bg-gray-500 text-white'
                              }>
                                {booking.status === 'pending' ? 'Pendiente' :
                                 booking.status === 'assigned' ? 'Asignado' :
                                 booking.status === 'confirmed' ? 'Confirmado' :
                                 booking.status === 'in_progress' ? 'En Curso' :
                                 booking.status === 'completed' ? 'Completado' :
                                 booking.status === 'cancelled' ? 'Cancelado' : booking.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {booking.tripDetails.passengers} pasajero{booking.tripDetails.passengers > 1 ? 's' : ''}, {booking.tripDetails.luggage.small + booking.tripDetails.luggage.medium + booking.tripDetails.luggage.large} maleta{(booking.tripDetails.luggage.small + booking.tripDetails.luggage.medium + booking.tripDetails.luggage.large) > 1 ? 's' : ''}
                              </span>
                              <span className="font-bold text-ocean">€{booking.pricing.totalPrice}</span>
                            </div>
                            {booking.isEmergency && (
                              <div className="mt-2">
                                <Badge className="bg-red-100 text-red-700 text-xs">
                                  🚨 Emergencia (+€{booking.emergencyDetails?.emergencyBonus})
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No tienes reservas aún</p>
                        </div>
                      )}
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
                <AvailableTransfersCard />

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

                {/* Driver Approval Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CarIcon className="w-5 h-5 text-purple" />
                      Solicitudes de Conductor Pendientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock driver applications - replace with real data */}
                      {(() => {
                        const applications = [
                          {
                            id: "1",
                            name: "Miguel Torres",
                            email: "miguel@example.com",
                            vehicle: "Mercedes Clase E 2020",
                            submittedAt: "Hace 2 días",
                            documents: ["VTC", "Seguro", "Permiso", "ITV", "Antecedentes"]
                          },
                          {
                            id: "2",
                            name: "Ana García",
                            email: "ana@example.com",
                            vehicle: "BMW Serie 5 2019",
                            submittedAt: "Hace 1 día",
                            documents: ["VTC", "Seguro", "Permiso", "ITV"]
                          }
                        ];

                        return applications.length > 0 ? (
                          applications.map((application) => (
                            <div key={application.id} className="border rounded-lg p-4 bg-purple/5">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{application.name}</h4>
                                  <p className="text-sm text-gray-600">{application.email}</p>
                                  <p className="text-sm text-gray-600">{application.vehicle}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary" className="mb-2">
                                    {application.submittedAt}
                                  </Badge>
                                  <div className="text-xs text-gray-500">
                                    {application.documents.length} documentos
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {application.documents.map((doc) => (
                                  <Badge key={doc} variant="outline" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                  onClick={() => {
                                    // Mock approval
                                    alert(`Conductor ${application.name} aprobado exitosamente`);
                                  }}
                                >
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                                  onClick={() => {
                                    // Mock rejection
                                    const reason = prompt("Razón del rechazo:");
                                    if (reason) {
                                      alert(`Conductor ${application.name} rechazado: ${reason}`);
                                    }
                                  }}
                                >
                                  Rechazar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    alert(`Ver detalles completos de ${application.name}`);
                                  }}
                                >
                                  Ver Detalles
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <CarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No hay solicitudes pendientes</p>
                          </div>
                        );
                      })()}
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
                {user?.role === "driver" && (
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
                  {user?.role === "admin" && (
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
