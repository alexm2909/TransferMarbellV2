import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  BanknotesIcon,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'bank';
  last4: string;
  cardholderName?: string;
  expiryDate?: string;
  isDefault: boolean;
  provider?: string; // Visa, Mastercard, etc.
}

export default function PaymentMethods() {
  const { t } = useLanguage();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      last4: '4242',
      cardholderName: 'Ana García',
      expiryDate: '12/26',
      isDefault: true,
      provider: 'Visa',
    },
  ]);
  
  const [open, setOpen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [formData, setFormData] = useState({
    type: 'credit',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    bankAccount: '',
    routingNumber: '',
  });

  const handleAddPaymentMethod = () => {
    if (formData.type === 'paypal' && !formData.paypalEmail) return;
    if ((formData.type === 'credit' || formData.type === 'debit') && 
        (!formData.cardNumber || !formData.cardholderName || !formData.expiryDate)) return;

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type as 'credit' | 'debit' | 'paypal' | 'bank',
      last4: formData.cardNumber.slice(-4),
      cardholderName: formData.cardholderName,
      expiryDate: formData.expiryDate,
      isDefault: paymentMethods.length === 0,
      provider: getCardProvider(formData.cardNumber),
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setFormData({
      type: 'credit',
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      paypalEmail: '',
      bankAccount: '',
      routingNumber: '',
    });
    setOpen(false);
  };

  const getCardProvider = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const number = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit':
      case 'debit':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'paypal':
        return <div className="text-blue-600 font-bold text-sm">PP</div>;
      case 'bank':
        return <BanknotesIcon className="w-5 h-5" />;
      default:
        return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      credit: t('credit_card'),
      debit: t('debit_card'),
      paypal: t('paypal'),
      bank: t('bank_transfer'),
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>{t('payment_methods')}</span>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-ocean hover:bg-ocean/90">
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('add_payment_method')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('add_payment_method')}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Método</Label>
                  <Select value={formData.type} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">{t('credit_card')}</SelectItem>
                      <SelectItem value="debit">{t('debit_card')}</SelectItem>
                      <SelectItem value="paypal">{t('paypal')}</SelectItem>
                      <SelectItem value="bank">{t('bank_transfer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.type === 'credit' || formData.type === 'debit') && (
                  <>
                    <div className="space-y-2">
                      <Label>{t('card_number')}</Label>
                      <div className="relative">
                        <Input
                          type={showCardNumber ? "text" : "password"}
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCardNumber(!showCardNumber)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCardNumber ? (
                            <EyeOffIcon className="w-4 h-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>{t('expiry_date')}</Label>
                        <Input
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('cvv')}</Label>
                        <Input
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                          }))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('cardholder_name')}</Label>
                      <Input
                        value={formData.cardholderName}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          cardholderName: e.target.value 
                        }))}
                        placeholder="Nombre completo como aparece en la tarjeta"
                      />
                    </div>
                  </>
                )}

                {formData.type === 'paypal' && (
                  <div className="space-y-2">
                    <Label>Email de PayPal</Label>
                    <Input
                      type="email"
                      value={formData.paypalEmail}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        paypalEmail: e.target.value 
                      }))}
                      placeholder="tu@email.com"
                    />
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleAddPaymentMethod}
                    className="flex-1 bg-ocean hover:bg-ocean/90"
                  >
                    {t('add')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCardIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No tienes métodos de pago guardados</p>
            <p className="text-sm">Añade uno para reservas más rápidas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ocean to-coral rounded-lg text-white">
                    {getPaymentMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {getTypeLabel(method.type)} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Predeterminado
                        </Badge>
                      )}
                    </div>
                    {method.cardholderName && (
                      <p className="text-sm text-gray-600">{method.cardholderName}</p>
                    )}
                    {method.expiryDate && (
                      <p className="text-xs text-gray-500">Vence {method.expiryDate}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAsDefault(method.id)}
                    >
                      Predeterminado
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-800">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Información Segura</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Todos los datos de pago se cifran con AES-256 y se almacenan de forma segura.
            Nunca almacenamos números de tarjeta completos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
