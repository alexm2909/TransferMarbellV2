import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CarIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  SmartphoneIcon,
  BanknoteIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon,
} from "lucide-react";

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

const paymentMethods = [
  {
    id: "card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCardIcon,
    popular: true,
    fees: "Sin comisiones",
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    description: "Pago rápido y seguro con Touch ID o Face ID",
    icon: SmartphoneIcon,
    popular: false,
    fees: "Sin comisiones",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    description: "Pago seguro con tu cuenta de Google",
    icon: SmartphoneIcon,
    popular: false,
    fees: "Sin comisiones",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Paga con tu cuenta PayPal",
    icon: BanknoteIcon,
    popular: false,
    fees: "Sin comisiones",
  },
  {
    id: "bank_transfer",
    name: "Transferencia Bancaria",
    description: "Pago directo desde tu cuenta bancaria",
    icon: BanknoteIcon,
    popular: false,
    fees: "Sin comisiones",
  },
];

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
      return;
    }

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
  }, [isAuthenticated, isLoading, navigate]);

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

  const handleContinueToPayment = () => {
    if (!bookingData || !selectedMethod) return;

    // Save selected payment method
    const updatedBookingData = {
      ...bookingData,
      selectedPaymentMethod: selectedMethod,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(updatedBookingData));
    
    // Redirect to appropriate payment page based on method
    switch (selectedMethod) {
      case "card":
        navigate("/payment-summary");
        break;
      case "apple_pay":
        navigate("/payment-apple");
        break;
      case "google_pay":
        navigate("/payment-google");
        break;
      case "paypal":
        navigate("/payment-paypal");
        break;
      case "bank_transfer":
        navigate("/payment-bank");
        break;
      default:
        navigate("/payment-summary");
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
            to="/book"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Formulario
          </Link>
          <h1 className="text-3xl font-bold text-navy">
            Método de Pago
          </h1>
          <p className="text-gray-600 mt-2">
            Selecciona cómo quieres realizar el pago de tu traslado
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Métodos de Pago Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-ocean/50 ${
                        selectedMethod === method.id 
                          ? "border-ocean bg-ocean-light/10" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}>
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem 
                            value={method.id} 
                            id={method.id}
                            className="text-ocean border-ocean"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              selectedMethod === method.id ? "bg-ocean text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              <method.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={method.id} className="font-medium text-gray-900 cursor-pointer">
                                  {method.name}
                                </Label>
                                {method.popular && (
                                  <Badge className="bg-coral/10 text-coral text-xs">
                                    Más Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                              <p className="text-xs text-green-600 mt-1">{method.fees}</p>
                            </div>
                            {selectedMethod === method.id && (
                              <CheckIcon className="w-5 h-5 text-ocean" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Pago Seguro</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Todos los pagos están encriptados y procesados de forma segura. 
                        Nunca almacenamos los datos de tu tarjeta.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-ocean" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-1">Ruta</div>
                    <div className="text-gray-600">{bookingData.origin} → {bookingData.destination}</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-1">Fecha y Hora</div>
                    <div className="text-gray-600">{bookingData.date} a las {bookingData.time}</div>
                  </div>

                  <Separator />

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

                <div className="text-xs text-gray-500 text-center">
                  Precios incluyen IVA
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-3 h-12"
                >
                  <div className="flex items-center gap-2">
                    <span>Continuar al Pago</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Al continuar aceptas nuestros términos y condiciones
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
