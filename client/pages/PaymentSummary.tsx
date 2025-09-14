import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";
import {
  CarIcon,
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  LuggageIcon,
  BabyIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckIcon,
  RepeatIcon,
} from "lucide-react";

// Stripe test public key
const stripePromise = loadStripe("pk_test_51234567890abcdef_test_1234567890abcdef1234567890abcdef1234567890");

interface BookingData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  children: string;
  luggage: string;
  vehicleType: string;
  flightNumber: string;
  specialRequests: string;
  paymentPreference: string;
  selectedPaymentMethod?: string;
  hasReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
  childSeats: Array<{
    childIndex: number;
    age: number;
    seatType: string;
    description: string;
    price: number;
  }>;
  timestamp: string;
}

export default function PaymentSummary() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (!pendingBooking) {
      navigate("/book");
      return;
    }

    try {
      const parsed = JSON.parse(pendingBooking);
      setBookingData(parsed);
    } catch (error) {
      console.error("Error parsing booking data:", error);
      navigate("/book");
    }
  }, [navigate]);

  const getVehicleDetails = (type: string) => {
    const vehicles = {
      economy: { name: "Economy", basePrice: 25 },
      comfort: { name: "Comfort", basePrice: 35 },
      premium: { name: "Premium", basePrice: 50 },
      van: { name: "Van", basePrice: 65 },
      luxury: { name: "Luxury", basePrice: 80 },
    };
    return vehicles[type as keyof typeof vehicles] || vehicles.economy;
  };

  const calculateCosts = () => {
    if (!bookingData) return { subtotal: 0, childSeats: 0, returnTrip: 0, total: 0 };

    const vehicle = getVehicleDetails(bookingData.vehicleType);
    const basePrice = vehicle.basePrice;
    const childSeatsPrice = bookingData.childSeats?.reduce((total, seat) => total + seat.price, 0) || 0;
    const returnTripPrice = bookingData.hasReturnTrip ? basePrice : 0;
    
    const subtotal = basePrice;
    const total = subtotal + childSeatsPrice + returnTripPrice;

    return {
      subtotal,
      childSeats: childSeatsPrice,
      returnTrip: returnTripPrice,
      total,
    };
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing with Stripe
      const costs = calculateCosts();
      
      // In a real app, you would create a payment intent on your backend
      // For demo purposes, we'll simulate different payment scenarios
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different payment outcomes based on amount
      const shouldSucceed = Math.random() > 0.1; // 90% success rate for demo
      
      if (shouldSucceed) {
        // Generate booking ID
        const bookingId = "TM" + Date.now().toString().slice(-6);
        
        // Save successful booking
        const successfulBooking = {
          ...bookingData,
          bookingId,
          paymentStatus: "completed",
          paymentAmount: costs.total,
          paymentMethod: "card",
          confirmedAt: new Date().toISOString(),
        };
        
        localStorage.setItem("completedBooking", JSON.stringify(successfulBooking));
        localStorage.removeItem("pendingBooking");
        
        navigate(`/payment-success?id=${bookingId}`);
      } else {
        // Simulate payment failure
        navigate("/payment-error");
      }
    } catch (error) {
      console.error("Payment error:", error);
      navigate("/payment-error");
    } finally {
      setIsProcessingPayment(false);
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              No hay datos de reserva
            </h2>
            <p className="text-gray-600 mb-6">
              No se encontraron datos de reserva pendientes.
            </p>
            <Link to="/book">
              <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                Nueva Reserva
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const costs = calculateCosts();
  const vehicle = getVehicleDetails(bookingData.vehicleType);

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
              <Link to="/mi-reserva">
                <Button variant="outline">Mi reserva</Button>
              </Link>
              <Link to="/book">
                <Button className="bg-ocean text-white">Reservar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/payment-method"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Cambiar Método de Pago
          </Link>
          <h1 className="text-3xl font-bold text-navy">
            Resumen y Pago
          </h1>
          <p className="text-gray-600 mt-2">
            Revisa los detalles de tu reserva y completa el pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
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
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Origen</div>
                      <div className="text-sm text-gray-600">{bookingData.origin}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {bookingData.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {bookingData.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Destino</div>
                      <div className="text-sm text-gray-600">{bookingData.destination}</div>
                    </div>
                  </div>
                </div>

                {bookingData.hasReturnTrip && (
                  <div className="p-4 bg-ocean-light/10 border border-ocean/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <RepeatIcon className="w-4 h-4 text-ocean" />
                      <span className="font-medium text-ocean">Viaje de Vuelta</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {bookingData.returnDate} a las {bookingData.returnTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-ocean" />
                  Pasajeros y Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-ocean mx-auto mb-1" />
                    <div className="font-medium">{bookingData.passengers}</div>
                    <div className="text-xs text-gray-600">Adultos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BabyIcon className="w-6 h-6 text-coral mx-auto mb-1" />
                    <div className="font-medium">{bookingData.children}</div>
                    <div className="text-xs text-gray-600">Niños</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <LuggageIcon className="w-6 h-6 text-navy mx-auto mb-1" />
                    <div className="font-medium">{bookingData.luggage}</div>
                    <div className="text-xs text-gray-600">Maletas</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Vehículo:</span>
                  <span className="text-gray-600">{vehicle.name}</span>
                </div>

                {bookingData.flightNumber && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">Vuelo:</span>
                    <span className="text-gray-600">{bookingData.flightNumber}</span>
                  </div>
                )}

                {bookingData.childSeats && bookingData.childSeats.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-sm mb-2">Sillas Infantiles:</div>
                    {bookingData.childSeats.map((seat, index) => (
                      <div key={index} className="text-xs text-gray-600 flex justify-between">
                        <span>{seat.description}</span>
                        <span>€{seat.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {bookingData.specialRequests && (
                  <div className="mt-4 p-3 bg-ocean-light/20 border border-ocean/30 rounded-lg">
                    <div className="font-medium text-sm mb-1">Solicitudes Especiales:</div>
                    <div className="text-xs text-gray-600">{bookingData.specialRequests}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Resumen de Costes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Viaje principal</span>
                    <span className="font-medium">€{costs.subtotal}</span>
                  </div>
                  
                  {costs.childSeats > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sillas infantiles</span>
                      <span className="font-medium">€{costs.childSeats}</span>
                    </div>
                  )}
                  
                  {costs.returnTrip > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Viaje de vuelta</span>
                      <span className="font-medium">€{costs.returnTrip}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-ocean">€{costs.total}</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500 text-center">
                    Precios incluyen IVA
                  </div>
                  {bookingData.selectedPaymentMethod && (
                    <div className="text-xs text-center p-2 bg-ocean-light/10 rounded border border-ocean/20">
                      <span className="text-ocean font-medium">
                        Método: {
                          bookingData.selectedPaymentMethod === "card" ? "Tarjeta" :
                          bookingData.selectedPaymentMethod === "apple_pay" ? "Apple Pay" :
                          bookingData.selectedPaymentMethod === "google_pay" ? "Google Pay" :
                          bookingData.selectedPaymentMethod === "paypal" ? "PayPal" :
                          bookingData.selectedPaymentMethod === "bank_transfer" ? "Transferencia" :
                          "Tarjeta"
                        }
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-3 h-12"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-4 h-4" />
                      Pagar €{costs.total}
                    </div>
                  )}
                </Button>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2 justify-center">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <span>Pago seguro con Stripe (Test Mode)</span>
                  </div>
                  <div className="text-center">
                    <div>Datos de prueba:</div>
                    <div className="font-mono">4242 4242 4242 4242</div>
                    <div>Fecha: cualquier futura, CVC: 123</div>
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
