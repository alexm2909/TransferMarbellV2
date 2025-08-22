import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BanknoteIcon, ArrowLeftIcon, CopyIcon } from "lucide-react";

export default function PaymentBank() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const bankDetails = {
    bank: "Banco Santander",
    iban: "ES91 2100 0418 4502 0005 1332",
    bic: "CAIXESBBXXX",
    account: "Transfermarbell S.L.",
    reference: "TM" + Date.now().toString().slice(-6)
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copiado",
      description: "Información copiada al portapapeles.",
      duration: 2000,
    });
  };

  const handleBankTransferComplete = () => {
    // In a real implementation, this would be pending until transfer is confirmed
    toast({
      title: "✅ Instrucciones Enviadas",
      description: "Instrucciones de transferencia proporcionadas. Una vez realizada la transferencia, tu reserva será confirmada.",
      duration: 5000,
    });
    navigate("/payment-success?type=bank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <BanknoteIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Transferencia Bancaria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Realiza una transferencia bancaria con los siguientes datos:
            </p>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Banco:</span>
              <span>{bankDetails.bank}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">IBAN:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{bankDetails.iban}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.iban)}
                >
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">BIC:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{bankDetails.bic}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.bic)}
                >
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Beneficiario:</span>
              <span>{bankDetails.account}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Referencia:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-ocean">{bankDetails.reference}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.reference)}
                >
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Importante:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Incluye la referencia en el concepto de la transferencia</li>
              <li>• La confirmación puede tardar 1-2 días laborables</li>
              <li>• Recibirás un email cuando se confirme el pago</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleBankTransferComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <BanknoteIcon className="w-4 h-4 mr-2" />
              He Realizado la Transferencia
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
        </CardContent>
      </Card>
    </div>
  );
}
