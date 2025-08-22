import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import UserMenu from "@/components/UserMenu";
import EmailBilling from "@/components/EmailBilling";
import { useAvailableBookings, useEmergencyBookings, useBookings } from "@/hooks/useDatabase";
import {
  CarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  PhoneIcon,
  EuroIcon,
  CheckIcon,
  XIcon,
  NavigationIcon,
  CalendarIcon,
  LuggageIcon,
  StarIcon,
  TrendingUpIcon,
  QrCodeIcon,
  TicketIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CameraIcon,
  MessageSquareIcon,
  SettingsIcon,
} from "lucide-react";

interface Trip {
  id: string;
  status: "available" | "accepted" | "in_progress" | "completed" | "cancelled";
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  children: number;
  luggage: number;
  price: number;
  distance: number;
  duration: number;
  clientName: string;
  clientPhone: string;
  voucherCode: string;
  voucherValidated: boolean;
}

interface EmergencyTrip extends Trip {
  isEmergency: true;
  originalPrice: number;
  emergencyBonus: number;
  reason: string;
  createdBy: string;
  urgencyLevel: "medium" | "high" | "critical";
  flightNumber?: string;
  specialRequests?: string;
  vehicleType: string;
}

export default function OptimizedDriverPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const { availableBookings } = useAvailableBookings();
  const { emergencyBookings } = useEmergencyBookings();
  const { bookings: driverBookings, assignToDriver, updateBooking } = useBookings(user?.id);

  const [emergencyTrips, setEmergencyTrips] = useState<EmergencyTrip[]>([
    {
      id: "EM001",
      status: "available",
      origin: "Hospital Costa del Sol",
      destination: "Aeropuerto de Málaga (AGP)",
      date: "2024-03-15",
      time: "18:00",
      passengers: 1,
      children: 0,
      luggage: 1,
      price: 75,
      originalPrice: 50,
      emergencyBonus: 25,
      distance: 45,
      duration: 55,
      clientName: "Emergency Transfer",
      clientPhone: "+34 900 123 456",
      voucherCode: "EM-001234",
      voucherValidated: false,
      isEmergency: true,
      reason: "Conductor anterior no se presentó",
      createdBy: "Admin - Juan López",
      urgencyLevel: "high"
    },
    {
      id: "EM002",
      status: "available",
      origin: "Puerto Banús",
      destination: "Estación AVE María Zambrano",
      date: "2024-03-15",
      time: "19:30",
      passengers: 2,
      children: 0,
      luggage: 3,
      price: 65,
      originalPrice: 40,
      emergencyBonus: 25,
      distance: 35,
      duration: 45,
      clientName: "Emergency Transfer",
      clientPhone: "+34 900 987 654",
      voucherCode: "EM-005678",
      voucherValidated: false,
      isEmergency: true,
      reason: "Cliente perdió el vuelo, necesita traslado urgente",
      createdBy: "Admin - Mar��a Ruiz",
      urgencyLevel: "critical"
    }
  ]);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showVoucherScanner, setShowVoucherScanner] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [showBilling, setShowBilling] = useState(false);

  // Redirect if not authenticated or not a driver
  if (!isAuthenticated || user?.role !== "driver") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-4">
              Esta área es solo para conductores autorizados
            </p>
            <Link to="/signin">
              <Button className="bg-gradient-to-r from-ocean to-coral text-white">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acceptTrip = (tripId: string) => {
    if (user?.id) {
      assignToDriver(tripId, user.id);
      updateBooking(tripId, {
        status: "assigned",
        driverId: user.id,
        timeline: {
          assignedAt: new Date().toISOString()
        }
      });
    }
  };

  const startTrip = (tripId: string) => {
    // Find booking in available or assigned bookings
    const allBookings = [...availableBookings, ...driverBookings];
    const booking = allBookings.find(b => b.id === tripId);

    // For now, skip voucher validation check since the database structure is different
    // TODO: Implement voucher validation in database structure

    updateBooking(tripId, {
      status: "in_progress",
      timeline: {
        startedAt: new Date().toISOString()
      }
    });
  };

  const completeTrip = (tripId: string) => {
    updateBooking(tripId, {
      status: "completed",
      timeline: {
        completedAt: new Date().toISOString()
      }
    });
    toast({
      title: "✅ Viaje Completado",
      description: "El viaje ha sido marcado como completado exitosamente.",
      duration: 3000,
    });
  };

  const reportEmergency = () => {
    if (!selectedTrip || !emergencyReason.trim()) return;

    // Here you would normally call an API to report the emergency
    // For now, we'll just show a confirmation
    toast({
      title: "🚨 Emergencia Reportada",
      description: `Se ha reportado una emergencia durante el viaje. Motivo: ${emergencyReason}`,
      variant: "destructive",
      duration: 5000,
    });

    setShowEmergencyDialog(false);
    setEmergencyReason("");
    setSelectedTrip(null);
  };

  const openChat = (booking: any) => {
    // Navigate to chat page with the booking ID or client info
    navigate(`/chat?booking=${booking.id}&client=${booking.clientData?.name || 'Cliente'}`);
  };

  const validateVoucher = (tripId: string, voucherCode: string) => {
    // For now, simplified voucher validation - in full implementation,
    // this would check against stored voucher code in booking
    const allBookings = [...availableBookings, ...driverBookings, ...emergencyBookings];
    const booking = allBookings.find(b => b.id === tripId);

    if (booking) {
      // Update booking to mark voucher as validated
      updateBooking(tripId, {
        status: "confirmed",
        timeline: {
          confirmedAt: new Date().toISOString()
        }
      });
      toast({
        title: "✅ Voucher Validado",
        description: "El voucher ha sido validado correctamente. Ahora puedes iniciar el viaje.",
        duration: 3000,
      });
      setShowVoucherScanner(false);
      setVoucherInput("");
      setSelectedTrip(null);
    } else {
      toast({
        title: "❌ Código Incorrecto",
        description: "El código del voucher no coincide. Por favor verifica e inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Asignado</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">En Curso</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  // Use database data instead of mock data
  const availableTrips = availableBookings;
  const activeTrips = driverBookings.filter(booking =>
    ["assigned", "confirmed", "in_progress"].includes(booking.status)
  );
  const completedTrips = driverBookings.filter(booking =>
    booking.status === "completed"
  );

  const todayEarnings = completedTrips.reduce((sum, booking) => sum + booking.pricing.totalPrice, 0);
  const todayTrips = completedTrips.length;

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
              <span className="text-xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Panel de Conductor
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <EuroIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ganancias Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">€{todayEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Viajes Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTrips.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="available">
              Disponibles ({availableTrips.length})
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-red-600 font-semibold">
              🚨 Emergencias ({emergencyTrips.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activos ({activeTrips.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedTrips.length})
            </TabsTrigger>
            <TabsTrigger value="billing">
              Facturación
            </TabsTrigger>
          </TabsList>

          {/* Available Trips */}
          <TabsContent value="available">
            <div className="grid gap-6">
              {availableTrips.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{booking.clientData?.name || 'Cliente'}</h3>
                          <Badge className="bg-blue-100 text-blue-700">Disponible</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium">Origen:</span>
                            <span className="ml-2">{booking.tripDetails.origin.address}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-red-500 mr-2" />
                            <span className="font-medium">Destino:</span>
                            <span className="ml-2">{booking.tripDetails.destination.address}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="font-medium">{booking.tripDetails.date} a las {booking.tripDetails.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">€{booking.pricing.totalPrice}</div>
                        <div className="text-sm text-gray-500">Precio estimado</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 text-blue-500 mr-2" />
                        <span>{booking.tripDetails.passengers + (booking.tripDetails.children?.count || 0)} pasajeros</span>
                      </div>
                      <div className="flex items-center">
                        <LuggageIcon className="w-4 h-4 text-purple-500 mr-2" />
                        <span>{(booking.tripDetails.luggage.small || 0) + (booking.tripDetails.luggage.medium || 0) + (booking.tripDetails.luggage.large || 0)} maletas</span>
                      </div>
                      <div className="flex items-center">
                        <CarIcon className="w-4 h-4 text-orange-500 mr-2" />
                        <span>{booking.vehicleType}</span>
                      </div>
                    </div>

                    {booking.tripDetails.specialRequests && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-1">Solicitudes Especiales:</h4>
                        <p className="text-sm text-yellow-700">{booking.tripDetails.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => acceptTrip(booking.id)}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Aceptar Viaje
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <NavigationIcon className="w-4 h-4 mr-2" />
                        Ver Ruta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {availableTrips.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay viajes disponibles
                    </h3>
                    <p className="text-gray-600">
                      Los nuevos viajes aparecerán aquí cuando estén disponibles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Emergency Trips */}
          <TabsContent value="emergency">
            <div className="grid gap-6">
              {emergencyBookings.map((booking) => (
                <Card key={booking.id} className="border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangleIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">EMERGENCIA</h3>
                            <Badge className={`${
                              booking.emergencyDetails?.urgencyLevel === "critical" ? "bg-red-600" :
                              booking.emergencyDetails?.urgencyLevel === "high" ? "bg-orange-600" :
                              "bg-yellow-600"
                            } text-white`}>
                              {booking.emergencyDetails?.urgencyLevel === "critical" ? "CRÍTICO" :
                               booking.emergencyDetails?.urgencyLevel === "high" ? "ALTO" : "MEDIO"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">#{booking.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">€{booking.pricing.totalPrice}</div>
                        {booking.emergencyDetails && (
                          <>
                            <div className="text-sm text-gray-500 line-through">€{booking.emergencyDetails.originalPrice}</div>
                            <div className="text-sm font-medium text-green-600">+€{booking.emergencyDetails.emergencyBonus} bonus</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPinIcon className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Origen:</span>
                        </div>
                        <p className="text-gray-700 ml-6">{booking.tripDetails.origin.address}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPinIcon className="w-4 h-4 text-red-500" />
                          <span className="font-medium">Destino:</span>
                        </div>
                        <p className="text-gray-700 ml-6">{booking.tripDetails.destination.address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span>{booking.tripDetails.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span>{booking.tripDetails.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-gray-500" />
                        <span>{booking.tripDetails.passengers} pax</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LuggageIcon className="w-4 h-4 text-gray-500" />
                        <span>{(booking.tripDetails.luggage.small || 0) + (booking.tripDetails.luggage.medium || 0) + (booking.tripDetails.luggage.large || 0)} maletas</span>
                      </div>
                    </div>

                    {booking.emergencyDetails && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangleIcon className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Motivo de emergencia:</span>
                        </div>
                        <p className="text-yellow-700 text-sm">{booking.emergencyDetails.reason}</p>
                        <p className="text-yellow-600 text-xs mt-1">Creado por: {booking.emergencyDetails.createdBy}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => acceptTrip(booking.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Aceptar Emergencia
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTrip(booking)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {emergencyTrips.length === 0 && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="text-center py-12">
                    <CheckIcon className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay emergencias activas
                    </h3>
                    <p className="text-gray-600">
                      ¡Excelente! No hay viajes de emergencia en este momento
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Active Trips */}
          <TabsContent value="active">
            <div className="grid gap-6">
              {activeTrips.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{booking.clientData?.name || 'Cliente'}</h3>
                          {getStatusBadge(booking.status)}
                          {booking.status === "confirmed" ? (
                            <Badge className="bg-green-100 text-green-800">
                              <TicketIcon className="w-3 h-3 mr-1" />
                              Voucher OK
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangleIcon className="w-3 h-3 mr-1" />
                              Sin Voucher
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-green-500 mr-2" />
                            <span>{booking.tripDetails.origin.address}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-red-500 mr-2" />
                            <span>{booking.tripDetails.destination.address}</span>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 text-blue-500 mr-2" />
                            <a href={`tel:${booking.clientData?.phone}`} className="text-blue-600 hover:underline">
                              {booking.clientData?.phone || 'Teléfono no disponible'}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">€{booking.pricing.totalPrice}</div>
                        <div className="text-sm text-gray-500">{booking.tripDetails.date} • {booking.tripDetails.time}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {booking.status === "assigned" && (
                        <Button
                          onClick={() => {
                            setSelectedTrip(booking);
                            setShowVoucherScanner(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          <QrCodeIcon className="w-4 h-4 mr-2" />
                          Validar Voucher
                        </Button>
                      )}

                      {booking.status === "confirmed" && (
                        <Button
                          onClick={() => startTrip(booking.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <NavigationIcon className="w-4 h-4 mr-2" />
                          Iniciar Viaje
                        </Button>
                      )}
                      
                      {booking.status === "in_progress" && (
                        <>
                          <Button
                            onClick={() => completeTrip(booking.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Completar Viaje
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedTrip(booking);
                              setShowEmergencyDialog(true);
                            }}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <AlertTriangleIcon className="w-4 h-4 mr-2" />
                            Emergencia
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => openChat(booking)}
                      >
                        <MessageSquareIcon className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeTrips.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay viajes activos
                    </h3>
                    <p className="text-gray-600">
                      Los viajes aceptados aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Completed Trips */}
          <TabsContent value="completed">
            <div className="grid gap-4">
              {completedTrips.map((trip) => (
                <Card key={trip.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{trip.clientName}</h3>
                        <p className="text-sm text-gray-600">
                          {trip.origin} → {trip.destination}
                        </p>
                        <p className="text-xs text-gray-500">{trip.date} • {trip.time}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">€{trip.price}</div>
                        {getStatusBadge(trip.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {completedTrips.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay viajes completados
                    </h3>
                    <p className="text-gray-600">
                      Los viajes completados aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <EmailBilling
              bookings={completedTrips}
              clientData={{ name: "Cliente Demo", email: "cliente@ejemplo.com" }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Voucher Scanner Modal */}
      <Dialog open={showVoucherScanner} onOpenChange={setShowVoucherScanner}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5 text-ocean" />
              Validar Voucher del Cliente
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <CameraIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Escanea el código QR del voucher del cliente o introduce el código manualmente
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Código del Voucher
              </label>
              <Input
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="Ej: TM-123456"
                className="text-center text-lg font-mono"
              />
            </div>

            {selectedTrip && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Código esperado:</span> {selectedTrip.voucherCode}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Cliente: {selectedTrip.clientName}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowVoucherScanner(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => selectedTrip && validateVoucher(selectedTrip.id, voucherInput)}
                disabled={!voucherInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                Validar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Report Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
              Reportar Emergencia Durante Viaje
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <span className="font-medium">⚠️ Importante:</span> Utiliza esta función solo en caso de emergencias reales durante el viaje (accidente, problema médico, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Describe la emergencia *
              </label>
              <textarea
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                placeholder="Describe brevemente la situación de emergencia..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 focus:border-red-400 focus:ring-red-400"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                {emergencyReason.length}/200 caracteres
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowEmergencyDialog(false);
                  setEmergencyReason("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={reportEmergency}
                disabled={!emergencyReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                Reportar Emergencia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
