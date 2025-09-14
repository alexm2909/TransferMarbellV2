import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import TimeSelector from "@/components/TimeSelector";
import { CreditCardIcon, ArrowLeftIcon, CarIcon } from "lucide-react";
import { database } from "@/services/database";
import { useBookings } from "@/hooks/useDatabase";
import { useLanguage } from "@/contexts/LanguageContext";

function generateReservationTag() {
  const letters = Array.from({ length: 3 }).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const numbers = Math.floor(1000 + Math.random() * 9000).toString();
  return `TRMB_${letters}${numbers}`;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { createBooking } = useBookings();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("1");
  const [vehicleType, setVehicleType] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pre = localStorage.getItem("preBookingData");
    if (pre) {
      try {
        const p = JSON.parse(pre);
        setOrigin(p.origin || "");
        setDestination(p.destination || "");
        setDate(p.date || "");
        setTime(p.time || "");
        setPassengers(p.passengers || "1");
        setLuggage(p.luggage || "1");
        setVehicleType(p.vehicleType || "");
        setEmail(p.clientEmail || "");
        localStorage.removeItem("preBookingData");
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !date || !time || !vehicleType || !email) {
      alert("Por favor completa todos los campos requeridos, incluyendo el correo electrónico");
      return;
    }

    const reservationTag = generateReservationTag();

    const newBooking = createBooking({
      clientId: email,
      reservationTag,
      status: "pending",
      tripDetails: {
        origin: { address: origin },
        destination: { address: destination },
        date,
        time,
        passengers: parseInt(passengers),
        luggage: { small: 0, medium: 0, large: parseInt(luggage) },
      },
      vehicleType,
      pricing: { basePrice: 0, extras: [], totalPrice: 0, currency: "EUR" },
      payment: { status: "pending" },
      clientData: { name: "", email, phone: "" },
    });

    // Store pendingBooking for confirmation page
    localStorage.setItem("pendingBooking", JSON.stringify({ id: newBooking.id, reservationTag, email }));

    // Send confirmation email via server function
    try {
      await fetch("/.netlify/functions/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          reservationTag,
          subject: `Confirmación de reserva ${reservationTag}`,
          text: `Tu reserva ${reservationTag} ha sido creada. Origen: ${origin} - Destino: ${destination} - Fecha: ${date} ${time}`,
          html: `<p>Reserva: <strong>${reservationTag}</strong></p><p>${origin} → ${destination}</p><p>${date} ${time}</p>`,
        }),
      });
    } catch (err) {
      console.warn("Error enviando correo de confirmación:", err);
    }

    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-ocean hover:text-coral"> 
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
          </Link>
          <h1 className="text-2xl font-bold mt-4">Reservar Traslado</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Origen</label>
            <AddressAutocomplete value={origin} onChange={setOrigin} placeholder="Aeropuerto, hotel, dirección..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Destino</label>
            <AddressAutocomplete value={destination} onChange={setDestination} placeholder="Aeropuerto, hotel, dirección..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <TimeSelector value={time} onChange={setTime} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pasajeros</label>
              <Select value={passengers} onValueChange={(v) => setPassengers(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maletas</label>
              <Select value={luggage} onValueChange={(v) => setLuggage(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[0,1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehículo</label>
              <Select value={vehicleType} onValueChange={(v) => setVehicleType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-ocean to-coral text-white">Completar Reserva</Button>
          </div>
        </form>

      </div>
    </div>
  );
}
