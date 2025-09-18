import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import TimeSelector from "@/components/TimeSelector";
import ChildrenAgeSelector from "@/components/ChildrenAgeSelector";
import RouteMap from "@/components/RouteMap";
import LuggageSizeSelector from "@/components/LuggageSizeSelector";
import { ArrowLeftIcon, Users, Baby, Suitcase, Calendar, Clock, Car, Truck, Star, Airplane, CreditCard, MessageCircle, MapPin as MapPinIcon } from "lucide-react";
import { useBookings } from "@/hooks/useDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function generateReservationTag() {
  const letters = Array.from({ length: 3 })
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
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
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("1");
  const [vehicleType, setVehicleType] = useState("");
  const [email, setEmail] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [childSeats, setChildSeats] = useState<any[]>([]);
  const [luggageDetails, setLuggageDetails] = useState<any[]>([]);
  const [flightNumber, setFlightNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("full");
  const [specialRequests, setSpecialRequests] = useState("");

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
        setChildrenCount(p.children || 0);
        localStorage.removeItem("preBookingData");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !date || !time || !vehicleType || !email) {
      alert("Por favor completa todos los campos requeridos, incluyendo el correo electrónico");
      return;
    }

    if (returnTrip) {
      if (!returnDate) {
        alert('Por favor selecciona la fecha de regreso para el viaje de vuelta');
        return;
      }
      if (returnDate < date) {
        setDateError('La fecha de regreso no puede ser anterior a la fecha de ida');
        alert('La fecha de regreso no puede ser anterior a la fecha de ida');
        return;
      }
    }

    const reservationTag = generateReservationTag();

    // Build luggage counts from luggageDetails if present
    const luggageCounts = { small: 0, medium: 0, large: 0, xlarge: 0 };
    if (luggageDetails && luggageDetails.length > 0) {
      luggageDetails.forEach((it: any) => {
        const size = it.size || 'medium';
        luggageCounts[size] = (luggageCounts[size] || 0) + 1;
      });
    } else {
      // fallback: put all in large as previous behavior
      luggageCounts.large = parseInt(luggage, 10) || 0;
    }

    const newBooking = createBooking({
      clientId: email,
      reservationTag,
      status: "pending",
      tripDetails: {
        origin: { address: origin },
        destination: { address: destination },
        date,
        time,
        passengers: parseInt(passengers, 10),
        children: childrenCount,
        childSeats: childSeats,
        luggage: luggageCounts,
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: form and content (span 2) */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Link to="/" className="inline-flex items-center text-ocean hover:text-coral">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
              </Link>
              <h1 className="text-2xl font-bold mt-4">Reservar Traslado</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin / Destination (kept simple) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-ocean" /> Origen y Destino</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Origen</Label>
                      <AddressAutocomplete value={origin} onChange={setOrigin} placeholder="Aeropuerto, hotel, dirección..." />
                    </div>
                    <div>
                      <Label>Destino</Label>
                      <AddressAutocomplete value={destination} onChange={setDestination} placeholder="Aeropuerto, hotel, dirección..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip details card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-ocean" /> Detalles del viaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha</Label>
                      <Input className="h-12" type="date" value={date} onChange={(e) => { setDate(e.target.value); if (returnTrip && returnDate && e.target.value && returnDate < e.target.value) { setDateError('La fecha de regreso no puede ser anterior a la fecha de ida'); } else { setDateError(null); } }} required />
                    </div>
                    <div>
                      <Label>Hora</Label>
                      <TimeSelector value={time} onChange={setTime} />
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} className="rounded border-input text-ocean focus:ring-0" />
                      <span className="text-sm">Ida y vuelta</span>
                    </label>

                    {returnTrip && (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha de regreso</Label>
                          <Input className="h-12" type="date" value={returnDate} min={date || undefined} onChange={(e) => { setReturnDate(e.target.value); if (date && e.target.value && e.target.value < date) setDateError('La fecha de regreso no puede ser anterior a la fecha de ida'); else setDateError(null); }} />
                          {dateError && <div className="text-xs text-red-600 mt-1">{dateError}</div>}
                        </div>
                        <div>
                          <Label>Hora de regreso</Label>
                          <TimeSelector value={returnTime} onChange={setReturnTime} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Passengers & Luggage */}
              <Card>
                <CardHeader>
                  <CardTitle>Passengers & Luggage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="p-4 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-2">
                      <div className="p-2 bg-ocean-light/10 rounded-full inline-flex"><Users className="w-5 h-5 text-ocean" /></div>
                      <div className="text-sm text-gray-500">Adultos</div>
                      <div className="w-full mt-2">
                        <Select value={passengers} onValueChange={(v) => setPassengers(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} adulto
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-2">
                      <div className="p-2 bg-pink-50 rounded-full inline-flex"><Baby className="w-5 h-5 text-pink-600" /></div>
                      <div className="text-sm text-gray-500">Niños</div>
                      <div className="w-full mt-2">
                        <Select value={String(childrenCount)} onValueChange={(v) => setChildrenCount(parseInt(v, 10))}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} niñ{n === 1 ? 'o' : 'os'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-2">
                      <div className="p-2 bg-coral-50 rounded-full inline-flex"><Suitcase className="w-5 h-5 text-coral" /></div>
                      <div className="text-sm text-gray-500">Maletas</div>
                      <div className="w-full mt-2">
                        <Select value={luggage} onValueChange={(v) => setLuggage(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} maleta{n === 1 ? '' : 's'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 text-center bg-gray-50 flex flex-col items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-full inline-flex"><Car className="w-5 h-5 text-blue-600" /></div>
                      <div className="text-sm text-gray-500">Coches Requeridos</div>
                      <div className="mt-2 text-2xl font-bold">{Math.max(1, Math.ceil(parseInt(passengers || '1', 10) / 4))}</div>
                      <div className="text-xs text-gray-500">coches</div>
                    </div>
                  </div>

                  {childrenCount > 0 && (
                    <div className="mb-4">
                      <ChildrenAgeSelector numberOfChildren={childrenCount} onChildSeatsChange={(seats) => setChildSeats(seats)} />
                    </div>
                  )}

                  {parseInt(luggage || "0", 10) > 0 && (
                    <div className="mb-3">
                      <LuggageSizeSelector numberOfLuggage={parseInt(luggage || "0", 10)} onLuggageChange={(items) => setLuggageDetails(items)} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle selection card */}
              <Card>
                <CardHeader>
                  <CardTitle>Selección de Vehículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'economy', name: 'Economy', desc: 'Sedan cómodo, 4 pasajeros', seats: '1-3 passengers', luggage: 'Max: 3 pasajeros, 2 maletas', bullets: ['Air conditioning','Professional driver','Free Wi-Fi'], price: '€25' },
                      { key: 'comfort', name: 'Comfort', desc: 'Premium comfort with extra space', seats: '1-3 passengers', luggage: 'Max: 3 pasajeros, 3 maletas', bullets: ['Leather seats','Extra legroom','Phone charger','Water bottles'], price: '€35' },
                      { key: 'premium', name: 'Premium', desc: 'Luxury vehicles for special occasions', seats: '1-3 passengers', luggage: 'Max: 3 pasajeros, 3 maletas', bullets: ['Luxury sedan','Premium amenities','Concierge service'], price: '€50' },
                      { key: 'van', name: 'Van', desc: 'Spacious van for groups and families', seats: '4-8 passengers', luggage: 'Max: 8 pasajeros, 8 maletas', bullets: ['Large trunk space','Group seating','Extra luggage capacity'], price: '€65' },
                      { key: 'luxury', name: 'Luxury', desc: 'Ultimate luxury experience', seats: '1-3 passengers', luggage: 'Max: 3 pasajeros, 2 maletas', bullets: ['Premium luxury car','VIP treatment','Red carpet service'], price: '€80' },
                    ].map((opt) => (
                      <div
                        key={opt.key}
                        role="button"
                        tabIndex={0}
                        onClick={() => setVehicleType(opt.key)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setVehicleType(opt.key)}
                        className={`p-4 rounded-lg cursor-pointer border ${vehicleType === opt.key ? 'border-ocean bg-ocean-light/5' : 'border-gray-200'} transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-ocean-light/10 rounded-md inline-flex"><Truck className="w-6 h-6 text-ocean" /></div>
                            <div>
                              <div className="font-semibold text-gray-900">{opt.name}</div>
                              <div className="text-xs text-gray-600">{opt.desc}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{opt.price}</span>
                              <span className="text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-ocean to-coral">From</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-600">
                          <div className="mb-2">{opt.seats}</div>
                          <div className="mb-2">{opt.luggage}</div>
                          <ul className="list-disc ml-5 space-y-1">
                            {opt.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional details card */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Número de vuelo (opcional)</Label>
                      <Input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="Ej: VY1234" />
                    </div>
                    <div>
                      <Label>Pago</Label>
                      <RadioGroup defaultValue={paymentOption} onValueChange={(v) => setPaymentOption(v)} className="flex gap-3">
                        <RadioGroupItem value="full" id="pay-full" />
                        <label htmlFor="pay-full" className="text-sm">Pago completo</label>
                        <RadioGroupItem value="deposit" id="pay-deposit" />
                        <label htmlFor="pay-deposit" className="text-sm">Reservar 20% (depósito)</label>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Solicitudes especiales</Label>
                    <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Indica si necesitas silla de ruedas, asistencia, etc." />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="bg-gradient-to-r from-ocean to-coral text-white">Completar Reserva</Button>
              </div>
            </form>
          </div>

          {/* Right: static route card */}
          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <RouteMap origin={origin} destination={destination} className="w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
