import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CarIcon,
  PlaneIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  ShieldIcon,
  StarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PhoneIcon,
  MessageSquareIcon,
  CreditCardIcon,
} from "lucide-react";

interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: any;
  features: string[];
  priceFrom: string;
  popular?: boolean;
  image: string;
}

export default function Services() {
  const services: ServiceType[] = [
    {
      id: "airport",
      title: "Traslados Aeropuerto",
      description: "Servicio premium desde y hacia los principales aeropuertos de la Costa del Sol",
      icon: PlaneIcon,
      features: [
        "Seguimiento de vuelos en tiempo real",
        "Espera gratuita de 60 minutos",
        "Recogida en zona de llegadas",
        "Servicio 24/7 disponible",
        "Tarifas fijas sin sorpresas"
      ],
      priceFrom: "€25",
      popular: true,
      image: "/api/placeholder/600/300"
    },
    {
      id: "city",
      title: "Traslados Urbanos",
      description: "Transporte cómodo y eficiente por Marbella, Málaga, Estepona y Costa del Sol",
      icon: CarIcon,
      features: [
        "Conductores locales expertos",
        "Rutas optimizadas",
        "Vehículos premium",
        "Reserva inmediata o programada",
        "Precios competitivos"
      ],
      priceFrom: "€20",
      image: "/api/placeholder/600/300"
    },
    {
      id: "business",
      title: "Transporte Ejecutivo",
      description: "Soluciones de transporte para empresas y eventos corporativos",
      icon: UsersIcon,
      features: [
        "Vehículos de lujo",
        "Conductores profesionales",
        "Facturación empresarial",
        "Gestión de múltiples reservas",
        "Soporte dedicado 24/7"
      ],
      priceFrom: "€50",
      image: "/api/placeholder/600/300"
    },
    {
      id: "events",
      title: "Eventos Especiales",
      description: "Transporte para bodas, celebraciones y ocasiones especiales",
      icon: StarIcon,
      features: [
        "Decoración personalizada",
        "Servicio de lujo premium",
        "Coordinación de eventos",
        "Flota de vehículos especiales",
        "Atención personalizada"
      ],
      priceFrom: "€80",
      image: "/api/placeholder/600/300"
    },
    {
      id: "tours",
      title: "Tours y Excursiones",
      description: "Descubre la Costa del Sol con nuestros tours personalizados",
      icon: MapPinIcon,
      features: [
        "Gu��as locales expertos",
        "Rutas personalizables",
        "Grupos pequeños y privados",
        "Paradas flexibles",
        "Experiencias únicas"
      ],
      priceFrom: "€60",
      image: "/api/placeholder/600/300"
    },
    {
      id: "hourly",
      title: "Servicio por Horas",
      description: "Disponibilidad completa de conductor y vehículo durante el tiempo que necesites",
      icon: ClockIcon,
      features: [
        "Tarifas por hora",
        "Disponibilidad inmediata",
        "Múltiples paradas",
        "Esperas incluidas",
        "Máxima flexibilidad"
      ],
      priceFrom: "€35/hora",
      image: "/api/placeholder/600/300"
    }
  ];

  const whyChooseUs = [
    {
      icon: ShieldIcon,
      title: "100% Seguro y Confiable",
      description: "Conductores verificados y vehículos asegurados"
    },
    {
      icon: StarIcon,
      title: "Calidad Premium",
      description: "Más de 4.9/5 estrellas en valoraciones de clientes"
    },
    {
      icon: PhoneIcon,
      title: "Soporte 24/7",
      description: "Atención al cliente disponible las 24 horas"
    },
    {
      icon: CreditCardIcon,
      title: "Pagos Flexibles",
      description: "Múltiples opciones de pago y tarifas transparentes"
    }
  ];

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
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-navy mb-6">
              Nuestros Servicios Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios de transporte privado adaptados 
              a tus necesidades en Costa del Sol
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-coral text-white">
                    Más Popular
                  </Badge>
                </div>
              )}

              <div className="relative">
                <div
                  className="h-48 bg-gradient-to-br from-ocean-light to-coral-light flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <service.icon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white text-gray-800 border border-gray-200">
                    Desde {service.priceFrom}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <CardTitle className="text-xl text-navy mb-3">
                  {service.title}
                </CardTitle>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Características incluidas:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/book">
                  <Button className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                    Reservar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              ¿Por qué elegir Transfermarbell?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos comprometemos a ofrecer el mejor servicio de transporte privado 
              en Costa del Sol
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-ocean" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-ocean-light to-coral-light border-0">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-navy mb-4">
                  Proceso de Reserva Simple
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Reservar tu traslado es fácil y rápido con nuestro sistema optimizado
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-ocean text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Selecciona</h3>
                  <p className="text-sm text-gray-700">
                    Elige origen, destino y tipo de servicio
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-ocean text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Reserva</h3>
                  <p className="text-sm text-gray-700">
                    Completa tu reserva con detalles del viaje
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-ocean text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Confirma</h3>
                  <p className="text-sm text-gray-700">
                    Recibe confirmación y detalles del conductor
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-ocean text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Disfruta</h3>
                  <p className="text-sm text-gray-700">
                    Rel��jate y disfruta tu viaje premium
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-navy mb-4">
                ¿Listo para reservar tu traslado?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Únete a miles de clientes satisfechos que confían en Transfermarbell 
                para sus traslados en Costa del Sol
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold px-8"
                  >
                    Reservar Ahora
                  </Button>
                </Link>
                <Link to="/fleet">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-ocean text-ocean hover:bg-ocean hover:text-white font-semibold px-8"
                  >
                    Ver Nuestra Flota
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Soporte 24/7
                </div>
                <div className="flex items-center">
                  <ShieldIcon className="w-4 h-4 mr-2" />
                  100% Seguro
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-2" />
                  4.9/5 Valoración
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
