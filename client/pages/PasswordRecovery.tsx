import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CarIcon,
  MailIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LockIcon,
} from "lucide-react";

interface PasswordRecoveryState {
  step: "email" | "sent" | "reset" | "success";
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  error: string;
}

export default function PasswordRecovery() {
  const { t } = useLanguage();
  const [state, setState] = useState<PasswordRecoveryState>({
    step: "email",
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
    error: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate sending recovery email
      console.log(`Password recovery email sent to: ${state.email}`);
      
      // In a real app, you would call your API here:
      // await authService.requestPasswordReset(state.email);
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        step: "sent" 
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Error al enviar el email de recuperación. Inténtalo de nuevo." 
      }));
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.newPassword !== state.confirmPassword) {
      setState(prev => ({ 
        ...prev, 
        error: t("auth.passwordMismatch") 
      }));
      return;
    }

    if (state.newPassword.length < 6) {
      setState(prev => ({ 
        ...prev, 
        error: t("auth.passwordTooShort") 
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here:
      // await authService.resetPassword(state.token, state.newPassword);
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        step: "success" 
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Error al restablecer la contraseña. El enlace puede haber expirado." 
      }));
    }
  };

  const resendEmail = async () => {
    setState(prev => ({ ...prev, loading: true, error: "" }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Recovery email resent to: ${state.email}`);
      
      setState(prev => ({ ...prev, loading: false }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Error al reenviar el email." 
      }));
    }
  };

  // Check if we have a reset token in URL (for password reset flow)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    
    if (token && email) {
      setState(prev => ({ 
        ...prev, 
        step: "reset", 
        token, 
        email: decodeURIComponent(email) 
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-ocean rounded-lg flex items-center justify-center">
            <LockIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-navy">
            {state.step === "email" && t("auth.resetPassword")}
            {state.step === "sent" && "Email Enviado"}
            {state.step === "reset" && "Nueva Contraseña"}
            {state.step === "success" && "¡Contraseña Restablecida!"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {state.step === "email" && "Introduce tu email para recibir un enlace de recuperación"}
            {state.step === "sent" && "Revisa tu bandeja de entrada"}
            {state.step === "reset" && "Introduce tu nueva contraseña"}
            {state.step === "success" && "Tu contraseña ha sido actualizada exitosamente"}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {state.error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircleIcon className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {state.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: Email Input */}
            {state.step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={state.email}
                      onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t("auth.enterEmail")}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ocean text-white hover:bg-ocean/90"
                  disabled={state.loading || !state.email}
                >
                  {state.loading ? "Enviando..." : t("auth.sendResetLink")}
                </Button>
              </form>
            )}

            {/* Step 2: Email Sent Confirmation */}
            {state.step === "sent" && (
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email Enviado
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Hemos enviado un enlace de recuperación a:
                  </p>
                  <p className="text-sm font-medium text-ocean mb-4">
                    {state.email}
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    El enlace expira en 1 hora. Si no ves el email, revisa tu carpeta de spam.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={resendEmail}
                    variant="outline"
                    className="w-full"
                    disabled={state.loading}
                  >
                    {state.loading ? "Reenviando..." : "Reenviar Email"}
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    ¿Recuerdas tu contraseña?{" "}
                    <Link to="/signin" className="text-ocean hover:underline">
                      Volver al inicio de sesión
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Password Reset Form */}
            {state.step === "reset" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    Restablecer contraseña para: <strong>{state.email}</strong>
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={state.newPassword}
                      onChange={(e) => setState(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={state.confirmPassword}
                      onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirma tu nueva contraseña"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-ocean text-white hover:bg-ocean/90"
                    disabled={state.loading || !state.newPassword || !state.confirmPassword}
                  >
                    {state.loading ? "Restableciendo..." : "Restablecer Contraseña"}
                  </Button>
                </form>
              </div>
            )}

            {/* Step 4: Success */}
            {state.step === "success" && (
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Contraseña Restablecida!
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesi��n con tu nueva contraseña.
                  </p>
                </div>

                <Link to="/signin">
                  <Button className="w-full bg-ocean text-white hover:bg-ocean/90">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to sign in link */}
        {(state.step === "email" || state.step === "reset") && (
          <div className="text-center">
            <Link 
              to="/signin" 
              className="inline-flex items-center text-sm text-ocean hover:text-ocean/80 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t("auth.backToSignIn")}
            </Link>
          </div>
        )}

        {/* Transfermarbell branding */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-ocean transition-colors">
            <div className="w-6 h-6 bg-ocean rounded flex items-center justify-center">
              <CarIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">Transfermarbell</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
