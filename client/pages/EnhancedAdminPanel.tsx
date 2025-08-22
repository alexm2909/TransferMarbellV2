import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import { 
  useUsers, 
  useBookings, 
  useDriverApplications, 
  useSystemStats,
  useEmergencyBookings,
  useDatabaseExport
} from "@/hooks/useDatabase";
import {
  CarIcon,
  UsersIcon,
  SettingsIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DownloadIcon,
  RefreshCwIcon,
  ShieldIcon,
  ClockIcon,
  EuroIcon,
} from "lucide-react";

export default function EnhancedAdminPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { users } = useUsers();
  const { bookings } = useBookings();
  const { applications, approveApplication, rejectApplication } = useDriverApplications();
  const { stats } = useSystemStats();
  const { emergencyBookings, createEmergencyBooking } = useEmergencyBookings();
  const { exportData, clearData } = useDatabaseExport();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [emergencyDialog, setEmergencyDialog] = useState<{ open: boolean; booking?: any }>({ open: false });
  const [emergencyBonus, setEmergencyBonus] = useState(10);
  const [emergencyReason, setEmergencyReason] = useState("");

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">Solo los administradores pueden acceder a este panel</p>
            <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApproveApplication = async (applicationId: string) => {
    const success = approveApplication(applicationId, user.id, "Solicitud aprobada por administrador");
    if (success) {
      // Success handled through UI update
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const reason = prompt("Motivo del rechazo:");
    if (reason) {
      const success = rejectApplication(applicationId, user.id, reason);
      if (success) {
        // Success handled through UI update
      }
    }
  };

  const handleCreateEmergency = async () => {
    if (!emergencyDialog.booking || !emergencyReason) return;
    
    const success = createEmergencyBooking(
      emergencyDialog.booking.id,
      emergencyReason,
      emergencyBonus,
      user.id
    );
    
    if (success) {
      setEmergencyDialog({ open: false });
      setEmergencyReason("");
      setEmergencyBonus(10);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800", 
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
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
                Transfermarbell Admin
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={exportData} size="sm">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Exportar Datos
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
                <UsersIcon className="w-8 h-8 text-ocean" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conductores</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalDrivers || 0}</p>
                </div>
                <CarIcon className="w-8 h-8 text-coral" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                </div>
                <TrendingUpIcon className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingApplications || 0}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">Solicitudes Conductor</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="emergencies">Emergencias</TabsTrigger>
          </TabsList>

          {/* Driver Applications */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Conductor Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Usuario ID: {application.userId}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Vehículo: {application.vehicle.make} {application.vehicle.model} ({application.vehicle.year})
                            </p>
                            <p className="text-sm text-gray-600">
                              Enviado: {new Date(application.submittedAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {application.status === 'pending' ? 'Pendiente' : application.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline">
                            Matrícula: {application.vehicle.plate}
                          </Badge>
                          <Badge variant="outline">
                            Color: {application.vehicle.color}
                          </Badge>
                          <Badge variant="outline">
                            {application.documents.length} documentos
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveApplication(application.id)}
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleRejectApplication(application.id)}
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay solicitudes pendientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 10).map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {booking.tripDetails.origin.address} → {booking.tripDetails.destination.address}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.tripDetails.date).toLocaleDateString('es-ES')} - {booking.tripDetails.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cliente: {booking.clientData?.name || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            €{booking.pricing.totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{booking.tripDetails.passengers} pasajeros</span>
                          <span>{booking.tripDetails.luggage.small + booking.tripDetails.luggage.medium + booking.tripDetails.luggage.large} maletas</span>
                        </div>
                        <div className="flex gap-2">
                          {!booking.isEmergency && booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600"
                              onClick={() => setEmergencyDialog({ open: true, booking })}
                            >
                              <AlertTriangleIcon className="w-4 h-4 mr-2" />
                              Convertir a Emergencia
                            </Button>
                          )}
                          {booking.isEmergency && (
                            <Badge className="bg-red-100 text-red-700">
                              🚨 Emergencia (+€{booking.emergencyDetails?.emergencyBonus})
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">Teléfono: {user.phone || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'driver' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {user.role === 'admin' ? 'Administrador' :
                             user.role === 'driver' ? 'Conductor' :
                             'Cliente'}
                          </Badge>
                          {user.driverStatus && (
                            <Badge className="mt-1 block" variant="outline">
                              {user.driverStatus === 'pending' ? 'Pendiente' :
                               user.driverStatus === 'approved' ? 'Aprobado' :
                               'Rechazado'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Bookings */}
          <TabsContent value="emergencies">
            <Card>
              <CardHeader>
                <CardTitle>Reservas de Emergencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyBookings.length > 0 ? (
                    emergencyBookings.map((booking) => (
                      <div key={booking.id} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-red-900">
                              🚨 {booking.tripDetails.origin.address} → {booking.tripDetails.destination.address}
                            </h4>
                            <p className="text-sm text-red-700">
                              {new Date(booking.tripDetails.date).toLocaleDateString('es-ES')} - {booking.tripDetails.time}
                            </p>
                            <p className="text-sm text-red-700">
                              Motivo: {booking.emergencyDetails?.reason}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-900">
                              €{booking.pricing.totalPrice} 
                              <span className="text-sm font-normal">
                                (+€{booking.emergencyDetails?.emergencyBonus} bonus)
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay reservas de emergencia</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Creation Dialog */}
        <Dialog open={emergencyDialog.open} onOpenChange={(open) => setEmergencyDialog({ open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convertir a Reserva de Emergencia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Motivo de la emergencia</label>
                <Input
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="Ej: Conductor no disponible, cancelación de último momento..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bonus adicional (€)</label>
                <Input
                  type="number"
                  value={emergencyBonus}
                  onChange={(e) => setEmergencyBonus(Number(e.target.value))}
                  min="5"
                  max="100"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEmergencyDialog({ open: false })}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCreateEmergency}
                  disabled={!emergencyReason}
                >
                  Crear Emergencia
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
