import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarIcon, SmartphoneIcon, ArrowLeftIcon } from "lucide-react";

export default function PaymentApple() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Apple Pay is available
    const isApplePayAvailable = window.ApplePaySession && ApplePaySession.canMakePayments();
    
    if (!isApplePayAvailable) {
      // Redirect back to payment method selection if Apple Pay is not available
      setTimeout(() => {
        navigate("/payment-method");
      }, 3000);
    }
  }, [navigate]);

  const handleApplePayment = () => {
    // For demo purposes, simulate Apple Pay and redirect to success
    // In a real implementation, you would integrate with Apple Pay SDK
    alert("Apple Pay no está disponible en modo demo. Redirigiendo a pago con tarjeta...");
    navigate("/payment-summary");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <SmartphoneIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Pago con Apple Pay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Para usar Apple Pay, necesitas un dispositivo compatible y tener configurado Apple Pay en tu dispositivo.
            </p>
            <p className="text-sm text-yellow-600 mb-4">
              Función disponible próximamente en producción.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleApplePayment}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              <SmartphoneIcon className="w-4 h-4 mr-2" />
              Pagar con Apple Pay
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
            Apple Pay es una marca registrada de Apple Inc.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
