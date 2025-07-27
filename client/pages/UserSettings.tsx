import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  ArrowLeftIcon,
  SettingsIcon,
  UserIcon,
  GlobeIcon,
  CreditCardIcon,
  BellIcon,
  ShieldIcon,
  EyeIcon,
  PhoneIcon,
  MailIcon,
  SaveIcon,
} from "lucide-react";

export default function UserSettings() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { language, currency, setLanguage, setCurrency, formatCurrency } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      shareLocation: true,
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Settings saved:", formData);
    // Show success message
  };

  const languageOptions = [
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const currencyOptions = [
    { value: "EUR", label: "Euro (€)", symbol: "€" },
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "GBP", label: "British Pound (£)", symbol: "£" },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center flex-shrink-0">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent truncate">
                Transfermarbell
              </span>
            </Link>

            {/* Desktop and Mobile Navigation */}
            <div className="flex items-center space-x-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-ocean hover:text-coral transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-ocean" />
            <h1 className="text-3xl font-bold text-navy">Configuración</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Personaliza tu experiencia en Transfermarbell
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language and Currency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GlobeIcon className="w-5 h-5" />
                <span>Idioma y Moneda</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          <div className="flex items-center space-x-2">
                            <span>{curr.symbol}</span>
                            <span>{curr.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border">
                <p className="text-sm text-blue-800">
                  <strong>Vista previa:</strong> Los precios se mostrarán como {formatCurrency(45.50)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BellIcon className="w-5 h-5" />
                <span>Notificaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-gray-500">
                    Recibe confirmaciones y actualizaciones por correo
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones Push</Label>
                  <p className="text-sm text-gray-500">
                    Recibe actualizaciones en tiempo real en tu dispositivo
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS</Label>
                  <p className="text-sm text-gray-500">
                    Recibe notificaciones importantes por mensaje de texto
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldIcon className="w-5 h-5" />
                <span>Privacidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Perfil Visible</Label>
                  <p className="text-sm text-gray-500">
                    Permite que conductores vean tu información básica
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.profileVisible}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisible: checked }
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compartir Ubicación</Label>
                  <p className="text-sm text-gray-500">
                    Comparte tu ubicación para mejorar el servicio
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.shareLocation}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, shareLocation: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-ocean hover:bg-ocean/90">
              <SaveIcon className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
