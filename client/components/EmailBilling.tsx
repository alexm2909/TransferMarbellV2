import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MailIcon,
  FileTextIcon,
  SendIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  EuroIcon,
  BuildingIcon,
  UserIcon,
} from "lucide-react";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  taxId?: string;
  address: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  bookingRefs: string[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  bookingRef?: string;
}

interface EmailBillingProps {
  bookings?: any[];
  clientData?: any;
  onInvoiceGenerated?: (invoice: InvoiceData) => void;
}

export default function EmailBilling({ bookings = [], clientData, onInvoiceGenerated }: EmailBillingProps) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const calculateInvoiceData = (selectedBookingIds: string[]) => {
    const selectedBookingData = bookings.filter(b => selectedBookingIds.includes(b.id));
    
    const items: InvoiceItem[] = selectedBookingData.map(booking => ({
      description: `Transferencia de ${booking.origin} a ${booking.destination}`,
      quantity: 1,
      unitPrice: parseFloat(booking.price?.replace('€', '') || '35'),
      total: parseFloat(booking.price?.replace('€', '') || '35'),
      bookingRef: booking.bookingRef || booking.id,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.21; // 21% IVA
    const total = subtotal + tax;

    return { items, subtotal, tax, total };
  };

  const generateInvoice = async () => {
    if (selectedBookings.length === 0) {
      alert('Selecciona al menos una reserva para facturar');
      return;
    }

    setIsGenerating(true);
    try {
      const { items, subtotal, tax, total } = calculateInvoiceData(selectedBookings);
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 30);

      const invoice: InvoiceData = {
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber(),
        clientName: clientData?.name || "Cliente",
        clientEmail: clientData?.email || "",
        companyName: clientData?.companyName,
        taxId: clientData?.taxId,
        address: clientData?.address || "",
        date: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        items,
        subtotal,
        tax,
        total,
        status: "draft",
        bookingRefs: selectedBookings,
      };

      setInvoices(prev => [...prev, invoice]);
      onInvoiceGenerated?.(invoice);
      
      // Store in localStorage
      const stored = localStorage.getItem("invoices") || "[]";
      const existingInvoices = JSON.parse(stored);
      localStorage.setItem("invoices", JSON.stringify([...existingInvoices, invoice]));

      alert('Factura generada exitosamente');
      setShowCreateInvoice(false);
      setSelectedBookings([]);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error al generar la factura');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendInvoiceByEmail = async (invoice: InvoiceData) => {
    setIsSending(true);
    try {
      // In real implementation, send via email service
      const emailBody = generateEmailBody(invoice);
      const subject = `Factura ${invoice.invoiceNumber} - Transfermarbell`;
      
      // Open default email client
      const mailtoLink = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');

      // Update status
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: "sent" as const } : inv
      );
      setInvoices(updatedInvoices);
      
      alert('Factura enviada por email');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error al enviar la factura');
    } finally {
      setIsSending(false);
    }
  };

  const generateEmailBody = (invoice: InvoiceData) => {
    return `
Estimado/a ${invoice.clientName},

Adjuntamos la factura ${invoice.invoiceNumber} por los servicios de transferencia realizados.

Detalles de la factura:
- Número: ${invoice.invoiceNumber}
- Fecha: ${invoice.date}
- Fecha de vencimiento: ${invoice.dueDate}
- Total: €${invoice.total.toFixed(2)}

Servicios incluidos:
${invoice.items.map(item => 
  `- ${item.description} (${item.bookingRef}): €${item.total.toFixed(2)}`
).join('\n')}

Subtotal: €${invoice.subtotal.toFixed(2)}
IVA (21%): €${invoice.tax.toFixed(2)}
Total: €${invoice.total.toFixed(2)}

Gracias por confiar en Transfermarbell para sus necesidades de transporte.

Saludos cordiales,
Equipo de Transfermarbell
    `;
  };

  const getStatusBadge = (status: InvoiceData['status']) => {
    const statusConfig = {
      draft: { label: "Borrador", className: "bg-gray-100 text-gray-800" },
      sent: { label: "Enviada", className: "bg-blue-100 text-blue-800" },
      paid: { label: "Pagada", className: "bg-green-100 text-green-800" },
      overdue: { label: "Vencida", className: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-6 h-6 text-ocean" />
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Facturación</h2>
        </div>
        <Button
          onClick={() => setShowCreateInvoice(true)}
          className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white"
        >
          <FileTextIcon className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(invoice.status)}
                  <div className="text-lg font-bold text-ocean mt-1">
                    €{invoice.total.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Fecha:</span>
                  <div className="font-medium">{invoice.date}</div>
                </div>
                <div>
                  <span className="text-gray-500">Vencimiento:</span>
                  <div className="font-medium">{invoice.dueDate}</div>
                </div>
                <div>
                  <span className="text-gray-500">Servicios:</span>
                  <div className="font-medium">{invoice.items.length}</div>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <div className="font-medium truncate">{invoice.clientEmail}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {invoice.status === "draft" && (
                  <Button
                    onClick={() => sendInvoiceByEmail(invoice)}
                    disabled={isSending}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <SendIcon className="w-4 h-4 mr-2" />
                    {isSending ? "Enviando..." : "Enviar por Email"}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {invoices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay facturas generadas
              </h3>
              <p className="text-gray-600 mb-4">
                Crea tu primera factura para empezar a gestionar la facturación de clientes
              </p>
              <Button
                onClick={() => setShowCreateInvoice(true)}
                className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white"
              >
                Crear Primera Factura
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Invoice Modal */}
      <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-ocean" />
              Crear Nueva Factura
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserIcon className="w-5 h-5 text-ocean" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <Input
                      value={clientData?.name || ""}
                      placeholder="Nombre del cliente"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      value={clientData?.email || ""}
                      placeholder="email@ejemplo.com"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Select Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="w-5 h-5 text-ocean" />
                  Seleccionar Reservas para Facturar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedBookings.includes(booking.id)
                          ? "border-ocean bg-ocean/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedBookings(prev =>
                          prev.includes(booking.id)
                            ? prev.filter(id => id !== booking.id)
                            : [...prev, booking.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {booking.origin} → {booking.destination}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.date} • {booking.bookingRef || booking.id}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ocean">
                            {booking.price || "€35"}
                          </div>
                          {selectedBookings.includes(booking.id) && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <AlertCircleIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay reservas disponibles para facturar</p>
                    </div>
                  )}
                </div>

                {selectedBookings.length > 0 && (
                  <div className="mt-4 p-3 bg-ocean/5 rounded-lg border border-ocean/20">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Resumen de Facturación:
                    </div>
                    {(() => {
                      const { subtotal, tax, total } = calculateInvoiceData(selectedBookings);
                      return (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>€{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IVA (21%):</span>
                            <span>€{tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-ocean border-t pt-1">
                            <span>Total:</span>
                            <span>€{total.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowCreateInvoice(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={generateInvoice}
                disabled={isGenerating || selectedBookings.length === 0}
                className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white"
              >
                {isGenerating ? "Generando..." : "Generar Factura"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
