import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarIcon, SmartphoneIcon, ArrowLeftIcon } from "lucide-react";

export default function PaymentGoogle() {
  const navigate = useNavigate();

  const handleGooglePayment = () => {
    // For demo purposes, simulate Google Pay and redirect to success
    // In a real implementation, you would integrate with Google Pay SDK
    alert("Google Pay no está disponible en modo demo. Redirigiendo a pago con tarjeta...");
    navigate("/payment-summary");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <SmartphoneIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Pago con Google Pay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Para usar Google Pay, necesitas tener configurado Google Pay en tu dispositivo Android o navegador compatible.
            </p>
            <p className="text-sm text-yellow-600 mb-4">
              Función disponible próximamente en producción.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleGooglePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <SmartphoneIcon className="w-4 h-4 mr-2" />
              Pagar con Google Pay
            </Button>
            
            <Button 
              onClick={() => navigate("/payment-method")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver a Métodos de Pago
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Google Pay es una marca registrada de Google LLC.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
