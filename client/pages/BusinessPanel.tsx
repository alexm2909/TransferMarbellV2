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
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  EuroIcon,
  DownloadIcon,
  PlusIcon,
  EditIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  TrendingUpIcon,
  CreditCardIcon,
  SettingsIcon,
} from "lucide-react";

export default function BusinessPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const upcomingBookings = [
    {
      id: "BK001",
      guestName: "Mr. Johnson",
      guestPhone: "+1 555 123 4567",
      guestEmail: "johnson@email.com",
      pickupDate: "2024-12-23",
      pickupTime: "14:30",
      route: "Málaga Airport → Hotel Majestic",
      flightNumber: "BA456",
      vehicleType: "Premium",
      passengers: 2,
      luggage: 2,
      specialRequests: "Needs child seat for 3-year-old",
      status: "confirmed",
      driver: "Carlos Rodríguez",
      cost: "€45",
    },
    {
      id: "BK002",
      guestName: "Ms. Smith",
      guestPhone: "+1 555 987 6543",
      guestEmail: "smith@email.com",
      pickupDate: "2024-12-24",
      pickupTime: "09:15",
      route: "Hotel Majestic → Gibraltar Airport",
      flightNumber: "EZY789",
      vehicleType: "Comfort",
      passengers: 1,
      luggage: 1,
      specialRequests: "",
      status: "pending",
      driver: "TBA",
      cost: "€80",
    },
    {
      id: "BK003",
      guestName: "Mr. & Mrs. Brown",
      guestPhone: "+1 555 456 7890",
      guestEmail: "browns@email.com",
      pickupDate: "2024-12-25",
      pickupTime: "16:00",
      route: "Hotel Majestic → Marbella Centro",
      flightNumber: "",
      vehicleType: "Van",
      passengers: 4,
      luggage: 4,
      specialRequests: "City tour requested",
      status: "confirmed",
      driver: "Ana Fernández",
      cost: "€35",
    }
  ];

  const monthlyInvoices = [
    {
      id: "INV-2024-12",
      month: "Diciembre 2024",
      totalBookings: 45,
      totalAmount: "€1,840",
      paidAmount: "€1,840",
      status: "paid",
      dueDate: "2024-12-31",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-11",
      month: "Noviembre 2024", 
      totalBookings: 52,
      totalAmount: "€2,180",
      paidAmount: "€2,180",
      status: "paid",
      dueDate: "2024-11-30",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-10",
      month: "Octubre 2024",
      totalBookings: 38,
      totalAmount: "€1,560",
      paidAmount: "€1,560", 
      status: "paid",
      dueDate: "2024-10-31",
      downloadUrl: "#",
    }
  ];

  const guestProfiles = [
    {
      id: "G001",
      name: "Mr. Johnson",
      email: "johnson@email.com",
      phone: "+1 555 123 4567",
      company: "TechCorp Inc.",
      preferences: "Always premium vehicles, prefers Carlos as driver",
      totalBookings: 12,
      totalSpent: "€580",
      lastVisit: "2024-12-23",
      vipStatus: true,
    },
    {
      id: "G002",
      name: "Ms. Smith",
      email: "smith@email.com", 
      phone: "+1 555 987 6543",
      company: "Global Consulting",
      preferences: "Punctual pickups, no music during rides",
      totalBookings: 8,
      totalSpent: "€320",
      lastVisit: "2024-11-15",
      vipStatus: false,
    },
    {
      id: "G003",
      name: "Mr. Brown Family",
      email: "browns@email.com",
      phone: "+1 555 456 7890",
      company: "Brown Industries",
      preferences: "Family-friendly vehicles, child seats available",
      totalBookings: 15,
      totalSpent: "€675",
      lastVisit: "2024-12-10",
      vipStatus: true,
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const createBooking = () => {
    navigate("/book");
  };

  const editBooking = (bookingId: string) => {
    alert(`Editar reserva ${bookingId}`);
  };

  const cancelBooking = (bookingId: string) => {
    const confirm = window.confirm("¿Estás seguro de que quieres cancelar esta reserva?");
    if (confirm) {
      alert(`Reserva ${bookingId} cancelada`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Panel Empresarial
          </h1>
          <p className="text-gray-600">
            Gestiona los traslados de tus huéspedes y empleados
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsWidget
            title="Reservas Este Mes"
            value="45"
            change={{ value: "+12%", type: "increase", period: "vs mes anterior" }}
            icon={CalendarIcon}
            color="ocean"
            subtitle="8 esta semana"
          />
          <StatsWidget
            title="Huéspedes Activos"
            value="23"
            change={{ value: "+5", type: "increase", period: "este mes" }}
            icon={UsersIcon}
            color="coral"
            subtitle="15 VIP"
          />
          <StatsWidget
            title="Gasto Mensual"
            value="€1,840"
            change={{ value: "+15%", type: "increase", period: "vs mes anterior" }}
            icon={EuroIcon}
            color="success"
            subtitle="Promedio €41 por viaje"
          />
          <StatsWidget
            title="Satisfacción"
            value="4.9/5"
            change={{ value: "+0.2", type: "increase", period: "este mes" }}
            icon={TrendingUpIcon}
            color="warning"
            subtitle="Rating promedio"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="guests">Huéspedes</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-ocean" />
                    Próximas Reservas
                  </CardTitle>
                  <Button onClick={createBooking} className="bg-ocean hover:bg-ocean/90">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Nueva Reserva
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-navy">
                                {booking.guestName}
                              </h3>
                              <Badge
                                className={getStatusColor(booking.status)}
                                variant="outline"
                              >
                                {booking.status === "confirmed" && "Confirmado"}
                                {booking.status === "pending" && "Pendiente"}
                                {booking.status === "cancelled" && "Cancelado"}
                                {booking.status === "completed" && "Completado"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Contacto</h4>
                                <p className="text-sm text-gray-600">📧 {booking.guestEmail}</p>
                                <p className="text-sm text-gray-600">📱 {booking.guestPhone}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Viaje</h4>
                                <p className="text-sm text-gray-600">📍 {booking.route}</p>
                                <p className="text-sm text-gray-600">🕐 {booking.pickupDate} {booking.pickupTime}</p>
                                {booking.flightNumber && (
                                  <p className="text-sm text-gray-600">✈️ {booking.flightNumber}</p>
                                )}
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Detalles</h4>
                                <p className="text-sm text-gray-600">🚗 {booking.vehicleType}</p>
                                <p className="text-sm text-gray-600">👥 {booking.passengers} pax, {booking.luggage} maletas</p>
                                <p className="text-sm text-gray-600">💰 {booking.cost}</p>
                              </div>
                            </div>

                            {booking.specialRequests && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Solicitudes Especiales</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  {booking.specialRequests}
                                </p>
                              </div>
                            )}

                            {booking.driver !== "TBA" && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Conductor Asignado</h4>
                                <p className="text-sm text-gray-600">🚗 {booking.driver}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editBooking(booking.id)}
                          >
                            <EditIcon className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${booking.guestEmail}`)}
                          >
                            <MailIcon className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`tel:${booking.guestPhone}`)}
                          >
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            Llamar
                          </Button>
                          {booking.status !== "completed" && booking.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => cancelBooking(booking.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-ocean" />
                    Perfiles de Huéspedes
                  </CardTitle>
                  <Button className="bg-ocean hover:bg-ocean/90">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Añadir Huésped
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guestProfiles.map((guest) => (
                    <Card key={guest.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-ocean">
                                {guest.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-navy">{guest.name}</h3>
                              <p className="text-sm text-gray-600">{guest.company}</p>
                              {guest.vipStatus && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                                  VIP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{guest.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="font-medium">{guest.phone}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Reservas:</span>
                            <span className="font-medium">{guest.totalBookings}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Gastado:</span>
                            <span className="font-medium text-green-600">{guest.totalSpent}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Última Visita:</span>
                            <span className="font-medium">{guest.lastVisit}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Preferencias:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {guest.preferences}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1 bg-ocean hover:bg-ocean/90">
                            Nueva Reserva
                          </Button>
                          <Button size="sm" variant="outline">
                            <EditIcon className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MailIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Facturación y Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyInvoices.map((invoice) => (
                    <Card key={invoice.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-navy">
                                Factura {invoice.month}
                              </h3>
                              <Badge
                                className={
                                  invoice.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : invoice.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {invoice.status === "paid" && "Pagado"}
                                {invoice.status === "pending" && "Pendiente"}
                                {invoice.status === "overdue" && "Vencido"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Total Reservas:</span>
                                <p className="font-medium">{invoice.totalBookings}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Monto Total:</span>
                                <p className="font-medium">{invoice.totalAmount}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Pagado:</span>
                                <p className="font-medium text-green-600">{invoice.paidAmount}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Vencimiento:</span>
                                <p className="font-medium">{invoice.dueDate}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(invoice.downloadUrl)}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Descargar PDF
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-ocean" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Nombre de la Empresa
                    </label>
                    <Input defaultValue="Hotel Majestic" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Persona de Contacto
                    </label>
                    <Input defaultValue="María García" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email de Facturación
                    </label>
                    <Input defaultValue="billing@hotelmajestic.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Método de Pago Preferido
                    </label>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Facturación Mensual</SelectItem>
                        <SelectItem value="perBooking">Pago por Reserva</SelectItem>
                        <SelectItem value="prepaid">Cuenta Prepagada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-ocean hover:bg-ocean/90">
                    Guardar Configuración
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="w-5 h-5 text-ocean" />
                    Preferencias de Servicio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tipo de Vehículo Preferido
                    </label>
                    <Select defaultValue="premium">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="comfort">Comfort</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tiempo de Anticipación (minutos)
                    </label>
                    <Input type="number" defaultValue="15" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Instrucciones Especiales
                    </label>
                    <textarea
                      className="w-full mt-1 p-3 border border-gray-200 rounded-md focus:border-ocean focus:ring-ocean resize-none"
                      rows={3}
                      defaultValue="Siempre contactar en recepción antes de la recogida"
                    />
                  </div>
                  <Button className="w-full bg-ocean hover:bg-ocean/90">
                    Guardar Preferencias
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
