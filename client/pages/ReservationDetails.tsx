import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { database } from "@/services/database";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const b = database.getBookingById(id);
    setBooking(b);
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No se ha encontrado la reserva.</div>
      </div>
    );
  }

  const handleCancel = () => {
    // Cancel booking and mark payment as refunded=false; losing deposit handled by backend/biz rules
    database.updateBooking(booking.id, {
      status: "cancelled",
      timeline: { ...booking.timeline, cancelledAt: new Date().toISOString() },
    });
    navigate("/mi-reserva");
  };

  const handleEdit = () => {
    // For simplicity, redirect back to booking form and prefill data
    localStorage.setItem("preBookingData", JSON.stringify({
      origin: booking.tripDetails.origin.address,
      destination: booking.tripDetails.destination.address,
      date: booking.tripDetails.date,
      time: booking.tripDetails.time,
      passengers: String(booking.tripDetails.passengers),
      children: booking.tripDetails.children?.count ? String(booking.tripDetails.children.count) : "0",
      luggage: String((booking.tripDetails.luggage.small || 0) + (booking.tripDetails.luggage.medium || 0) + (booking.tripDetails.luggage.large || 0)),
      vehicleType: booking.vehicleType,
      flightNumber: booking.tripDetails.flightNumber || "",
      paymentPreference: booking.payment?.method || "full",
      specialRequests: booking.tripDetails.specialRequests || "",
      clientEmail: booking.clientData?.email || "",
    }));

    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Reserva {booking.reservationTag}</h2>
              <div className="text-sm text-gray-600">{booking.clientData?.email}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{new Date(booking.timeline.createdAt).toLocaleString()}</div>
              <div className="text-lg font-semibold">€{booking.pricing.totalPrice}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium">Origen</h3>
              <div className="text-sm text-gray-700">{booking.tripDetails.origin.address}</div>
            </div>
            <div>
              <h3 className="font-medium">Destino</h3>
              <div className="text-sm text-gray-700">{booking.tripDetails.destination.address}</div>
            </div>
            <div>
              <h3 className="font-medium">Fecha</h3>
              <div className="text-sm text-gray-700">{booking.tripDetails.date}</div>
            </div>
            <div>
              <h3 className="font-medium">Hora</h3>
              <div className="text-sm text-gray-700">{booking.tripDetails.time}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-ocean to-coral text-white" onClick={handleEdit}>Modificar</Button>
            <Button variant="outline" className="border-red-300 text-red-600" onClick={handleCancel}>Cancelar (pierde fianza)</Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Volver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
