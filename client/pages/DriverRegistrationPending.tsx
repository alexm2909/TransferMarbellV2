import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  CarIcon,
  ClockIcon,
  CheckCircleIcon,
  MailIcon,
  PhoneIcon,
  ArrowLeftIcon,
  InfoIcon,
  FileTextIcon,
} from "lucide-react";

export default function DriverRegistrationPending() {
  const { user } = useAuth();

  const steps = [
    {
      id: 1,
      title: "Solicitud Enviada",
      description: "Tu solicitud ha sido recibida exitosamente",
      completed: true,
      icon: CheckCircleIcon,
    },
    {
      id: 2,
      title: "Revisión de Documentos",
      description: "Nuestro equipo está verificando tu documentación",
      completed: false,
      current: true,
      icon: FileTextIcon,
    },
    {
      id: 3,
      title: "Aprobación Final",
      description: "Decisión final y activación de tu cuenta de conductor",
      completed: false,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b">
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
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            ¡Solicitud Enviada Correctamente!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu solicitud para convertirte en conductor está siendo revisada por nuestro equipo de administradores.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-ocean" />
              Estado de tu Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.name || "Conductor Solicitante"}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 mt-3 sm:mt-0 w-fit">
                <ClockIcon className="w-4 h-4 mr-2" />
                Pendiente de Aprobación
              </Badge>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.current 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className={`font-medium ${
                      step.completed ? 'text-green-700' : step.current ? 'text-amber-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute left-5 mt-10 w-0.5 h-6 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Timeline Card */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-ocean" />
                Tiempo de Procesamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tiempo estimado:</span>
                  <span className="font-semibold text-ocean">2-5 días laborables</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Solicitud enviada:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Respuesta esperada:</span>
                  <span className="font-semibold text-green-600">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MailIcon className="w-5 h-5 text-ocean" />
                ¿Necesitas Ayuda?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ocean-light/20 rounded-lg flex items-center justify-center">
                    <MailIcon className="w-4 h-4 text-ocean" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">soporte@transfermarbell.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ocean-light/20 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-ocean" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-600">+34 952 123 456</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    Horario de atención: Lunes a Viernes de 9:00 a 18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps Card */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-ocean" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Durante la Revisión:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Verificaremos todos tus documentos
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Validaremos la información del vehículo
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Realizaremos las verificaciones necesarias
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Te Notificaremos Por:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <MailIcon className="w-4 h-4 text-ocean mt-0.5 flex-shrink-0" />
                    Email a {user?.email}
                  </li>
                  <li className="flex items-start gap-2">
                    <InfoIcon className="w-4 h-4 text-ocean mt-0.5 flex-shrink-0" />
                    Notificación en tu panel de usuario
                  </li>
                  <li className="flex items-start gap-2">
                    <PhoneIcon className="w-4 h-4 text-ocean mt-0.5 flex-shrink-0" />
                    SMS si es necesario contactarte
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white px-8"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver al Panel de Usuario
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-ocean text-ocean hover:bg-ocean hover:text-white px-8"
            onClick={() => window.location.href = 'mailto:soporte@transfermarbell.com?subject=Consulta sobre solicitud de conductor'}
          >
            <MailIcon className="w-4 h-4 mr-2" />
            Contactar Soporte
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Recibirás una confirmación por email una vez que tu solicitud sea procesada.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Si tienes alguna pregunta, no dudes en contactar con nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
