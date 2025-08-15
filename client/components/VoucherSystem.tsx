import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  QrCodeIcon,
  TicketIcon,
  DownloadIcon,
  ShareIcon,
  PrinterIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LuggageIcon,
  CarIcon,
} from "lucide-react";

interface VoucherData {
  id: string;
  bookingRef: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  passengers: number;
  children: number;
  luggage: number;
  vehicleType: string;
  driverName?: string;
  driverPhone?: string;
  price: string;
  status: "confirmed" | "pending" | "completed";
  qrCode: string;
  specialRequests?: string;
}

interface VoucherSystemProps {
  voucher: VoucherData;
  showModal?: boolean;
  onClose?: () => void;
}

export default function VoucherSystem({ voucher, showModal = false, onClose }: VoucherSystemProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const voucherRef = useRef<HTMLDivElement>(null);

  const generateQRCode = (text: string) => {
    // Simple QR code placeholder - in real implementation, use a QR library
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23000'/><rect x='10' y='10' width='10' height='10' fill='%23fff'/><rect x='30' y='10' width='10' height='10' fill='%23fff'/><rect x='50' y='10' width='10' height='10' fill='%23fff'/><rect x='70' y='10' width='10' height='10' fill='%23fff'/></svg>`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // In real implementation, generate PDF
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Generate voucher as image/PDF
      alert('Descargando voucher...');
    } catch (error) {
      console.error('Error downloading voucher:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSend = () => {
    const subject = `Voucher de Transfermarbell - ${voucher.bookingRef}`;
    const body = `
Tu voucher de transferencia está listo.

Detalles del viaje:
- Referencia: ${voucher.bookingRef}
- Fecha: ${voucher.date} a las ${voucher.time}
- Desde: ${voucher.origin}
- Hasta: ${voucher.destination}
- Pasajeros: ${voucher.passengers + voucher.children}
- Precio: ${voucher.price}

Presenta este voucher al conductor para ser recogido.
    `;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const VoucherContent = () => (
    <div
      ref={voucherRef}
      className="bg-white p-6 rounded-lg border shadow-lg max-w-md mx-auto print:shadow-none print:border-0"
    >
      {/* Header */}
      <div className="text-center mb-6 border-b pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mr-2">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
            Transfermarbell
          </h1>
        </div>
        <p className="text-sm text-gray-600">Voucher de Transferencia</p>
      </div>

      {/* Booking Reference */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {voucher.bookingRef}
        </div>
        <Badge 
          className={
            voucher.status === "confirmed" ? "bg-green-100 text-green-800" :
            voucher.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            "bg-blue-100 text-blue-800"
          }
        >
          {voucher.status === "confirmed" ? "Confirmado" :
           voucher.status === "pending" ? "Pendiente" : "Completado"}
        </Badge>
      </div>

      {/* Trip Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 text-ocean mr-3 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900">{voucher.date}</div>
            <div className="text-sm text-gray-600">{voucher.time}</div>
          </div>
        </div>

        <div className="flex items-start">
          <MapPinIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-1" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm break-words">
              {voucher.origin}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <MapPinIcon className="w-4 h-4 text-red-500 mr-3 flex-shrink-0 mt-1" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm break-words">
              {voucher.destination}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 text-coral mr-1" />
            <span className="font-medium">{voucher.passengers + voucher.children}</span>
          </div>
          <div className="flex items-center">
            <LuggageIcon className="w-4 h-4 text-navy mr-1" />
            <span className="font-medium">{voucher.luggage}</span>
          </div>
          <div className="flex items-center">
            <CarIcon className="w-4 h-4 text-purple mr-1" />
            <span className="font-medium text-xs">{voucher.vehicleType}</span>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      {voucher.driverName && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Conductor Asignado</h4>
          <div className="text-sm space-y-1">
            <div>{voucher.driverName}</div>
            {voucher.driverPhone && (
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="w-3 h-3 mr-1" />
                {voucher.driverPhone}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Special Requests */}
      {voucher.specialRequests && (
        <div className="bg-yellow-50 p-3 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-1">Solicitudes Especiales</h4>
          <p className="text-sm text-gray-700">{voucher.specialRequests}</p>
        </div>
      )}

      {/* QR Code */}
      <div className="text-center mb-4">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
          <QrCodeIcon className="w-16 h-16 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500">
          Presenta este código al conductor
        </p>
      </div>

      {/* Price */}
      <div className="text-center border-t pt-4">
        <div className="text-2xl font-bold text-ocean">{voucher.price}</div>
        <p className="text-sm text-gray-600">Precio Total</p>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Voucher obligatorio para el servicio<br />
          Conserva este comprobante hasta completar el viaje
        </p>
      </div>
    </div>
  );

  if (showModal) {
    return (
      <Dialog open={showModal} onOpenChange={onClose}>
        <DialogContent className="max-w-lg overflow-hidden">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <TicketIcon className="w-5 h-5 text-ocean" />
              Tu Voucher de Transferencia
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 overflow-hidden">
            <div className="overflow-hidden">
              <VoucherContent />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center print:hidden border-t pt-4">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white"
                size="sm"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                {isDownloading ? "Descargando..." : "Descargar"}
              </Button>

              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
              >
                <PrinterIcon className="w-4 h-4 mr-2" />
                Imprimir
              </Button>

              <Button
                onClick={handleEmailSend}
                variant="outline"
                size="sm"
              >
                <MailIcon className="w-4 h-4 mr-2" />
                Enviar por Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <VoucherContent />;
}

// Hook for managing vouchers
export const useVoucher = () => {
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);

  const generateVoucher = (bookingData: any): VoucherData => {
    const voucherId = `TM${Date.now().toString().slice(-6)}`;
    // Generate a simple QR code placeholder URL
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(voucherId)}`;
    
    return {
      id: voucherId,
      bookingRef: voucherId,
      date: bookingData.date,
      time: bookingData.time,
      origin: bookingData.origin,
      destination: bookingData.destination,
      passengers: parseInt(bookingData.passengers) || 1,
      children: parseInt(bookingData.children) || 0,
      luggage: parseInt(bookingData.luggage) || 1,
      vehicleType: bookingData.vehicleType || "Standard",
      price: bookingData.estimatedPrice || "€35",
      status: "confirmed",
      qrCode,
      specialRequests: bookingData.specialRequests,
    };
  };

  const addVoucher = (voucher: VoucherData) => {
    setVouchers(prev => [...prev, voucher]);
    // Store in localStorage
    const stored = localStorage.getItem("vouchers") || "[]";
    const existingVouchers = JSON.parse(stored);
    localStorage.setItem("vouchers", JSON.stringify([...existingVouchers, voucher]));
  };

  const getVoucher = (id: string) => {
    return vouchers.find(v => v.id === id);
  };

  return {
    vouchers,
    generateVoucher,
    addVoucher,
    getVoucher,
  };
};
