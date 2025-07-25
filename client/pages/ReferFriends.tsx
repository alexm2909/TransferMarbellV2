import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import {
  CarIcon,
  ArrowLeftIcon,
  UsersIcon,
  GiftIcon,
  ShareIcon,
  CopyIcon,
  CheckIcon,
  MailIcon,
  MessageSquareIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  StarIcon,
  EuroIcon,
} from "lucide-react";

export default function ReferFriends() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Generate user referral code
  const referralCode = user?.email ? `TM${user.email.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}` : "TM001";
  const referralLink = `https://transfermarbell.com/signup?ref=${referralCode}`;

  // Mock referral stats
  const referralStats = {
    totalReferrals: 3,
    successfulReferrals: 2,
    pendingReferrals: 1,
    totalEarned: 30,
    availableCredit: 20,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate sending email
    setEmailSent(true);
    setEmail("");
    setTimeout(() => setEmailSent(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const message = `¡Hola! Te invito a usar Transfermarbell para tus traslados. Es súper cómodo y fiable. Usa mi código ${referralCode} y obtén €10 de descuento en tu primera reserva: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Te invito a usar Transfermarbell - €10 de descuento");
    const body = encodeURIComponent(`¡Hola!

Te quiero recomendar Transfermarbell, un servicio de traslados privados que uso y me encanta.

🚗 Conductores profesionales
⭐ Excelente servicio
💰 Precios transparentes
📱 Fácil de usar

Usa mi código de referido: ${referralCode}
Y obtén €10 de descuento en tu primera reserva.

Regístrate aquí: ${referralLink}

¡Espero que te guste tanto como a mí!

Saludos,
${user?.name || 'Tu amigo'}`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareViaTwitter = () => {
    const tweetText = `¡Descubre Transfermarbell! Traslados privados cómodos y fiables. Usa mi código ${referralCode} para €10 de descuento:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralLink)}`;
    window.open(twitterUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="border-ocean text-ocean">
                Programa de Referidos
              </Badge>
              {user && (
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  {user.name}
                </Badge>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <UserMenu />
            </div>
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
            Volver al Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-ocean to-coral rounded-full flex items-center justify-center mx-auto mb-6">
            <GiftIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            Refiere Amigos y Gana
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comparte Transfermarbell con tus amigos y ambos obtienen €10 de descuento. 
            ¡Es fácil y todos ganamos!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* How it works */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-ocean" />
                  ¿Cómo Funciona?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Comparte tu enlace</h3>
                      <p className="text-gray-600 text-sm">Envía tu enlace único de referido a tus amigos por WhatsApp, email o redes sociales.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Tu amigo se registra</h3>
                      <p className="text-gray-600 text-sm">Cuando tu amigo se registre con tu código, obtendrá €10 de descuento en su primera reserva.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Ambos ganáis</h3>
                      <p className="text-gray-600 text-sm">Después de su primera reserva, tú también recibes €10 de crédito para usar en futuros viajes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Methods */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShareIcon className="w-5 h-5 text-ocean" />
                  Comparte tu Enlace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Referral Link */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tu Enlace de Referido
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className={`w-full sm:w-auto ${isCopied ? "border-green-500 text-green-600" : ""}`}
                    >
                      {isCopied ? <CheckIcon className="w-4 h-4 mr-2 sm:mr-0" /> : <CopyIcon className="w-4 h-4 mr-2 sm:mr-0" />}
                      <span className="sm:hidden">{isCopied ? "Copiado" : "Copiar"}</span>
                    </Button>
                  </div>
                  {isCopied && (
                    <p className="text-sm text-green-600 mt-1">¡Enlace copiado al portapapeles!</p>
                  )}
                </div>

                {/* Email Invite */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Invitar por Email
                  </label>
                  <form onSubmit={handleEmailInvite} className="flex items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!email}>
                      <MailIcon className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                  </form>
                  {emailSent && (
                    <p className="text-sm text-green-600 mt-1">¡Invitación enviada exitosamente!</p>
                  )}
                </div>

                {/* Social Sharing */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Compartir en Redes Sociales
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      onClick={shareViaWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageSquareIcon className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={shareViaEmail}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MailIcon className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      onClick={shareViaFacebook}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      <FacebookIcon className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      onClick={shareViaTwitter}
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      <TwitterIcon className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Stats */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-ocean" />
                  Tus Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-ocean-light/20 rounded-lg">
                  <div className="text-2xl font-bold text-ocean">{referralStats.totalReferrals}</div>
                  <div className="text-sm text-gray-600">Amigos Referidos</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{referralStats.successfulReferrals}</div>
                    <div className="text-xs text-gray-600">Exitosos</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{referralStats.pendingReferrals}</div>
                    <div className="text-xs text-gray-600">Pendientes</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-ocean-light to-coral-light rounded-lg">
                  <div className="text-2xl font-bold text-ocean mb-1">€{referralStats.availableCredit}</div>
                  <div className="text-sm text-gray-700">Crédito Disponible</div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Total ganado: €{referralStats.totalEarned}
                </div>
              </CardContent>
            </Card>

            {/* Referral Code */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Tu Código</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-gradient-to-br from-ocean to-coral rounded-lg text-white">
                  <div className="text-3xl font-bold mb-2">{referralCode}</div>
                  <div className="text-sm opacity-90">Comparte este código con tus amigos</div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm">Términos y Condiciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-600 space-y-2">
                  <p>• €10 de descuento para nuevos usuarios en su primera reserva</p>
                  <p>• €10 de crédito para ti después de que tu amigo complete su primer viaje</p>
                  <p>• El crédito no caduca y se puede usar en cualquier reserva</p>
                  <p>• Un referido por persona</p>
                  <p>• Los empleados de Transfermarbell no pueden participar</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
