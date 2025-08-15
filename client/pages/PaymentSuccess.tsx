import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import VoucherSystem, { useVoucher } from "@/components/VoucherSystem";
import { useBookings } from "@/hooks/useDatabase";
import { database } from "@/services/database";
import {
  CarIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  CreditCardIcon,
  DownloadIcon,
  ShareIcon,
  MessageSquareIcon,
  HomeIcon,
  TicketIcon,
} from "lucide-react";

interface CompletedBooking {
  bookingId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  children: string;
  luggage: string;
  vehicleType: string;
  flightNumber: string;
  hasReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
  paymentAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  confirmedAt: string;
  childSeats: Array<{
    childIndex: number;
    age: number;
    seatType: string;
    description: string;
    price: number;
  }>;
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [booking, setBooking] = useState<CompletedBooking | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const { generateVoucher, addVoucher } = useVoucher();
  const [generatedVoucher, setGeneratedVoucher] = useState<any>(null);
  const bookingId = searchParams.get("id");
  const { updateBooking } = useBookings();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (!bookingId) {
      navigate("/");
      return;
    }

    const completedBooking = localStorage.getItem("completedBooking");
    if (!completedBooking) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(completedBooking);
      if (parsed.bookingId === bookingId) {
        setBooking(parsed);

        // Update booking status in database to completed
        updateBooking(bookingId, {
          status: "completed",
          payment: {
            status: "completed",
            transactionId: `TXN_${Date.now()}`,
            paidAt: new Date().toISOString()
          },
          timeline: {
            createdAt: parsed.timestamp || new Date().toISOString(),
            completedAt: new Date().toISOString()
          }
        });

        // Generate voucher for the booking
        const voucher = generateVoucher({
          date: parsed.date,
          time: parsed.time,
          origin: parsed.origin,
          destination: parsed.destination,
          passengers: parsed.passengers,
          children: parsed.children,
          luggage: parsed.luggage,
          vehicleType: parsed.vehicleType,
          estimatedPrice: `€${parsed.paymentAmount}`,
          specialRequests: parsed.specialRequests || "",
        });

        addVoucher(voucher);
        setGeneratedVoucher(voucher);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error parsing booking data:", error);
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate, bookingId, updateBooking]);

  const handleShowVoucher = useCallback(() => {
    if (generatedVoucher) {
      setShowVoucher(true);
    }
  }, [generatedVoucher]);

  const getVehicleDetails = (type: string) => {
    const vehicles = {
      economy: { name: "Economy", description: "Comfortable sedan" },
      comfort: { name: "Comfort", description: "Premium comfort vehicle" },
      premium: { name: "Premium", description: "Luxury sedan" },
      van: { name: "Van", description: "Spacious family van" },
      luxury: { name: "Luxury", description: "Ultimate luxury experience" },
    };
    return vehicles[type as keyof typeof vehicles] || vehicles.economy;
  };

  const handleDownloadReceipt = () => {
    if (!booking) return;

    // Create a comprehensive receipt content
    const receiptContent = `
TRANSFERMARBELL - RECIBO DE RESERVA
====================================

Número de Reserva: ${booking.bookingId}
Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}
Cliente: ${user?.name || 'Cliente'}
Email: ${user?.email || ''}

DETALLES DEL VIAJE
------------------
Origen: ${booking.origin}
Destino: ${booking.destination}
Fecha: ${booking.date}
Hora: ${booking.time}

${booking.hasReturnTrip ? `VIAJE DE VUELTA
------------------
Fecha de vuelta: ${booking.returnDate}
Hora de vuelta: ${booking.returnTime}
` : ''}

PASAJEROS
---------
Adultos: ${booking.passengers}
Niños: ${booking.children}
Maletas: ${booking.luggage}

VEHÍCULO
--------
Tipo: ${getVehicleDetails(booking.vehicleType).name}
Descripción: ${getVehicleDetails(booking.vehicleType).description}

${booking.flightNumber ? `Número de vuelo: ${booking.flightNumber}` : ''}

${booking.childSeats && booking.childSeats.length > 0 ? `
SILLAS INFANTILES
-----------------
${booking.childSeats.map(seat => `- ${seat.description}: €${seat.price}`).join('\n')}
` : ''}

RESUMEN ECONÓMICO
-----------------
Total Pagado: €${booking.paymentAmount}
Método de Pago: ${booking.paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Efectivo'}
Estado: ${booking.paymentStatus === 'completed' ? 'Completado' : 'Pendiente'}

INFORMACIÓN DE CONTACTO
-----------------------
Transfermarbell
Teléfono: +34 952 123 456
Email: info@transfermarbell.com
Web: www.transfermarbell.com

¡Gracias por confiar en Transfermarbell!
    `;

    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_Transfermarbell_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareBooking = () => {
    if (!booking) return;

    const shareData = {
      title: `Reserva Transfermarbell #${booking.bookingId}`,
      text: `Mi reserva de transfer desde ${booking.origin} hasta ${booking.destination} el ${booking.date} a las ${booking.time}. Total: €${booking.paymentAmount}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }

    function fallbackShare() {
      const textToShare = `${shareData.title}\n\n${shareData.text}\n\nVer detalles: ${shareData.url}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToShare).then(() => {
          alert("📋 Detalles de la reserva copiados al portapapeles");
        }).catch(() => {
          // If clipboard fails, show the text in a modal or alert
          prompt("Copia este texto para compartir tu reserva:", textToShare);
        });
      } else {
        // Fallback for older browsers
        prompt("Copia este texto para compartir tu reserva:", textToShare);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Reserva no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              No se pudo encontrar la información de la reserva.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                Ir al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = getVehicleDetails(booking.vehicleType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            ¡Pago Completado!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu reserva ha sido confirmada exitosamente. Recibirás un email de confirmación en breve.
          </p>
          <div className="mt-6">
            <Badge className="bg-ocean text-white text-lg px-4 py-2">
              Reserva #{booking.bookingId}
            </Badge>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Information */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-ocean" />
                  Información del Viaje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-green-800">Origen</div>
                      <div className="text-green-700">{booking.origin}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-red-800">Destino</div>
                      <div className="text-red-700">{booking.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-ocean-light/20 rounded-lg">
                    <CalendarIcon className="w-4 h-4 text-ocean" />
                    <div>
                      <div className="font-medium">Fecha</div>
                      <div className="text-sm text-gray-600">{booking.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-ocean-light/20 rounded-lg">
                    <ClockIcon className="w-4 h-4 text-ocean" />
                    <div>
                      <div className="font-medium">Hora</div>
                      <div className="text-sm text-gray-600">{booking.time}</div>
                    </div>
                  </div>
                </div>

                {booking.hasReturnTrip && (
                  <div className="p-4 bg-coral-light/20 border border-coral/30 rounded-lg">
                    <div className="font-semibold text-coral mb-2">Viaje de Vuelta</div>
                    <div className="text-sm text-gray-700">
                      {booking.returnDate} a las {booking.returnTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-ocean" />
                  Detalles del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-ocean-light/20 rounded-lg">
                    <UsersIcon className="w-8 h-8 text-ocean mx-auto mb-2" />
                    <div className="font-bold text-lg">{booking.passengers}</div>
                    <div className="text-sm text-gray-600">Adultos</div>
                  </div>
                  <div className="text-center p-4 bg-coral-light/20 rounded-lg">
                    <div className="text-2xl mb-2">👶</div>
                    <div className="font-bold text-lg">{booking.children}</div>
                    <div className="text-sm text-gray-600">Niños</div>
                  </div>
                  <div className="text-center p-4 bg-navy/10 rounded-lg">
                    <LuggageIcon className="w-8 h-8 text-navy mx-auto mb-2" />
                    <div className="font-bold text-lg">{booking.luggage}</div>
                    <div className="text-sm text-gray-600">Maletas</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Vehículo:</span>
                    <span className="text-gray-600">{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Descripción:</span>
                    <span className="text-gray-600">{vehicle.description}</span>
                  </div>
                  {booking.flightNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium">Número de vuelo:</span>
                      <span className="text-gray-600">{booking.flightNumber}</span>
                    </div>
                  )}
                </div>

                {booking.childSeats && booking.childSeats.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium mb-2">Sillas Infantiles Incluidas:</div>
                    <div className="space-y-1">
                      {booking.childSeats.map((seat, index) => (
                        <div key={index} className="text-sm flex justify-between">
                          <span>{seat.description}</span>
                          <span className="font-medium">�����{seat.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voucher Section */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TicketIcon className="w-5 h-5 text-purple" />
                  Voucher de Viaje (Obligatorio)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple/10 to-ocean/10 border border-purple/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple to-ocean rounded-lg flex items-center justify-center">
                      <TicketIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Voucher Generado</div>
                      <div className="text-sm text-gray-600">
                        Referencia: <span className="font-mono font-medium">{generatedVoucher?.bookingRef || booking.bookingId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Válido hasta:</span>
                      <span className="font-medium">{booking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ruta:</span>
                      <span className="font-medium text-right text-xs">{booking.origin.split(',')[0]} → {booking.destination.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleShowVoucher}
                    className="w-full bg-gradient-to-r from-purple to-ocean hover:from-purple/90 hover:to-ocean/90 text-white"
                    disabled={!generatedVoucher}
                  >
                    <TicketIcon className="w-4 h-4 mr-2" />
                    Ver Voucher Completo
                  </Button>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 mb-1">Importante</p>
                        <p className="text-amber-700">
                          Debes presentar este voucher al conductor para ser recogido. Es obligatorio para el servicio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Actions */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Resumen de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    €{booking.paymentAmount}
                  </div>
                  <div className="text-sm text-green-700">Pagado exitosamente</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-medium">Tarjeta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <Badge className="bg-green-600 text-white">Completado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Procesado:</span>
                    <span className="font-medium">
                      {new Date(booking.confirmedAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="w-full justify-start border-ocean text-ocean hover:bg-ocean hover:text-white"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Descargar Recibo
                </Button>
                <Button
                  onClick={handleShareBooking}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Compartir Reserva
                </Button>
                <Link to="/chat" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    Chat con Conductor
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Volver al Inicio
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-ocean rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Confirmación por email</div>
                      <div className="text-gray-600">Recibirás todos los detalles en tu correo</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-ocean rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Contacto del conductor</div>
                      <div className="text-gray-600">Te contactaremos 24h antes del viaje</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-ocean rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Día del viaje</div>
                      <div className="text-gray-600">Tu conductor estará esperándote</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {generatedVoucher && (
        <VoucherSystem
          voucher={generatedVoucher}
          showModal={showVoucher}
          onClose={() => setShowVoucher(false)}
        />
      )}
    </div>
  );
}
