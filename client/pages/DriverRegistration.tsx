import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  CarIcon,
  UserIcon,
  FileTextIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UploadIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  InfoIcon,
} from "lucide-react";

interface DocumentUpload {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file: File | null;
  uploaded: boolean;
}

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehiclePlate: "",
    vehicleColor: "",
    bankAccount: "",
    taxId: "",
    agreeToDriverTerms: false,
  });

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      id: "vtc_license",
      name: "Licencia VTC",
      description: "Copia de tu licencia VTC vigente",
      required: true,
      file: null,
      uploaded: false,
    },
    {
      id: "car_insurance",
      name: "Seguro del Vehículo",
      description: "Póliza de seguro del vehículo actualizada",
      required: true,
      file: null,
      uploaded: false,
    },
    {
      id: "driving_license",
      name: "Permiso de Conducir",
      description: "Copia del permiso de conducir profesional",
      required: true,
      file: null,
      uploaded: false,
    },
    {
      id: "vehicle_registration",
      name: "Permiso de Circulación",
      description: "Documentación del vehículo",
      required: true,
      file: null,
      uploaded: false,
    },
    {
      id: "itv_certificate",
      name: "Certificado ITV",
      description: "Inspección técnica del vehículo vigente",
      required: true,
      file: null,
      uploaded: false,
    },
    {
      id: "criminal_record",
      name: "Certificado de Antecedentes Penales",
      description: "Certificado expedido en los últimos 3 meses",
      required: true,
      file: null,
      uploaded: false,
    },
  ]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-ocean" />
              </div>
              <CardTitle className="text-2xl font-bold text-navy mb-2">
                Sign In Required
              </CardTitle>
              <p className="text-gray-600">
                Please sign in to your account to apply as a driver
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/signin?redirect=driver-registration" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup?redirect=driver-registration" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-ocean text-ocean hover:bg-ocean hover:text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, file, uploaded: true }
          : doc
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToDriverTerms) {
      alert("Please agree to the driver terms and conditions");
      return;
    }

    const requiredDocs = documents.filter(doc => doc.required);
    const uploadedDocs = requiredDocs.filter(doc => doc.uploaded);

    if (uploadedDocs.length < requiredDocs.length) {
      alert("Please upload all required documents");
      return;
    }

    setIsLoading(true);

    try {
      // Mock submission - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user status to pending driver approval
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...currentUser,
        driverStatus: "pending",
        driverApplication: {
          ...formData,
          documents: documents.filter(doc => doc.uploaded),
          submittedAt: new Date().toISOString(),
        },
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert(
        "¡Solicitud enviada con éxito! Tu solicitud para ser conductor está pendiente de aprobación por un administrador. Recibirás un email cuando sea revisada."
      );
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Driver registration failed:", error);
      alert("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const allRequiredUploaded = documents
    .filter(doc => doc.required)
    .every(doc => doc.uploaded);

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
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-navy">
            Solicitud para ser Conductor
          </h1>
          <p className="text-gray-600 mt-2">
            Completa tu solicitud para unirte a nuestro equipo de conductores profesionales
          </p>
        </div>

        {/* User Info Display */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-ocean" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                  {user?.name || "N/A"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                  {user?.email || "N/A"}
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Información importante:</p>
                  <p>Tu información personal ya está registrada. Solo necesitas completar los datos del vehículo y subir la documentación requerida.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          {/* Vehicle Information */}
          <Card className="mb-8 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="w-5 h-5 text-ocean" />
                Información del Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de Vehículo
                  </label>
                  <Input
                    placeholder="ej. Sedan, SUV, Van"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Marca
                  </label>
                  <Input
                    placeholder="ej. Mercedes, BMW, Audi"
                    value={formData.vehicleMake}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleMake: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <Input
                    placeholder="ej. Clase E, Serie 5"
                    value={formData.vehicleModel}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleModel: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Año
                  </label>
                  <Input
                    type="number"
                    placeholder="ej. 2020"
                    min="2010"
                    max={new Date().getFullYear()}
                    value={formData.vehicleYear}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleYear: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Matrícula
                  </label>
                  <Input
                    placeholder="ej. 1234 ABC"
                    value={formData.vehiclePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, vehiclePlate: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <Input
                    placeholder="ej. Negro, Blanco, Plata"
                    value={formData.vehicleColor}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleColor: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="mb-8 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-ocean" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    IBAN Cuenta Bancaria
                  </label>
                  <Input
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    value={formData.bankAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, bankAccount: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    NIF/CIF
                  </label>
                  <Input
                    placeholder="12345678A"
                    value={formData.taxId}
                    onChange={(e) =>
                      setFormData({ ...formData, taxId: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="mb-8 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-ocean" />
                Documentación Requerida
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Sube todos los documentos requeridos. Los archivos deben estar en formato PDF, JPG o PNG.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-ocean/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          {doc.name}
                          {doc.required && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                              Obligatorio
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {doc.description}
                        </p>
                      </div>
                      <div className="ml-3">
                        {doc.uploaded ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(doc.id, file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          doc.uploaded
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 hover:border-ocean"
                        }`}>
                          <UploadIcon className={`w-8 h-8 mx-auto mb-2 ${
                            doc.uploaded ? "text-green-500" : "text-gray-400"
                          }`} />
                          <p className={`text-sm ${
                            doc.uploaded ? "text-green-700" : "text-gray-600"
                          }`}>
                            {doc.uploaded
                              ? `Archivo subido: ${doc.file?.name}`
                              : "Click para subir archivo"
                            }
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="driverTerms"
                    checked={formData.agreeToDriverTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreeToDriverTerms: checked as boolean,
                      })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="driverTerms" className="text-sm text-gray-600">
                    Acepto los{" "}
                    <Link
                      to="/driver-terms"
                      className="text-ocean hover:text-coral underline"
                    >
                      Términos y Condiciones para Conductores
                    </Link>{" "}
                    y entiendo que mi solicitud será revisada por un administrador antes de ser aprobada.
                  </label>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <InfoIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Proceso de Aprobación:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Tu solicitud será revisada por nuestro equipo</li>
                        <li>El proceso puede tomar 2-5 días laborables</li>
                        <li>Recibirás un email con el resultado</li>
                        <li>Una vez aprobado, podrás comenzar a recibir solicitudes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !allRequiredUploaded || !formData.agreeToDriverTerms}
                  className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-3 h-12"
                >
                  {isLoading ? "Enviando Solicitud..." : "Enviar Solicitud para ser Conductor"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar esta solicitud, nuestro equipo revisará tu perfil y documentación.
                  Te contactaremos en un plazo máximo de 5 días laborables.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
