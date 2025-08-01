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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatsWidget from "@/components/StatsWidget";
import MinistryReporting from "@/components/MinistryReporting";
import TripManagement from "@/components/TripManagement";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  UsersIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  TrendingUpIcon,
  EuroIcon,
  FileTextIcon,
  SettingsIcon,
  ShieldIcon,
  MessageSquareIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  CreditCardIcon,
  BuildingIcon,
} from "lucide-react";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedPriceRequest, setSelectedPriceRequest] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [disputeResolution, setDisputeResolution] = useState("");

  // Redirect if not admin
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const pendingDrivers = [
    {
      id: "DR001",
      name: "Miguel Torres",
      email: "miguel.torres@email.com",
      phone: "+34 600 789 012",
      city: "Marbella",
      vehicle: "BMW Serie 3 (2020)",
      license: "B12345678",
      submitDate: "2024-12-20",
      status: "pending",
      documents: ["Licencia", "Seguro", "ITV", "Foto Vehículo"],
      rating: 4.8,
      tripsCompleted: 0,
      joinDate: "2024-12-20",
      vehicleYear: 2020,
      vehicleColor: "Negro",
      vehiclePlate: "1234-ABC",
      bankAccount: "**** **** **** 1234",
      address: "Calle Marina 123, Marbella",
      emergencyContact: "Ana Torres - +34 600 123 456",
      profilePhoto: "/placeholder-profile.jpg",
      documentUrls: {
        license: "/docs/license-dr001.pdf",
        insurance: "/docs/insurance-dr001.pdf",
        itv: "/docs/itv-dr001.pdf",
        vehiclePhoto: "/docs/vehicle-dr001.jpg"
      }
    },
    {
      id: "DR002", 
      name: "Laura Martínez",
      email: "laura.martinez@email.com",
      phone: "+34 600 654 987",
      city: "Málaga",
      vehicle: "Mercedes E-Class (2019)",
      license: "B87654321",
      submitDate: "2024-12-19",
      status: "pending",
      documents: ["Licencia", "Seguro", "ITV"],
    },
    {
      id: "DR003",
      name: "Antonio García", 
      email: "antonio.garcia@email.com",
      phone: "+34 600 321 456",
      city: "Estepona",
      vehicle: "Audi A4 (2021)",
      license: "B11223344",
      submitDate: "2024-12-18",
      status: "approved",
      documents: ["Licencia", "Seguro", "ITV", "Foto Vehículo"],
    },
  ];

  const priceRequests = [
    {
      id: "PR001",
      driver: "Carlos Rodríguez",
      route: "Málaga Airport → Marbella Centro",
      currentPrice: 35,
      requestedPrice: 40,
      reason: "Aumento del combustible y peajes",
      date: "2024-12-20",
      status: "pending",
    },
    {
      id: "PR002",
      driver: "Ana Fernández", 
      route: "Gibraltar → Puerto Banús",
      currentPrice: 65,
      requestedPrice: 75,
      reason: "Ruta larga con tráfico frecuente",
      date: "2024-12-19",
      status: "pending",
    },
  ];

  const disputes = [
    {
      id: "DP001",
      bookingId: "TM123456",
      client: "Juan Pérez",
      driver: "Luis González",
      issue: "El conductor llegó 30 minutos tarde",
      amount: "€45",
      date: "2024-12-20",
      status: "open",
      priority: "high",
    },
    {
      id: "DP002",
      bookingId: "TM123457",
      client: "María López",
      driver: "Pedro Sánchez", 
      issue: "Vehículo no corresponde al reservado",
      amount: "€25",
      date: "2024-12-19",
      status: "investigating",
      priority: "medium",
    },
  ];

  const approveDriver = (driverId: string) => {
    // Update driver status in state
    console.log(`Conductor ${driverId} aprobado exitosamente`);
    // In real app, this would make API call to approve driver
    alert(`Conductor ${driverId} aprobado exitosamente`);
  };

  const rejectDriverWithReason = (driverId: string, reason: string) => {
    // Update driver status in state with reason
    console.log(`Conductor ${driverId} rechazado. Motivo: ${reason}`);
    // In real app, this would make API call to reject driver
    alert(`Conductor ${driverId} rechazado. Motivo: ${reason}`);
    setRejectReason("");
  };

  const approvePrice = (requestId: string) => {
    console.log(`Solicitud de precio ${requestId} aprobada`);
    alert(`Solicitud de precio ${requestId} aprobada`);
  };

  const rejectPrice = (requestId: string) => {
    console.log(`Solicitud de precio ${requestId} rechazada`);
    alert(`Solicitud de precio ${requestId} rechazada`);
  };

  const viewDriverDetails = (driver: any) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  const viewDocuments = (driver: any) => {
    setSelectedDriver(driver);
    setShowDocumentsModal(true);
  };

  const resolveDispute = (disputeId: string, resolution: string) => {
    console.log(`Disputa ${disputeId} resuelta: ${resolution}`);
    alert(`Disputa ${disputeId} resuelta exitosamente`);
    setDisputeResolution("");
    setShowDisputeModal(false);
  };

  const contactParties = (dispute: any) => {
    // In real app, this would open communication interface
    alert(`Iniciando comunicación con ${dispute.client} y ${dispute.driver}`);
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
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios, aprobaciones y configura el sistema
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsWidget
            title="Usuarios Totales"
            value="1,247"
            change={{ value: "+12%", type: "increase", period: "este mes" }}
            icon={UsersIcon}
            color="ocean"
            subtitle="854 clientes, 89 conductores"
          />
          <StatsWidget
            title="Solicitudes Pendientes"
            value="8"
            change={{ value: "+3", type: "increase", period: "esta semana" }}
            icon={ClockIcon}
            color="warning"
            subtitle="5 conductores, 3 precios"
          />
          <StatsWidget
            title="Disputas Activas"
            value="3"
            change={{ value: "-2", type: "decrease", period: "��ltima semana" }}
            icon={AlertTriangleIcon}
            color="coral"
            subtitle="2 abiertas, 1 investigando"
          />
          <StatsWidget
            title="Ingresos Totales"
            value="€45,230"
            change={{ value: "+18%", type: "increase", period: "este mes" }}
            icon={EuroIcon}
            color="success"
            subtitle="Comisiones del sistema"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="drivers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="drivers">Conductores</TabsTrigger>
            <TabsTrigger value="pricing">Precios</TabsTrigger>
            <TabsTrigger value="disputes">Disputas</TabsTrigger>
            <TabsTrigger value="ministry">Ministerio</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          {/* Driver Applications Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-ocean" />
                    Solicitudes de Conductores
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar conductor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="approved">Aprobados</SelectItem>
                        <SelectItem value="rejected">Rechazados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDrivers.map((driver) => (
                    <Card key={driver.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-ocean">
                                {driver.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-navy">
                                {driver.name}
                              </h3>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>📧 {driver.email}</p>
                                <p>📱 {driver.phone}</p>
                                <p>📍 {driver.city}</p>
                                <p>🚗 {driver.vehicle}</p>
                                <p>🆔 Licencia: {driver.license}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                driver.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : driver.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {driver.status === "pending" && "Pendiente"}
                              {driver.status === "approved" && "Aprobado"}
                              {driver.status === "rejected" && "Rechazado"}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Enviado: {driver.submitDate}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Documentos:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {driver.documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-ocean text-ocean"
                              >
                                {doc} ✓
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-3 flex-wrap gap-2">
                          <Button
                            onClick={() => viewDriverDetails(driver)}
                            variant="outline"
                            size="sm"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button
                            onClick={() => viewDocuments(driver)}
                            variant="outline"
                            size="sm"
                          >
                            <FileTextIcon className="w-4 h-4 mr-2" />
                            Ver Documentos
                          </Button>
                          {driver.status === "pending" && (
                            <>
                              <Button
                                onClick={() => approveDriver(driver.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Aprobar
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                    size="sm"
                                  >
                                    <XCircleIcon className="w-4 h-4 mr-2" />
                                    Rechazar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Rechazar Solicitud de Conductor</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="reject-reason">Motivo del rechazo</Label>
                                      <Textarea
                                        id="reject-reason"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Explica el motivo del rechazo..."
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() => rejectDriverWithReason(driver.id, rejectReason)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        disabled={!rejectReason.trim()}
                                      >
                                        Confirmar Rechazo
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Requests Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EuroIcon className="w-5 h-5 text-ocean" />
                  Solicitudes de Aumento de Precio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priceRequests.map((request) => (
                    <Card key={request.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              {request.route}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Solicitado por: {request.driver}
                            </p>
                            <p className="text-sm text-gray-600">
                              Fecha: {request.date}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pendiente
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm font-medium text-red-800">
                              Precio Actual
                            </p>
                            <p className="text-xl font-bold text-red-600">
                              ��{request.currentPrice}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-green-800">
                              Precio Solicitado
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              €{request.requestedPrice}
                            </p>
                            <p className="text-xs text-green-600">
                              (+€{request.requestedPrice - request.currentPrice})
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Justificación:
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {request.reason}
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            onClick={() => approvePrice(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Aprobar Aumento
                          </Button>
                          <Button
                            onClick={() => rejectPrice(request.id)}
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="w-5 h-5 text-coral" />
                  Disputas y Reclamaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <Card key={dispute.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              Reserva #{dispute.bookingId}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Cliente: {dispute.client} | Conductor: {dispute.driver}
                            </p>
                            <p className="text-sm text-gray-600">
                              Monto: {dispute.amount} | Fecha: {dispute.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                dispute.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : dispute.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              Prioridad {dispute.priority === "high" && "Alta"}
                              {dispute.priority === "medium" && "Media"}
                              {dispute.priority === "low" && "Baja"}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Estado: {dispute.status}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Descripción del problema:
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {dispute.issue}
                          </p>
                        </div>

                        <div className="flex space-x-3 flex-wrap gap-2">
                          <Button
                            onClick={() => contactParties(dispute)}
                            className="bg-ocean hover:bg-ocean/90"
                            size="sm"
                          >
                            <MessageSquareIcon className="w-4 h-4 mr-2" />
                            Contactar Partes
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowDisputeModal(true);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <FileTextIcon className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Resolver Disputa
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Resolver Disputa #{dispute.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="resolution">Resolución de la disputa</Label>
                                  <Textarea
                                    id="resolution"
                                    value={disputeResolution}
                                    onChange={(e) => setDisputeResolution(e.target.value)}
                                    placeholder="Describe la resoluci��n de la disputa..."
                                    rows={4}
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => resolveDispute(dispute.id, disputeResolution)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={!disputeResolution.trim()}
                                  >
                                    Confirmar Resolución
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ministry Reporting Tab */}
          <TabsContent value="ministry" className="space-y-6">
            <MinistryReporting />
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-ocean" />
                    Configuración del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Comisión del Sistema (%)
                    </label>
                    <Input type="number" defaultValue="15" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tiempo máximo de espera (min)
                    </label>
                    <Input type="number" defaultValue="15" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Radio de búsqueda de conductores (km)
                    </label>
                    <Input type="number" defaultValue="25" className="mt-1" />
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
                    Reportes y Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // Generate and download monthly income report
                      alert("Generando reporte mensual de ingresos...");
                    }}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Reporte Mensual de Ingresos
                    <Badge className="ml-auto bg-green-100 text-green-800">€45,230</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // Generate driver statistics report
                      alert("Generando estadísticas de conductores...");
                    }}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Estadísticas de Conductores
                    <Badge className="ml-auto bg-blue-100 text-blue-800">89 activos</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // Generate disputes report
                      alert("Generando reporte de disputas...");
                    }}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Reporte de Disputas
                    <Badge className="ml-auto bg-yellow-100 text-yellow-800">3 activas</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // Generate ministry data report
                      alert("Generando datos para el Ministerio...");
                    }}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Datos para Ministerio
                    <Badge className="ml-auto bg-purple-100 text-purple-800">Mensual</Badge>
                  </Button>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Acciones del Sistema</h4>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-blue-600"
                      onClick={() => {
                        alert("Enviando notificaciones push a todos los usuarios...");
                      }}
                    >
                      <MessageSquareIcon className="w-4 h-4 mr-2" />
                      Enviar Notificación Global
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-orange-600"
                      onClick={() => {
                        if (confirm("¿Estás seguro de que quieres realizar backup de la base de datos?")) {
                          alert("Iniciando backup de la base de datos...");
                        }
                      }}
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Backup Base de Datos
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        if (confirm("¿Estás seguro de que quieres reiniciar el sistema? Esto afectará a todos los usuarios.")) {
                          alert("Reiniciando sistema en modo mantenimiento...");
                        }
                      }}
                    >
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Reiniciar Sistema
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Driver Details Modal */}
      <Dialog open={showDriverModal} onOpenChange={setShowDriverModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-ocean to-coral rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {selectedDriver?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedDriver?.name}</h3>
                <p className="text-sm text-gray-600">Solicitud #{selectedDriver?.id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedDriver && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MailIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedDriver.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Registro: {selectedDriver.submitDate}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ShieldIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Licencia: {selectedDriver.license}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCardIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Cuenta: {selectedDriver.bankAccount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Emergencia: {selectedDriver.emergencyContact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Rating: {selectedDriver.rating}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedDriver.vehicle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Año: {selectedDriver.vehicleYear}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 text-gray-500">🎨</span>
                      <span className="text-sm">Color: {selectedDriver.vehicleColor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 text-gray-500">🔢</span>
                      <span className="text-sm">Matrícula: {selectedDriver.vehiclePlate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedDriver.documents?.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => viewDocuments(selectedDriver)}
                  variant="outline"
                  className="flex-1"
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Ver Documentos
                </Button>
                {selectedDriver.status === "pending" && (
                  <>
                    <Button
                      onClick={() => approveDriver(selectedDriver.id)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Aprobar Conductor
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Documentos de {selectedDriver?.name}</DialogTitle>
          </DialogHeader>

          {selectedDriver && (
            <div className="space-y-4">
              {selectedDriver.documents?.map((doc, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileTextIcon className="w-8 h-8 text-ocean" />
                        <div>
                          <h4 className="font-medium">{doc}</h4>
                          <p className="text-sm text-gray-600">
                            Subido el {selectedDriver.submitDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Document validation section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Validación de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Licencia de Conducir</span>
                      <Badge className="bg-green-600 text-white">Válida</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Seguro del Vehículo</span>
                      <Badge className="bg-green-600 text-white">Válida</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">ITV</span>
                      <Badge className="bg-green-600 text-white">Válida</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Foto del Vehículo</span>
                      <Badge className="bg-yellow-600 text-white">Pendiente revisión</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Details Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Disputa #{selectedDispute?.id}</DialogTitle>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-6">
              {/* Dispute Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">ID de Reserva</p>
                      <p className="text-sm">{selectedDispute.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha</p>
                      <p className="text-sm">{selectedDispute.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cliente</p>
                      <p className="text-sm">{selectedDispute.client}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Conductor</p>
                      <p className="text-sm">{selectedDispute.driver}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Monto en Disputa</p>
                      <p className="text-sm font-bold text-ocean">{selectedDispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Prioridad</p>
                      <Badge
                        className={
                          selectedDispute.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : selectedDispute.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {selectedDispute.priority === "high" && "Alta"}
                        {selectedDispute.priority === "medium" && "Media"}
                        {selectedDispute.priority === "low" && "Baja"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descripción del Problema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm bg-gray-50 p-4 rounded-lg border">
                    {selectedDispute.issue}
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cronología de la Disputa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Disputa reportada</p>
                        <p className="text-xs text-gray-600">{selectedDispute.date} - Cliente reportó el problema</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">En investigación</p>
                        <p className="text-xs text-gray-600">Equipo de soporte revisando el caso</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => contactParties(selectedDispute)}
                  className="bg-ocean hover:bg-ocean/90 flex-1"
                >
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Contactar Partes
                </Button>
                <Button variant="outline" className="flex-1">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
