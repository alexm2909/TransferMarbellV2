import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  XCircleIcon,
  CreditCardIcon,
  RefreshCcwIcon,
  ArrowLeftIcon,
  PhoneIcon,
  MailIcon,
  AlertTriangleIcon,
} from "lucide-react";

export default function PaymentError() {
  const { user } = useAuth();

  const commonErrors = [
    {
      title: "Tarjeta Rechazada",
      description: "Tu banco ha rechazado la transacción",
      solution: "Verifica los datos de tu tarjeta o prueba con otra tarjeta",
    },
    {
      title: "Fondos Insuficientes",
      description: "No hay suficiente saldo en tu cuenta",
      solution: "Verifica tu saldo o usa otra forma de pago",
    },
    {
      title: "Error de Conexión",
      description: "Problema temporal de conectividad",
      solution: "Intenta nuevamente en unos minutos",
    },
    {
      title: "Datos Incorrectos",
      description: "Información de pago incompleta o incorrecta",
      solution: "Revisa todos los campos antes de continuar",
    },
  ];

  const handleRetryPayment = () => {
    // Return to payment summary to retry
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            Error en el Pago
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No se pudo procesar tu pago. Tu reserva no ha sido confirmada y no se ha realizado ningún cargo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Details */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangleIcon className="w-5 h-5" />
                  ¿Qué ha pasado?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-semibold text-red-800 mb-2">
                    El pago no pudo ser procesado
                  </div>
                  <div className="text-red-700 text-sm">
                    Esto puede deberse a varios motivos. No te preocupes, tu información está segura y no se ha realizado ningún cargo a tu tarjeta.
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Posibles causas:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonErrors.map((error, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {error.title}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {error.description}
                        </div>
                        <div className="text-xs text-ocean">
                          {error.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Mode Info */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm border-l-4 border-l-ocean">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean">
                  <CreditCardIcon className="w-5 h-5" />
                  Modo de Prueba - Stripe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-ocean-light/20 border border-ocean/30 rounded-lg">
                  <div className="font-semibold text-ocean mb-2">
                    Estás en modo de prueba
                  </div>
                  <div className="text-gray-700 text-sm mb-3">
                    Para simular diferentes escenarios de pago, puedes usar estas tarjetas de prueba:
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold">✅ Pago exitoso:</div>
                        <div>4242 4242 4242 4242</div>
                      </div>
                      <div>
                        <div className="font-semibold">❌ Tarjeta rechazada:</div>
                        <div>4000 0000 0000 0002</div>
                      </div>
                      <div>
                        <div className="font-semibold">💳 Fondos insuficientes:</div>
                        <div>4000 0000 0000 9995</div>
                      </div>
                      <div>
                        <div className="font-semibold">🔐 Requiere 3D Secure:</div>
                        <div>4000 0027 6000 3184</div>
                      </div>
                    </div>
                    <div className="text-gray-600 mt-2">
                      Fecha: cualquier futura, CVC: cualquier 3 dígitos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>¿Qué hacer ahora?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90"
                >
                  <RefreshCcwIcon className="w-4 h-4 mr-2" />
                  Intentar de Nuevo
                </Button>
                
                <Link to="/payment-summary" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Volver al Pago
                  </Button>
                </Link>

                <Link to="/book" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Modificar Reserva
                  </Button>
                </Link>

                <Link to="/" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Volver al Inicio
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  Si continúas teniendo problemas, nuestro equipo está aquí para ayudarte.
                </div>

                <Button variant="outline" className="w-full justify-start h-auto py-3 px-3">
                  <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div className="text-left overflow-hidden">
                    <div className="text-sm font-medium">Llamar</div>
                    <div className="text-xs text-gray-600 truncate">+34 952 123 456</div>
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-3 px-3">
                  <MailIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div className="text-left overflow-hidden">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-xs text-gray-600 truncate">soporte@transfermarbell.com</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Security Note */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-700">Información Segura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>No se ha realizado ningún cargo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Tus datos están seguros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Puedes intentar de nuevo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Tu reserva se mantiene guardada</span>
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
