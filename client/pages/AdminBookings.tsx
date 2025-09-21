import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingRow {
  id: number;
  reservation_tag: string;
  status: string;
  client_email: string | null;
  origin: any;
  destination: any;
  date: string | null;
  time: string | null;
  return_date: string | null;
  passengers: number | null;
  children: any;
  luggage: any;
  vehicle_type: string | null;
  created_at: string | null;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const json = await res.json();
      setBookings(json.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const resend = async (b: BookingRow) => {
    if (!b.client_email) return alert('No email available for this booking');
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: b.client_email,
          reservationTag: b.reservation_tag,
          subject: `Confirmación de reserva ${b.reservation_tag}`,
          text: `Reserva ${b.reservation_tag}`,
          html: `<p>Reserva: <strong>${b.reservation_tag}</strong></p>`,
        }),
      });
      alert('Email reenviado (o registrado en logs si SMTP no está configurado)');
    } catch (err) {
      console.error('resend failed', err);
      alert('Error reenviando');
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin — Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={fetchBookings}>Refrescar</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="p-2">Tag</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Origen</th>
                  <th className="p-2">Destino</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Pas.</th>
                  <th className="p-2">Vehículo</th>
                  <th className="p-2">Creada</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.reservation_tag}</td>
                    <td className="p-2">{b.client_email || '-'}</td>
                    <td className="p-2">{b.origin?.address || '-'}</td>
                    <td className="p-2">{b.destination?.address || '-'}</td>
                    <td className="p-2">{b.date || '-'}</td>
                    <td className="p-2">{b.passengers ?? '-'}</td>
                    <td className="p-2">{b.vehicle_type || '-'}</td>
                    <td className="p-2">{b.created_at ? new Date(b.created_at).toLocaleString() : '-'}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button onClick={() => resend(b)} size="sm">Reenviar email</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
