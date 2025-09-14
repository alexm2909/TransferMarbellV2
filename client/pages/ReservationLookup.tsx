import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { database } from "@/services/database";

export default function ReservationLookup() {
  const [tag, setTag] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tag || !email) {
      setError("Por favor introduce la etiqueta de reserva y el email");
      return;
    }

    const bookings = database.getAllBookings();
    const booking = bookings.find((b) => b.reservationTag === tag && b.clientData?.email?.toLowerCase() === email.toLowerCase());

    if (!booking) {
      setError("No se ha encontrado ninguna reserva con esos datos");
      return;
    }

    navigate(`/mi-reserva/${booking.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Consultar mi reserva</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Etiqueta de reserva</label>
            <Input value={tag} onChange={(e) => setTag(e.target.value.toUpperCase())} placeholder="TRMB_ABC1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-ocean to-coral text-white">Buscar</Button>
        </form>
      </div>
    </div>
  );
}
