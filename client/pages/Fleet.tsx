import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CarIcon,
  UsersIcon,
  StarIcon,
  ShieldIcon,
  WifiIcon,
  SnowflakeIcon,
  BluetoothIcon,
  BatteryIcon,
  PhoneIcon,
  ArrowLeftIcon,
  FilterIcon,
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  passengers: number;
  luggage: number;
  price: string;
  rating: number;
  features: string[];
  description: string;
  available: boolean;
}

export default function Fleet() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  const vehicles: Vehicle[] = [
    {
      id: "1",
      name: "Mercedes E-Class",
      category: "premium",
      image: "/api/placeholder/400/250",
      passengers: 3,
      luggage: 2,
      price: "€50",
      rating: 4.9,
      features: ["Wi-Fi", "Aire Acondicionado", "Asientos de Cuero", "Cargador USB", "Agua Gratis"],
      description: "Elegante sedán premium con máximo confort y tecnolog��a avanzada.",
      available: true,
    },
    {
      id: "2", 
      name: "BMW Serie 5",
      category: "premium",
      image: "/api/placeholder/400/250",
      passengers: 3,
      luggage: 2,
      price: "€55",
      rating: 4.8,
      features: ["Wi-Fi", "Climatizador", "GPS", "Bluetooth", "Servicio Premium"],
      description: "Lujo y rendimiento en cada kilómetro con tecnología BMW.",
      available: true,
    },
    {
      id: "3",
      name: "Volkswagen Passat",
      category: "comfort",
      image: "/api/placeholder/400/250", 
      passengers: 3,
      luggage: 2,
      price: "€35",
      rating: 4.7,
      features: ["Aire Acondicionado", "Bluetooth", "GPS", "Cargador USB"],
      description: "Comodidad y eficiencia para viajes largos y cortos.",
      available: true,
    },
    {
      id: "4",
      name: "Toyota Corolla",
      category: "economy",
      image: "/api/placeholder/400/250",
      passengers: 3,
      luggage: 1,
      price: "€25",
      rating: 4.6,
      features: ["Aire Acondicionado", "Radio", "Cinturones de Seguridad"],
      description: "Opción económica sin comprometer la seguridad y comodidad básica.",
      available: true,
    },
    {
      id: "5",
      name: "Mercedes V-Class",
      category: "van",
      image: "/api/placeholder/400/250",
      passengers: 7,
      luggage: 4,
      price: "€80",
      rating: 4.9,
      features: ["Wi-Fi", "Climatizador", "Asientos Premium", "Mesa de Trabajo", "Minibar"],
      description: "Van de lujo para grupos grandes con todas las comodidades.",
      available: true,
    },
    {
      id: "6",
      name: "Audi A6",
      category: "luxury",
      image: "/api/placeholder/400/250",
      passengers: 3,
      luggage: 2,
      price: "€90",
      rating: 5.0,
      features: ["Wi-Fi Premium", "Masaje", "Champán", "Servicio VIP", "Alfombra Roja"],
      description: "La máxima expresión del lujo en transporte privado.",
      available: false,
    },
  ];

  const categories = [
    { value: "all", label: "Todos los Vehículos" },
    { value: "economy", label: "Económico" },
    { value: "comfort", label: "Confort" },
    { value: "premium", label: "Premium" },
    { value: "van", label: "Van/Grupo" },
    { value: "luxury", label: "Lujo" },
  ];

  const filteredVehicles = vehicles.filter(vehicle => 
    selectedCategory === "all" || vehicle.category === selectedCategory
  ).sort((a, b) => {
    if (sortBy === "price") {
      return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "passengers") {
      return b.passengers - a.passengers;
    }
    return 0;
  });

  const getFeatureIcon = (feature: string) => {
    const iconMap: { [key: string]: any } = {
      "Wi-Fi": WifiIcon,
      "Wi-Fi Premium": WifiIcon,
      "Aire Acondicionado": SnowflakeIcon,
      "Climatizador": SnowflakeIcon,
      "Bluetooth": BluetoothIcon,
      "Cargador USB": BatteryIcon,
      "GPS": PhoneIcon,
    };
    
    const IconComponent = iconMap[feature];
    return IconComponent ? <IconComponent className="w-3 h-3" /> : <ShieldIcon className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/mi-reserva">
                <Button variant="outline" className="border-ocean text-ocean">Mi reserva</Button>
              </Link>
              <Link to="/book">
                <Button className="bg-gradient-to-r from-ocean to-coral">Reservar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-navy mb-4">
              Nuestra Flota Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra selección de vehículos de alta calidad para todos tus traslados
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <FilterIcon className="w-5 h-5 text-ocean" />
                  <span className="font-medium text-gray-700">Filtros:</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="space-y-2 md:space-y-0">
                    <label className="text-sm font-medium text-gray-600 md:sr-only">
                      Categoría
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:space-y-0">
                    <label className="text-sm font-medium text-gray-600 md:sr-only">
                      Ordenar por
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Precio</SelectItem>
                        <SelectItem value="rating">Valoración</SelectItem>
                        <SelectItem value="passengers">Capacidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {filteredVehicles.length} vehículos disponibles
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${
                !vehicle.available ? "opacity-60" : "hover:-translate-y-1"
              }`}
            >
              <div className="relative">
                <div
                  className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${vehicle.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <CarIcon className="w-16 h-16 text-gray-400" />
                </div>
                
                {!vehicle.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-red-500 text-white">
                      No Disponible
                    </Badge>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-gray-800 border border-gray-200">
                    {vehicle.price}/trayecto
                  </Badge>
                </div>

                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-navy mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {vehicle.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <UsersIcon className="w-4 h-4" />
                      <span className="text-sm">{vehicle.passengers}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17,6H22V8H21V10H23V12H21V15A2,2 0 0,1 19,17H18V21A1,1 0 0,1 17,22H15A1,1 0 0,1 14,21V17H6V21A1,1 0 0,1 5,22H3A1,1 0 0,1 2,21V17H1A2,2 0 0,1 1,15V12H3V10H2V8H7V6H8V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V6H17V6Z"/>
                      </svg>
                      <span className="text-sm">{vehicle.luggage}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-ocean text-ocean capitalize"
                  >
                    {vehicle.category}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Características:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-ocean-light/20 text-ocean px-2 py-1 rounded-full text-xs"
                      >
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </div>
                    ))}
                    {vehicle.features.length > 3 && (
                      <div className="text-xs text-gray-500 px-2 py-1">
                        +{vehicle.features.length - 3} más
                      </div>
                    )}
                  </div>
                </div>

                <Link to="/book">
                  <Button
                    className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90"
                    disabled={!vehicle.available}
                  >
                    {vehicle.available ? "Reservar Ahora" : "No Disponible"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-ocean-light to-coral-light border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-navy mb-4">
                ¿No encuentras el vehículo perfecto?
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Contáctanos y te ayudaremos a encontrar la solución de transporte
                ideal para tus necesidades específicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/support">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold px-8"
                  >
                    Contactar Soporte
                  </Button>
                </Link>
                <Link to="/book">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-ocean text-ocean hover:bg-ocean hover:text-white font-semibold px-8"
                  >
                    Reservar Traslado
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
