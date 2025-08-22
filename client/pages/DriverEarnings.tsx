import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useDatabase";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  EuroIcon,
  TrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ArrowLeftIcon,
  DownloadIcon,
  CreditCardIcon,
  PieChartIcon,
  BarChartIcon,
  StarIcon,
} from "lucide-react";

export default function DriverEarnings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { bookings: driverBookings } = useBookings(user?.id);

  // Redirect if not authenticated or not a driver
  if (!isAuthenticated || user?.role !== "driver") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Acceso denegado. Solo conductores pueden ver esta página.</p>
          <div className="mt-4">
            <Link to="/signin">
              <Button variant="outline" className="mr-2">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter completed bookings for this driver
  const completedBookings = driverBookings.filter(booking => booking.status === "completed");
  
  // Calculate earnings
  const totalEarnings = completedBookings.reduce((total, booking) => total + booking.pricing.totalPrice, 0);
  const todayBookings = completedBookings.filter(booking => {
    const bookingDate = new Date(booking.tripDetails.date);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  });
  const todayEarnings = todayBookings.reduce((total, booking) => total + booking.pricing.totalPrice, 0);
  
  // Calculate this month's earnings
  const thisMonth = new Date();
  const monthlyBookings = completedBookings.filter(booking => {
    const bookingDate = new Date(booking.tripDetails.date);
    return bookingDate.getMonth() === thisMonth.getMonth() && 
           bookingDate.getFullYear() === thisMonth.getFullYear();
  });
  const monthlyEarnings = monthlyBookings.reduce((total, booking) => total + booking.pricing.totalPrice, 0);

  // Calculate weekly earnings
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyBookings = completedBookings.filter(booking => {
    const bookingDate = new Date(booking.tripDetails.date);
    return bookingDate >= weekAgo;
  });
  const weeklyEarnings = weeklyBookings.reduce((total, booking) => total + booking.pricing.totalPrice, 0);

  // Emergency bonus earnings
  const emergencyEarnings = completedBookings
    .filter(booking => booking.isEmergency)
    .reduce((total, booking) => total + (booking.emergencyDetails?.emergencyBonus || 0), 0);

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

            <div className="flex items-center space-x-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              to="/driver-panel"
              className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver al Panel de Conductor
            </Link>
            <h1 className="text-3xl font-bold text-navy">
              Mis Ganancias
            </h1>
            <p className="text-gray-600 mt-2">
              Resumen completo de tus ingresos como conductor
            </p>
          </div>
          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Acumulado</p>
                  <p className="text-2xl font-bold text-ocean">€{totalEarnings.toFixed(2)}</p>
                </div>
                <EuroIcon className="w-8 h-8 text-ocean" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {completedBookings.length} viajes completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold text-coral">€{monthlyEarnings.toFixed(2)}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-coral" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {monthlyBookings.length} viajes este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-purple">€{weeklyEarnings.toFixed(2)}</p>
                </div>
                <TrendingUpIcon className="w-8 h-8 text-purple" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {weeklyBookings.length} viajes esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoy</p>
                  <p className="text-2xl font-bold text-green-600">€{todayEarnings.toFixed(2)}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {todayBookings.length} viajes hoy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Special Earnings */}
        {emergencyEarnings > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    🚨 Bonus por Emergencias
                  </h3>
                  <p className="text-orange-700">
                    Has ganado €{emergencyEarnings.toFixed(2)} extra por aceptar viajes de emergencia
                  </p>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  +€{emergencyEarnings.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Historial de Viajes</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Viajes Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedBookings.length > 0 ? (
                    completedBookings.slice(-10).reverse().map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{booking.clientData?.name || 'Cliente'}</h4>
                            <p className="text-sm text-gray-600">
                              {booking.tripDetails.origin.address} → {booking.tripDetails.destination.address}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.tripDetails.date} • {booking.tripDetails.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-lg">
                              €{booking.pricing.totalPrice}
                              {booking.isEmergency && (
                                <span className="text-sm text-orange-600 block">
                                  +€{booking.emergencyDetails?.emergencyBonus} bonus
                                </span>
                              )}
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Completado
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <EuroIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No tienes viajes completados aún</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5 text-ocean" />
                    Resumen de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-ocean-light/10 rounded-lg">
                    <span className="text-sm font-medium">Promedio por viaje</span>
                    <span className="font-bold text-ocean">
                      €{completedBookings.length > 0 ? (totalEarnings / completedBookings.length).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-coral-light/10 rounded-lg">
                    <span className="text-sm font-medium">Viajes este mes</span>
                    <span className="font-bold text-coral">{monthlyBookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple/10 rounded-lg">
                    <span className="text-sm font-medium">Promedio semanal</span>
                    <span className="font-bold text-purple">
                      €{(weeklyEarnings / 7).toFixed(2)}/día
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                    <span className="text-sm font-medium">Rating promedio</span>
                    <span className="font-bold text-green-600 flex items-center">
                      <StarIcon className="w-4 h-4 mr-1 fill-current" />
                      4.9
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-coral" />
                    Desglose de Ingresos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Viajes regulares</span>
                    <span className="font-bold text-blue-600">
                      €{(totalEarnings - emergencyEarnings).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">Bonus emergencias</span>
                    <span className="font-bold text-orange-600">€{emergencyEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Comisión plataforma (15%)</span>
                    <span className="font-bold text-gray-600">
                      -€{(totalEarnings * 0.15).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                      <span className="text-sm font-medium">Ingresos netos</span>
                      <span className="font-bold text-green-600">
                        €{(totalEarnings * 0.85).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Información de Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💳 Método de Pago</h4>
                    <p className="text-blue-700 text-sm">
                      Los pagos se realizan semanalmente los viernes mediante transferencia bancaria.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">📅 Próximo Pago</h4>
                    <p className="text-green-700 text-sm">
                      Viernes 22 de Marzo, 2024 - €{weeklyEarnings.toFixed(2)}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ Información Importante</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Los pagos se procesan automáticamente cada viernes</li>
                      <li>• La comisión de la plataforma es del 15%</li>
                      <li>• Los bonus por emergencias se pagan íntegramente</li>
                      <li>• Recibirás un email de confirmación con cada pago</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
