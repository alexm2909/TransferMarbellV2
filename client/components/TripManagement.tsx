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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPinIcon,
  CarIcon,
  UsersIcon,
  ClockIcon,
  EuroIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EditIcon,
  MessageSquareIcon,
  FileTextIcon,
  DownloadIcon,
  RefreshCwIcon,
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
} from "lucide-react";

interface Trip {
  id: string;
  bookingId: string;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled" | "disputed";
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  driverName?: string;
  driverPhone?: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  vehicle: string;
  price: number;
  distance: number;
  duration: number;
  paymentStatus: "pending" | "paid" | "refunded" | "disputed";
  priority: "low" | "medium" | "high";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TripStats {
  total: number;
  pending: number;
  active: number;
  completed: number;
  cancelled: number;
  revenue: number;
  avgRating: number;
}

export default function TripManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignNotes, setAssignNotes] = useState("");

  // Mock trip data
  const trips: Trip[] = [
    {
      id: "TR001",
      bookingId: "TM123456",
      status: "pending",
      clientName: "Juan Pérez",
      clientPhone: "+34 600 123 456",
      clientEmail: "juan.perez@email.com",
      origin: "Málaga Airport",
      destination: "Hotel Majestic, Marbella",
      date: "2024-12-21",
      time: "14:30",
      passengers: 2,
      luggage: 3,
      vehicle: "Sedán",
      price: 45,
      distance: 55,
      duration: 45,
      paymentStatus: "pending",
      priority: "high",
      notes: "Cliente VIP - Recoger en zona de llegadas",
      createdAt: "2024-12-20 10:30",
      updatedAt: "2024-12-20 10:30"
    },
    {
      id: "TR002",
      bookingId: "TM123457",
      status: "assigned",
      clientName: "María López",
      clientPhone: "+34 600 789 012",
      clientEmail: "maria.lopez@email.com",
      driverName: "Carlos Rodríguez",
      driverPhone: "+34 600 555 777",
      origin: "Hotel Don Pepe, Marbella",
      destination: "Gibraltar",
      date: "2024-12-21",
      time: "09:00",
      passengers: 4,
      luggage: 2,
      vehicle: "Monovolumen",
      price: 75,
      distance: 78,
      duration: 65,
      paymentStatus: "paid",
      priority: "medium",
      createdAt: "2024-12-20 08:15",
      updatedAt: "2024-12-20 12:45"
    },
    {
      id: "TR003",
      bookingId: "TM123458",
      status: "completed",
      clientName: "Antonio Silva",
      clientPhone: "+34 600 345 678",
      clientEmail: "antonio.silva@email.com",
      driverName: "Ana García",
      driverPhone: "+34 600 111 222",
      origin: "Puerto Banús",
      destination: "Málaga Airport",
      date: "2024-12-20",
      time: "16:00",
      passengers: 1,
      luggage: 1,
      vehicle: "Sedán",
      price: 48,
      distance: 55,
      duration: 50,
      paymentStatus: "paid",
      priority: "low",
      createdAt: "2024-12-19 14:20",
      updatedAt: "2024-12-20 17:15"
    }
  ];

  // Calculate stats
  const stats: TripStats = {
    total: trips.length,
    pending: trips.filter(t => t.status === "pending").length,
    active: trips.filter(t => t.status === "assigned" || t.status === "in_progress").length,
    completed: trips.filter(t => t.status === "completed").length,
    cancelled: trips.filter(t => t.status === "cancelled").length,
    revenue: trips.filter(t => t.paymentStatus === "paid").reduce((sum, t) => sum + t.price, 0),
    avgRating: 4.7
  };

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "today" && trip.date === "2024-12-21") ||
                       (dateFilter === "yesterday" && trip.date === "2024-12-20") ||
                       (dateFilter === "week" && new Date(trip.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
      assigned: { label: "Asignado", class: "bg-blue-100 text-blue-800" },
      in_progress: { label: "En Curso", class: "bg-purple-100 text-purple-800" },
      completed: { label: "Completado", class: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", class: "bg-red-100 text-red-800" },
      disputed: { label: "En Disputa", class: "bg-orange-100 text-orange-800" }
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: "Baja", class: "bg-gray-100 text-gray-800" },
      medium: { label: "Media", class: "bg-yellow-100 text-yellow-800" },
      high: { label: "Alta", class: "bg-red-100 text-red-800" }
    };
    const config = priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
    return <Badge variant="outline" className={config.class}>{config.label}</Badge>;
  };

  const assignTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      trip.status = "assigned";
      trip.driverName = "Luis González";
      trip.driverPhone = "+34 600 999 888";
      trip.updatedAt = new Date().toISOString();
      alert(`Viaje ${trip.bookingId} asignado exitosamente a ${trip.driverName}`);
      setShowAssignModal(false);
      setAssignNotes("");
    }
  };

  const cancelTrip = (tripId: string, reason: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      trip.status = "cancelled";
      trip.notes = (trip.notes || "") + ` | Cancelado: ${reason}`;
      trip.updatedAt = new Date().toISOString();
      alert(`Viaje ${trip.bookingId} cancelado exitosamente`);
    }
  };

  const contactParticipants = (trip: Trip) => {
    const participants = [trip.clientName];
    if (trip.driverName) participants.push(trip.driverName);
    alert(`Iniciando comunicación con: ${participants.join(", ")}`);
  };

  const generateTripReport = () => {
    alert("Generando reporte detallado de viajes...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-navy">Gestión de Viajes</h2>
              <p className="text-sm md:text-base text-gray-600">Supervisa y gestiona todos los viajes en tiempo real</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={generateTripReport} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <DownloadIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Generar Reporte</span>
                <span className="sm:hidden">Reporte</span>
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <RefreshCwIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Actualizar</span>
                <span className="sm:hidden">Actualizar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CarIcon className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EuroIcon className="w-8 h-8 text-ocean" />
              <div>
                <div className="text-2xl font-bold text-ocean">€{stats.revenue}</div>
                <div className="text-sm text-gray-600">Ingresos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar viajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="assigned">Asignados</SelectItem>
                  <SelectItem value="in_progress">En Curso</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="yesterday">Ayer</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-ocean" />
            Lista de Viajes ({filteredTrips.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                        <CarIcon className="w-6 h-6 text-ocean" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-navy">#{trip.bookingId}</h4>
                          {getStatusBadge(trip.status)}
                          {getPriorityBadge(trip.priority)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center">
                              <UsersIcon className="w-4 h-4 mr-2" />
                              {trip.clientName}
                            </p>
                            <p className="flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-2" />
                              {trip.origin} → {trip.destination}
                            </p>
                            <p className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {trip.date} a las {trip.time}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="flex items-center">
                              <CarIcon className="w-4 h-4 mr-2" />
                              {trip.vehicle} - {trip.passengers} pax - {trip.luggage} maletas
                            </p>
                            <p className="flex items-center">
                              <EuroIcon className="w-4 h-4 mr-2" />
                              €{trip.price} - {trip.distance}km - {trip.duration}min
                            </p>
                            {trip.driverName && (
                              <p className="flex items-center">
                                <CarIcon className="w-4 h-4 mr-2" />
                                Conductor: {trip.driverName}
                              </p>
                            )}
                          </div>
                        </div>
                        {trip.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                            <strong>Notas:</strong> {trip.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        setSelectedTrip(trip);
                        setShowTripModal(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    
                    {trip.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Asignar Conductor
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Asignar Conductor al Viaje #{trip.bookingId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="assign-notes">Notas de asignación</Label>
                              <Textarea
                                id="assign-notes"
                                value={assignNotes}
                                onChange={(e) => setAssignNotes(e.target.value)}
                                placeholder="Añade notas para el conductor..."
                                rows={3}
                              />
                            </div>
                            <Button
                              onClick={() => assignTrip(trip.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Confirmar Asignación
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      onClick={() => contactParticipants(trip)}
                      variant="outline"
                      size="sm"
                    >
                      <MessageSquareIcon className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>

                    {(trip.status === "pending" || trip.status === "assigned") && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancelar Viaje #{trip.bookingId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cancel-reason">Motivo de cancelación</Label>
                              <Textarea
                                id="cancel-reason"
                                placeholder="Explica el motivo de la cancelación..."
                                rows={3}
                              />
                            </div>
                            <Button
                              onClick={() => {
                                const reason = (document.getElementById("cancel-reason") as HTMLTextAreaElement)?.value;
                                if (reason) cancelTrip(trip.id, reason);
                              }}
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                              Confirmar Cancelación
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTrips.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No se encontraron viajes que coincidan con los filtros</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Modal */}
      <Dialog open={showTripModal} onOpenChange={setShowTripModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Viaje #{selectedTrip?.bookingId}</DialogTitle>
          </DialogHeader>

          {selectedTrip && (
            <div className="space-y-6">
              {/* Trip Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Información General
                    {getStatusBadge(selectedTrip.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Ruta</Label>
                        <p className="text-sm">{selectedTrip.origin} → {selectedTrip.destination}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Fecha y Hora</Label>
                        <p className="text-sm">{selectedTrip.date} a las {selectedTrip.time}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Distancia y Duraci��n</Label>
                        <p className="text-sm">{selectedTrip.distance}km - {selectedTrip.duration} minutos</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Pasajeros y Equipaje</Label>
                        <p className="text-sm">{selectedTrip.passengers} pasajeros - {selectedTrip.luggage} maletas</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Vehículo</Label>
                        <p className="text-sm">{selectedTrip.vehicle}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Precio</Label>
                        <p className="text-sm font-bold text-ocean">€{selectedTrip.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                      <p className="text-sm">{selectedTrip.clientName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                      <p className="text-sm">{selectedTrip.clientPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-sm">{selectedTrip.clientEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Information */}
              {selectedTrip.driverName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Conductor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                        <p className="text-sm">{selectedTrip.driverName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                        <p className="text-sm">{selectedTrip.driverPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {selectedTrip.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedTrip.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => contactParticipants(selectedTrip)}
                  className="bg-ocean hover:bg-ocean/90 flex-1"
                >
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Contactar Participantes
                </Button>
                <Button variant="outline" className="flex-1">
                  <EditIcon className="w-4 h-4 mr-2" />
                  Editar Viaje
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileTextIcon className="w-4 h-4 mr-2" />
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
