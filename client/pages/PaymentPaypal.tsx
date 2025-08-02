import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BanknoteIcon, ArrowLeftIcon } from "lucide-react";

export default function PaymentPaypal() {
  const navigate = useNavigate();

  const handlePaypalPayment = () => {
    // For demo purposes, simulate PayPal and redirect to success
    // In a real implementation, you would integrate with PayPal SDK
    alert("PayPal no está disponible en modo demo. Redirigiendo a pago con tarjeta...");
    navigate("/payment-summary");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <BanknoteIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Pago con PayPal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Serás redirigido a PayPal para completar tu pago de forma segura.
            </p>
            <p className="text-sm text-yellow-600 mb-4">
              Función disponible próximamente en producción.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handlePaypalPayment}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <BanknoteIcon className="w-4 h-4 mr-2" />
              Continuar con PayPal
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
            PayPal es una marca registrada de PayPal, Inc.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
