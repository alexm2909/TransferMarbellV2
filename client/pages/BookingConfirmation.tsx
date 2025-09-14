import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CarIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  PlaneIcon,
  PhoneIcon,
  MailIcon,
  DownloadIcon,
  ShareIcon,
  MessageSquareIcon,
  StarIcon,
  CreditCardIcon,
  BabyIcon,
} from "lucide-react";

interface BookingDetails {
  bookingId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  children: number;
  luggage: number;
  vehicleType: string;
  flightNumber?: string;
  totalPrice: number;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  childSeats: Array<{
    type: string;
    price: number;
  }>;
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load pending booking from localStorage first
    const pending = localStorage.getItem('pendingBooking');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        const bookingId = parsed.id;
        const booking = (window as any).database?.getBookingById ? (window as any).database.getBookingById(bookingId) : null;
        // If app's database service is available import it
        // Fallback: try to import database module
        if (!booking) {
          // try dynamic import
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const db = require('@/services/database');
            const b = db.database.getBookingById(bookingId);
            if (b) {
              setBookingDetails({
                bookingId: b.id,
                origin: b.tripDetails.origin.address,
                destination: b.tripDetails.destination.address,
                date: b.tripDetails.date,
                time: b.tripDetails.time,
                passengers: b.tripDetails.passengers,
                children: b.tripDetails.children?.count || 0,
                luggage: (b.tripDetails.luggage?.large || 0),
                vehicleType: b.vehicleType || '',
                flightNumber: b.tripDetails.flightNumber || '',
                totalPrice: b.pricing.totalPrice || 0,
                driverName: (b.driverId && (db.database.getUserById(b.driverId)?.name)) || 'Sin asignar',
                driverPhone: (b.driverId && db.database.getUserById(b.driverId)?.phone) || '',
                vehiclePlate: '',
                childSeats: [],
              });
              setIsLoading(false);
              return;
            }
          } catch (err) {
            // ignore
          }
        } else {
          setBookingDetails({
            bookingId: booking.id,
            origin: booking.tripDetails.origin.address,
            destination: booking.tripDetails.destination.address,
            date: booking.tripDetails.date,
            time: booking.tripDetails.time,
            passengers: booking.tripDetails.passengers,
            children: booking.tripDetails.children?.count || 0,
            luggage: (booking.tripDetails.luggage?.large || 0),
            vehicleType: booking.vehicleType || '',
            flightNumber: booking.tripDetails.flightNumber || '',
            totalPrice: booking.pricing.totalPrice || 0,
            driverName: 'Sin asignar',
            driverPhone: '',
            vehiclePlate: '',
            childSeats: [],
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // fallback to simulated data below
      }
    }

    // If no pending booking available, show simulated booking
    const bookingIdSim = searchParams.get("id") || ("TM" + Date.now().toString().slice(-6));
    setTimeout(() => {
      setBookingDetails({
        bookingId: bookingIdSim,
        origin: "Málaga Airport (AGP)",
        destination: "Hotel Majestic - Paseo de Sancha, Málaga",
        date: "2024-12-28",
        time: "14:30",
        passengers: 2,
        children: 1,
        luggage: 2,
        vehicleType: "Premium",
        flightNumber: "IB3245",
        totalPrice: 65,
        driverName: "Carlos Rodríguez",
        driverPhone: "+34 600 123 456",
        vehiclePlate: "1234 ABC",
        childSeats: [
          { type: "Grupo I (1-4 años)", price: 12 }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [navigate, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ocean border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Confirmando tu reserva...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">⚠���</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Reserva no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              No pudimos encontrar los detalles de tu reserva.
            </p>
            <Link to="/">
              <Button>Ir al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareBooking = () => {
    const shareText = `Mi traslado con Transfermarbell está confirmado!\n\nReserva: ${bookingDetails.bookingId}\nFecha: ${formatDate(bookingDetails.date)} a las ${bookingDetails.time}\nConductor: ${bookingDetails.driverName}\n\n¡Nos vemos pronto!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Reserva Confirmada - Transfermarbell',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Detalles copiados al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white border-b">
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
              <Link to="/mi-reserva">
                <Button variant="outline">Mi reserva</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            ��Reserva Confirmada!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu traslado ha sido reservado exitosamente. Hemos enviado los detalles 
            a tu email y SMS.
          </p>
          <div className="mt-4">
            <Badge className="bg-success text-white text-lg px-4 py-2">
              Reserva #{bookingDetails.bookingId}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-ocean" />
                  Detalles del Viaje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Origen</div>
                        <div className="text-sm text-gray-600">{bookingDetails.origin}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Destino</div>
                        <div className="text-sm text-gray-600">{bookingDetails.destination}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-5 h-5 text-ocean" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Fecha</div>
                        <div className="text-sm text-gray-600">{formatDate(bookingDetails.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-ocean" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Hora</div>
                        <div className="text-sm text-gray-600">{bookingDetails.time}</div>
                      </div>
                    </div>
                    {bookingDetails.flightNumber && (
                      <div className="flex items-center space-x-3">
                        <PlaneIcon className="w-5 h-5 text-ocean" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Vuelo</div>
                          <div className="text-sm text-gray-600">{bookingDetails.flightNumber}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <UsersIcon className="w-6 h-6 text-ocean mx-auto mb-1" />
                    <div className="text-sm font-medium">{bookingDetails.passengers} Adultos</div>
                    {bookingDetails.children > 0 && (
                      <div className="text-xs text-gray-500">{bookingDetails.children} Niños</div>
                    )}
                  </div>
                  <div className="text-center">
                    <LuggageIcon className="w-6 h-6 text-ocean mx-auto mb-1" />
                    <div className="text-sm font-medium">{bookingDetails.luggage} Maletas</div>
                  </div>
                  <div className="text-center">
                    <CarIcon className="w-6 h-6 text-ocean mx-auto mb-1" />
                    <div className="text-sm font-medium">{bookingDetails.vehicleType}</div>
                  </div>
                </div>

                {/* Child Seats */}
                {bookingDetails.childSeats.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BabyIcon className="w-4 h-4 text-ocean" />
                      Sillas Infantiles
                    </h4>
                    <div className="space-y-1">
                      {bookingDetails.childSeats.map((seat, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{seat.type}</span>
                          <span className="font-medium">+���{seat.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-ocean" />
                  Tu Conductor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-ocean">
                      {bookingDetails.driverName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">{bookingDetails.driverName}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>4.9 • 234 viajes</span>
                    </div>
                    <div className="text-sm text-gray-600">Matrícula: {bookingDetails.vehiclePlate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 border-ocean text-ocean hover:bg-ocean hover:text-white"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Llamar: {bookingDetails.driverPhone}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageSquareIcon className="w-4 h-4" />
                    Enviar Mensaje
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-ocean-light/20 rounded-lg border border-ocean/30">
                  <div className="flex items-start space-x-2">
                    <div className="text-ocean">💡</div>
                    <div className="text-sm text-gray-700">
                      <strong>Consejo:</strong> Tu conductor te contactará 30 minutos antes 
                      de la hora de recogida para confirmar la ubicación exacta.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Resumen de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Traslado base</span>
                  <span>€{bookingDetails.totalPrice - bookingDetails.childSeats.reduce((sum, seat) => sum + seat.price, 0)}</span>
                </div>
                {bookingDetails.childSeats.map((seat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">Silla infantil</span>
                    <span>€{seat.price}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Pagado</span>
                    <span className="text-ocean">€{bookingDetails.totalPrice}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Pagado con tarjeta terminada en •••• 4532
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={shareBooking}
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Compartir Reserva
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MailIcon className="w-4 h-4 mr-2" />
                  Reenviar Email
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Pr��ximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-ocean rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Confirmación automática</div>
                      <div className="text-gray-600">Recibirás un SMS y email con los detalles</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">24h antes del viaje</div>
                      <div className="text-gray-600">Te enviaremos un recordatorio</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">30 min antes</div>
                      <div className="text-gray-600">Tu conductor te contactará</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button
                size="lg"
                className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90"
              >
                Reservar Otro Traslado
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Ir al Inicio
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta nuestro soporte 24/7 en{" "}
            <a href="tel:+34952123456" className="text-ocean hover:underline">
              +34 952 123 456
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
