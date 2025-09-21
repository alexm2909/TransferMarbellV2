import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import TimeSelector from "@/components/TimeSelector";
import ChildrenAgeSelector from "@/components/ChildrenAgeSelector";
import RouteMap from "@/components/RouteMap";
import LuggageSizeSelector from "@/components/LuggageSizeSelector";
import {
  ArrowLeftIcon,
  Users,
  Baby,
  LuggageIcon,
  Calendar,
  Car,
  Truck,
  Star,
  MapPin as MapPinIcon,
} from "lucide-react";
import { useBookings } from "@/hooks/useDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import InputMask from "react-input-mask";

function generateReservationTag() {
  const letters = Array.from({ length: 3 })
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const numbers = Math.floor(1000 + Math.random() * 9000).toString();
  return `TRMB_${letters}${numbers}`;
}

// Phone validation and formatting using libphonenumber-js
const isValidPhone = (s: string, defaultCountry?: string) => {
  if (!s) return false;
  try {
    const pn = parsePhoneNumberFromString(s || "", defaultCountry as any);
    return !!(pn && pn.isValid());
  } catch (err) {
    return false;
  }
};

const formatPhone = (s: string, defaultCountry?: string) => {
  if (!s) return "";
  try {
    const pn = parsePhoneNumberFromString(s || "", defaultCountry as any);
    return pn ? pn.formatInternational() : s.trim();
  } catch (err) {
    return s.trim();
  }
};

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
  const [phone, setPhone] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ES");
  const [childrenCount, setChildrenCount] = useState(0);
  const [childSeats, setChildSeats] = useState<any[]>([]);
  const [luggageDetails, setLuggageDetails] = useState<any[]>([]);
  const [flightNumber, setFlightNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("full");
  const [specialRequests, setSpecialRequests] = useState("");

  // Vehicle definitions with numeric capacities
  const vehicleOptions = [
    {
      key: "economy",
      name: "Economy",
      desc: "Sedan cómodo, 4 pasajeros",
      seatsCapacity: 4,
      luggageCapacity: 2,
      bullets: ["Air conditioning", "Professional driver", "Free Wi-Fi"],
      price: "€25",
    },
    {
      key: "comfort",
      name: "Comfort",
      desc: "Premium comfort with extra space",
      seatsCapacity: 4,
      luggageCapacity: 3,
      bullets: [
        "Leather seats",
        "Extra legroom",
        "Phone charger",
        "Water bottles",
      ],
      price: "���35",
    },
    {
      key: "premium",
      name: "Premium",
      desc: "Luxury vehicles for special occasions",
      seatsCapacity: 4,
      luggageCapacity: 3,
      bullets: ["Luxury sedan", "Premium amenities", "Concierge service"],
      price: "€50",
    },
    {
      key: "van",
      name: "Van",
      desc: "Spacious van for groups and families",
      seatsCapacity: 8,
      luggageCapacity: 8,
      bullets: ["Large trunk space", "Group seating", "Extra luggage capacity"],
      price: "€65",
    },
    {
      key: "luxury",
      name: "Luxury",
      desc: "Ultimate luxury experience",
      seatsCapacity: 4,
      luggageCapacity: 2,
      bullets: ["Premium luxury car", "VIP treatment", "Red carpet service"],
      price: "€80",
    },
  ];

  // Inline SVGs for vehicle visuals (vector images)
  const getVehicleSVG = (key: string) => {
    const common = "fill='%23ffffff'";
    switch (key) {
      case "economy":
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='4' width='64' height='20' y='6' fill='%23007bff'/><circle cx='16' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
      case "comfort":
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='6' width='64' height='20' y='6' fill='%2300b894'/><circle cx='16' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
      case "premium":
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='6' width='64' height='20' y='6' fill='%23ff7b54'/><circle cx='16' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
      case "van":
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='2' width='64' height='20' y='6' fill='%23006688'/><rect x='8' y='2' width='24' height='10' rx='1' fill='%23006688'/><circle cx='20' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
      case "luxury":
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='6' width='64' height='20' y='6' fill='%23000000'/><rect x='8' y='6' width='48' height='12' rx='3' fill='%23ffd166' opacity='0.15'/><circle cx='16' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
      default:
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 32'><rect rx='4' width='64' height='20' y='6' fill='%23888'/><circle cx='16' cy='24' r='4' fill='%23000000'/><circle cx='48' cy='24' r='4' fill='%23000000'/></svg>`;
    }
  };

  const largestSeats = Math.max(...vehicleOptions.map((v) => v.seatsCapacity));
  const largestLuggage = Math.max(
    ...vehicleOptions.map((v) => v.luggageCapacity),
  );

  const totalPeople = parseInt(passengers || "0", 10) + childrenCount;
  const totalLuggageCount =
    luggageDetails && luggageDetails.length > 0
      ? luggageDetails.length
      : parseInt(luggage || "0", 10) || 0;

  const requiredCars = Math.max(
    1,
    Math.ceil(totalPeople / largestSeats),
    Math.ceil(totalLuggageCount / largestLuggage),
  );

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
        // if prebooking contains name/phone, set them
        if (p.clientName) {
          const parts = String(p.clientName).split(" ");
          setFirstName(parts.shift() || "");
          setLastName(parts.join(" ") || "");
        }
        if (p.clientPhone) setPhone(p.clientPhone || "");
        localStorage.removeItem("preBookingData");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handlePhoneBlur = () => {
    if (!phone) {
      setPhoneError(null);
      return;
    }
    const formatted = formatPhone(phone, selectedCountry);
    setPhone(formatted);
    if (!isValidPhone(formatted, selectedCountry)) {
      setPhoneError(
        "Teléfono no válido. Usa formato internacional, ej. +34 600 123 456",
      );
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !date || !time || !vehicleType) {
      alert("Por favor completa todos los campos requeridos del viaje");
      return;
    }

    // Require name and surname
    if (!firstName.trim() || !lastName.trim()) {
      alert("Por favor introduce tu nombre y apellidos");
      return;
    }

    // Require at least email or phone
    if (!email.trim() && !phone.trim()) {
      alert(
        "Por favor introduce al menos un correo electrónico o un número de teléfono",
      );
      return;
    }

    if (phone && !isValidPhone(phone, selectedCountry)) {
      alert(
        "Teléfono no válido. Usa formato internacional, ej. +34 600 123 456",
      );
      return;
    }

    if (returnTrip) {
      if (!returnDate) {
        alert(
          "Por favor selecciona la fecha de regreso para el viaje de vuelta",
        );
        return;
      }
      if (returnDate < date) {
        setDateError(
          "La fecha de regreso no puede ser anterior a la fecha de ida",
        );
        alert("La fecha de regreso no puede ser anterior a la fecha de ida");
        return;
      }
    }

    const reservationTag = generateReservationTag();

    // Build luggage counts from luggageDetails if present
    const luggageCounts = { small: 0, medium: 0, large: 0, xlarge: 0 };
    if (luggageDetails && luggageDetails.length > 0) {
      luggageDetails.forEach((it: any) => {
        const size = it.size || "medium";
        luggageCounts[size] = (luggageCounts[size] || 0) + 1;
      });
    } else {
      // fallback: put all in large as previous behavior
      luggageCounts.large = parseInt(luggage, 10) || 0;
    }

    const clientFullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    // Persist booking via API
    const payload = {
      reservationTag,
      status: 'pending',
      clientEmail: email,
      origin: { address: origin },
      destination: { address: destination },
      date,
      time,
      returnDate: returnTrip ? returnDate : null,
      returnTime: returnTrip ? returnTime : null,
      passengers: parseInt(passengers, 10),
      children: childrenCount > 0 ? { count: childrenCount } : null,
      childSeats,
      luggage: luggageCounts,
      vehicleType,
      pricing: { totalPrice: 0 },
    };

    let created: any;
    try {
      const resp = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await resp.json();
      if (!resp.ok || !json.success) throw new Error('Booking creation failed');
      created = json.booking;
    } catch (err) {
      alert('Error creando la reserva, inténtalo de nuevo');
      return;
    }

    // Store pendingBooking for confirmation page
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({ id: created.id, reservationTag: created.reservation_tag, email }),
    );

    // Send confirmation email via server function if email provided
    if (email) {
      try {
        await fetch("/api/send-confirmation", {
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
              <Link
                to="/"
                className="inline-flex items-center text-ocean hover:text-coral"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
              </Link>
              <h1 className="text-2xl font-bold mt-4">Reservar Traslado</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin / Destination (kept simple) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-ocean" /> Origen y
                    Destino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Origen</Label>
                      <AddressAutocomplete
                        value={origin}
                        onChange={setOrigin}
                        placeholder="Aeropuerto, hotel, dirección..."
                      />
                    </div>
                    <div>
                      <Label>Destino</Label>
                      <AddressAutocomplete
                        value={destination}
                        onChange={setDestination}
                        placeholder="Aeropuerto, hotel, dirección..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip details card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-ocean" /> Detalles del
                    viaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha</Label>
                      <Input
                        className="h-12"
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          if (
                            returnTrip &&
                            returnDate &&
                            e.target.value &&
                            returnDate < e.target.value
                          ) {
                            setDateError(
                              "La fecha de regreso no puede ser anterior a la fecha de ida",
                            );
                          } else {
                            setDateError(null);
                          }
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label>Hora</Label>
                      <TimeSelector value={time} onChange={setTime} />
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={returnTrip}
                        onChange={(e) => setReturnTrip(e.target.checked)}
                        className="rounded border-input text-ocean focus:ring-0"
                      />
                      <span className="text-sm">Ida y vuelta</span>
                    </label>

                    {returnTrip && (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha de regreso</Label>
                          <Input
                            className="h-12"
                            type="date"
                            value={returnDate}
                            min={date || undefined}
                            onChange={(e) => {
                              setReturnDate(e.target.value);
                              if (
                                date &&
                                e.target.value &&
                                e.target.value < date
                              )
                                setDateError(
                                  "La fecha de regreso no puede ser anterior a la fecha de ida",
                                );
                              else setDateError(null);
                            }}
                          />
                          {dateError && (
                            <div className="text-xs text-red-600 mt-1">
                              {dateError}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>Hora de regreso</Label>
                          <TimeSelector
                            value={returnTime}
                            onChange={setReturnTime}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Personal data card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-ocean" /> Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <Label>Apellidos</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Apellidos"
                      />
                    </div>
                    <div>
                      <Label>
                        Correo electrónico (opcional si introduces teléfono)
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <Label>Teléfono (opcional si introduces correo)</Label>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedCountry}
                          onChange={(e) => {
                            const cc = e.target.value;
                            setSelectedCountry(cc);
                            // apply dial prefix if phone empty or replace existing international prefix
                            const dialMap: Record<string, string> = {
                              ES: "+34",
                              GB: "+44",
                              FR: "+33",
                              DE: "+49",
                            };
                            const dial = dialMap[cc] || "";
                            if (!phone) setPhone(dial + (dial ? " " : ""));
                            else if (phone.startsWith("+")) {
                              // replace existing prefix
                              const rest = phone.replace(/^\+\d+\s?/, "");
                              setPhone(dial + (dial ? " " : "") + rest);
                            }
                          }}
                          className="h-10 rounded-md border p-2 bg-white"
                        >
                          <option value="ES">🇪🇸 +34</option>
                          <option value="GB">🇬🇧 +44</option>
                          <option value="FR">🇫🇷 +33</option>
                          <option value="DE">🇩🇪 +49</option>
                        </select>

                        {(() => {
                          const maskMap: Record<string, string | null> = {
                            ES: "+34 999 999 999",
                            GB: "+44 99 9999 9999",
                            FR: "+33 9 99 99 99 99",
                            DE: "+49 99 99999999",
                          };
                          const mask = maskMap[selectedCountry] || null;
                          if (mask) {
                            return (
                              <InputMask
                                mask={mask}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handlePhoneBlur}
                                maskChar={null}
                              >
                                {(inputProps) => (
                                  <Input {...inputProps} inputMode="tel" />
                                )}
                              </InputMask>
                            );
                          }

                          return (
                            <Input
                              value={phone}
                              onChange={(e) =>
                                setPhone(
                                  new AsYouType(selectedCountry).input(
                                    e.target.value,
                                  ),
                                )
                              }
                              onBlur={handlePhoneBlur}
                              placeholder="+34 600 123 456"
                              inputMode="tel"
                            />
                          );
                        })()}
                      </div>
                      {phoneError && (
                        <div className="text-xs text-red-600 mt-1">
                          {phoneError}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passengers & Luggage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-ocean" /> Passengers &
                    Luggage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="p-4 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-2">
                      <div className="p-2 bg-ocean-light/10 rounded-full inline-flex">
                        <Users className="w-5 h-5 text-ocean" />
                      </div>
                      <div className="text-sm text-gray-500">Adultos</div>
                      <div className="w-full mt-2">
                        <Select
                          value={passengers}
                          onValueChange={(v) => setPassengers(v)}
                        >
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
                      <div className="p-2 bg-pink-50 rounded-full inline-flex">
                        <Baby className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="text-sm text-gray-500">Niños</div>
                      <div className="w-full mt-2">
                        <Select
                          value={String(childrenCount)}
                          onValueChange={(v) =>
                            setChildrenCount(parseInt(v, 10))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} niñ{n === 1 ? "o" : "os"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-2">
                      <div className="p-2 bg-coral-50 rounded-full inline-flex">
                        <LuggageIcon className="w-5 h-5 text-coral" />
                      </div>
                      <div className="text-sm text-gray-500">Maletas</div>
                      <div className="w-full mt-2">
                        <Select
                          value={luggage}
                          onValueChange={(v) => setLuggage(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} maleta{n === 1 ? "" : "s"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 text-center bg-gray-50 flex flex-col items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-full inline-flex">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">
                        Coches Requeridos
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {requiredCars}
                      </div>
                      <div className="text-xs text-gray-500">coches</div>
                    </div>
                  </div>

                  {childrenCount > 0 && (
                    <div className="mb-4">
                      <ChildrenAgeSelector
                        numberOfChildren={childrenCount}
                        onChildSeatsChange={(seats) => setChildSeats(seats)}
                      />
                    </div>
                  )}

                  {parseInt(luggage || "0", 10) > 0 && (
                    <div className="mb-3">
                      <LuggageSizeSelector
                        numberOfLuggage={parseInt(luggage || "0", 10)}
                        onLuggageChange={(items) => setLuggageDetails(items)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle selection card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-ocean" /> Selección de Vehículo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicleOptions.map((opt) => (
                      <div
                        key={opt.key}
                        role="button"
                        tabIndex={0}
                        onClick={() => setVehicleType(opt.key)}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          setVehicleType(opt.key)
                        }
                        className={`p-4 rounded-lg cursor-pointer border ${vehicleType === opt.key ? "border-ocean bg-ocean-light/5" : "border-gray-200"} transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-ocean-light/10 rounded-md inline-flex">
                              <Truck className="w-6 h-6 text-ocean" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {opt.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {opt.desc}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {opt.price}
                              </span>
                              <span className="text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-ocean to-coral">
                                From
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-600">
                          <div className="mb-2">
                            Capacidad: {opt.seatsCapacity} pax
                          </div>
                          <div className="mb-2">
                            Maletas: {opt.luggageCapacity}
                          </div>
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
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-ocean" /> Detalles adicionales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Número de vuelo (opcional)</Label>
                      <Input
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        placeholder="Ej: VY1234"
                      />
                    </div>
                    <div>
                      <Label>Pago</Label>
                      <RadioGroup
                        value={paymentOption}
                        onValueChange={(v) => setPaymentOption(v)}
                        className="grid grid-cols-1 gap-2"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <label
                            className={`p-3 rounded-lg border ${paymentOption === "full" ? "border-ocean bg-ocean-light/5" : "border-gray-200"} cursor-pointer`}
                          >
                            <RadioGroupItem value="full" id="pay-full" />
                            <div className="font-medium">Pago completo</div>
                            <div className="text-xs text-gray-500">
                              Paga ahora el total
                            </div>
                          </label>

                          <label
                            className={`p-3 rounded-lg border ${paymentOption === "deposit" ? "border-ocean bg-ocean-light/5" : "border-gray-200"} cursor-pointer`}
                          >
                            <RadioGroupItem value="deposit" id="pay-deposit" />
                            <div className="font-medium">
                              Reservar 20% (depósito)
                            </div>
                            <div className="text-xs text-gray-500">
                              Paga solo el 20% ahora
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Solicitudes especiales</Label>
                    <Textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Indica si necesitas silla de ruedas, asistencia, etc."
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-ocean to-coral text-white"
                    >
                      Completar Reserva
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Right: static route card */}
          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <RouteMap
                origin={origin}
                destination={destination}
                className="w-full"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
