import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  FileTextIcon,
  DownloadIcon,
  SendIcon,
  CalendarIcon,
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  MapPinIcon,
  CarIcon,
  UsersIcon,
  EuroIcon,
  PrinterIcon,
  MailIcon,
} from "lucide-react";

interface TripReport {
  id: string;
  bookingId: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  passengers: number;
  vehicle: string;
  driverName: string;
  driverLicense: string;
  clientName: string;
  amount: number;
  status: "completed" | "pending_report" | "reported" | "failed";
  reportedAt?: string;
  reportId?: string;
}

interface MinistryReportSummary {
  period: string;
  totalTrips: number;
  totalRevenue: number;
  totalKm: number;
  totalPassengers: number;
  uniqueDrivers: number;
  reportDate: string;
  status: "draft" | "submitted" | "accepted" | "rejected";
}

export default function MinistryReporting() {
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [reportStatus, setReportStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");

  // Mock data for completed trips
  const completedTrips: TripReport[] = [
    {
      id: "TR001",
      bookingId: "TM123456",
      date: "2024-12-20",
      origin: "Málaga Airport",
      destination: "Marbella Centro",
      distance: 55,
      duration: 45,
      passengers: 2,
      vehicle: "Mercedes E-Class 2020",
      driverName: "Carlos Rodríguez",
      driverLicense: "B12345678",
      clientName: "Juan Pérez",
      amount: 45,
      status: "pending_report",
    },
    {
      id: "TR002", 
      bookingId: "TM123457",
      date: "2024-12-20",
      origin: "Gibraltar",
      destination: "Puerto Banús",
      distance: 78,
      duration: 65,
      passengers: 4,
      vehicle: "BMW Serie 5 2019",
      driverName: "Ana García",
      driverLicense: "B87654321",
      clientName: "María López",
      amount: 75,
      status: "reported",
      reportedAt: "2024-12-20",
      reportId: "MIN2024120001"
    },
    {
      id: "TR003",
      bookingId: "TM123458", 
      date: "2024-12-19",
      origin: "Marbella Centro",
      destination: "Málaga Airport",
      distance: 55,
      duration: 50,
      passengers: 1,
      vehicle: "Audi A4 2021",
      driverName: "Luis González",
      driverLicense: "B11223344",
      clientName: "Antonio Silva",
      amount: 48,
      status: "completed",
    },
  ];

  // Mock monthly summary
  const monthlySummary: MinistryReportSummary = {
    period: "Diciembre 2024",
    totalTrips: 156,
    totalRevenue: 6750,
    totalKm: 8940,
    totalPassengers: 324,
    uniqueDrivers: 24,
    reportDate: "2024-12-20",
    status: "draft",
  };

  const filteredTrips = completedTrips.filter(trip => {
    const matchesSearch = trip.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = reportStatus === "all" || trip.status === reportStatus;
    return matchesSearch && matchesStatus;
  });

  const generateTripReport = (tripId: string) => {
    const trip = completedTrips.find(t => t.id === tripId);
    if (trip) {
      const reportId = `MIN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-4)}`;
      trip.status = "reported";
      trip.reportedAt = new Date().toISOString().split('T')[0];
      trip.reportId = reportId;
      alert(`Viaje ${trip.bookingId} reportado al Ministerio de Turismo con ID: ${reportId}`);
    }
  };

  const generateBulkReport = () => {
    const pendingTrips = completedTrips.filter(trip => trip.status === "pending_report" || trip.status === "completed");
    if (pendingTrips.length === 0) {
      alert("No hay viajes pendientes de reportar");
      return;
    }
    
    pendingTrips.forEach(trip => {
      const reportId = `MIN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Date.now() + Math.random() * 1000).slice(-4)}`;
      trip.status = "reported";
      trip.reportedAt = new Date().toISOString().split('T')[0];
      trip.reportId = reportId;
    });
    
    alert(`${pendingTrips.length} viajes reportados exitosamente al Ministerio de Turismo`);
  };

  const submitMonthlyReport = () => {
    if (!submissionNotes.trim()) {
      alert("Por favor, añade notas para el envío del reporte");
      return;
    }
    
    monthlySummary.status = "submitted";
    alert(`Reporte mensual de ${monthlySummary.period} enviado exitosamente al Ministerio de Turismo`);
    setShowSubmissionDialog(false);
    setSubmissionNotes("");
  };

  const downloadReport = (type: "individual" | "bulk" | "monthly") => {
    switch(type) {
      case "individual":
        alert("Descargando reporte individual en formato PDF...");
        break;
      case "bulk":
        alert("Descargando reporte masivo de viajes en formato Excel...");
        break;
      case "monthly":
        alert("Descargando reporte mensual en formato PDF...");
        break;
    }
  };

  const exportToMinistry = (format: "xml" | "json" | "csv") => {
    alert(`Exportando datos al formato ${format.toUpperCase()} para el Ministerio de Turismo...`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Reportes Ministerio de Turismo</h2>
          <p className="text-gray-600">Gestiona y envía reportes obligatorios de viajes completados</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={generateBulkReport} className="bg-ocean hover:bg-ocean/90">
            <SendIcon className="w-4 h-4 mr-2" />
            Enviar Viajes Pendientes
          </Button>
          <Button onClick={() => downloadReport("bulk")} variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Descargar Reporte
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedTrips.filter(t => t.status === "reported").length}
                </div>
                <div className="text-sm text-gray-600">Viajes Reportados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {completedTrips.filter(t => t.status === "pending_report" || t.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EuroIcon className="w-8 h-8 text-ocean" />
              <div>
                <div className="text-2xl font-bold text-ocean">
                  €{completedTrips.reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div className="text-sm text-gray-600">Ingresos Totales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-8 h-8 text-coral" />
              <div>
                <div className="text-2xl font-bold text-coral">
                  {completedTrips.reduce((sum, t) => sum + t.distance, 0)} km
                </div>
                <div className="text-sm text-gray-600">Distancia Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuildingIcon className="w-5 h-5 text-ocean" />
            Reporte Mensual - {monthlySummary.period}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de Viajes:</span>
                <span className="font-medium">{monthlySummary.totalTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ingresos Totales:</span>
                <span className="font-medium">€{monthlySummary.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Kilómetros Totales:</span>
                <span className="font-medium">{monthlySummary.totalKm.toLocaleString()} km</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pasajeros:</span>
                <span className="font-medium">{monthlySummary.totalPassengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conductores Únicos:</span>
                <span className="font-medium">{monthlySummary.uniqueDrivers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fecha de Reporte:</span>
                <span className="font-medium">{monthlySummary.reportDate}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <Badge
                  className={
                    monthlySummary.status === "submitted"
                      ? "bg-blue-100 text-blue-800"
                      : monthlySummary.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : monthlySummary.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {monthlySummary.status === "draft" && "Borrador"}
                  {monthlySummary.status === "submitted" && "Enviado"}
                  {monthlySummary.status === "accepted" && "Aceptado"}
                  {monthlySummary.status === "rejected" && "Rechazado"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 flex-wrap gap-2">
            <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <SendIcon className="w-4 h-4 mr-2" />
                  Enviar Reporte Mensual
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Reporte Mensual al Ministerio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="submission-notes">Notas del envío</Label>
                    <Textarea
                      id="submission-notes"
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="Añade cualquier nota relevante para el Ministerio de Turismo..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={submitMonthlyReport}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={!submissionNotes.trim()}
                    >
                      Confirmar Envío
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={() => downloadReport("monthly")} variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={() => exportToMinistry("xml")} variant="outline">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Exportar XML
            </Button>
            <Button onClick={() => exportToMinistry("json")} variant="outline">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Exportar JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Trip Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CarIcon className="w-5 h-5 text-ocean" />
              Reportes Individuales de Viajes
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar viaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={reportStatus} onValueChange={setReportStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="pending_report">Pendientes</SelectItem>
                  <SelectItem value="reported">Reportados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                        <CarIcon className="w-5 h-5 text-ocean" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">Reserva #{trip.bookingId}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📅 {trip.date}</p>
                          <p>📍 {trip.origin} → {trip.destination}</p>
                          <p>🚗 {trip.vehicle} - {trip.driverName}</p>
                          <p>👥 {trip.passengers} pasajeros - {trip.distance}km - €{trip.amount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          trip.status === "reported"
                            ? "bg-green-100 text-green-800"
                            : trip.status === "pending_report"
                            ? "bg-yellow-100 text-yellow-800"
                            : trip.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {trip.status === "completed" && "Completado"}
                        {trip.status === "pending_report" && "Pendiente"}
                        {trip.status === "reported" && "Reportado"}
                        {trip.status === "failed" && "Fallido"}
                      </Badge>
                      {trip.reportedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reportado: {trip.reportedAt}
                        </p>
                      )}
                      {trip.reportId && (
                        <p className="text-xs text-gray-500">
                          ID: {trip.reportId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3 flex-wrap gap-2">
                    {(trip.status === "completed" || trip.status === "pending_report") && (
                      <Button
                        onClick={() => generateTripReport(trip.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <SendIcon className="w-4 h-4 mr-2" />
                        Reportar al Ministerio
                      </Button>
                    )}
                    <Button
                      onClick={() => downloadReport("individual")}
                      variant="outline"
                      size="sm"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    <Button
                      onClick={() => alert(`Enviando detalles del viaje ${trip.bookingId} por email...`)}
                      variant="outline"
                      size="sm"
                    >
                      <MailIcon className="w-4 h-4 mr-2" />
                      Enviar por Email
                    </Button>
                    {trip.status === "reported" && (
                      <Button
                        onClick={() => alert(`Verificando estado del reporte ${trip.reportId} en el Ministerio...`)}
                        variant="outline"
                        size="sm"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Verificar Estado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTrips.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No se encontraron viajes que coincidan con los filtros</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-ocean" />
            Opciones de Exportación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => exportToMinistry("xml")}
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <FileTextIcon className="w-6 h-6" />
              <span>Formato XML</span>
              <span className="text-xs text-gray-500">Estándar del Ministerio</span>
            </Button>
            <Button
              onClick={() => exportToMinistry("json")}
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <FileTextIcon className="w-6 h-6" />
              <span>Formato JSON</span>
              <span className="text-xs text-gray-500">Para APIs</span>
            </Button>
            <Button
              onClick={() => exportToMinistry("csv")}
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <FileTextIcon className="w-6 h-6" />
              <span>Formato CSV</span>
              <span className="text-xs text-gray-500">Para Excel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
