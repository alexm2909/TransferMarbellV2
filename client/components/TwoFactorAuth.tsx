import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ShieldCheckIcon,
  MailIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  KeyIcon,
  LockIcon,
} from "lucide-react";

interface TwoFactorState {
  isEnabled: boolean;
  isVerifying: boolean;
  email: string;
  verificationCode: string;
  loading: boolean;
  error: string;
  success: string;
  timeRemaining: number;
  canResend: boolean;
  lastSentAt: string | null;
}

interface TwoFactorAuthProps {
  userEmail: string;
  onVerificationComplete?: (success: boolean) => void;
  mode?: "setup" | "verify" | "login";
  required?: boolean;
}

export default function TwoFactorAuth({
  userEmail,
  onVerificationComplete,
  mode = "setup",
  required = false,
}: TwoFactorAuthProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<TwoFactorState>({
    isEnabled: false,
    isVerifying: false,
    email: userEmail,
    verificationCode: "",
    loading: false,
    error: "",
    success: "",
    timeRemaining: 0,
    canResend: true,
    lastSentAt: null,
  });

  // Timer for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            return { ...prev, timeRemaining: 0, canResend: true };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.timeRemaining]);

  // Load 2FA status from localStorage (simulate API)
  useEffect(() => {
    const twoFactorStatus = localStorage.getItem(`transfermarbell_2fa_${userEmail}`);
    if (twoFactorStatus === "enabled") {
      setState(prev => ({ ...prev, isEnabled: true }));
    }
  }, [userEmail]);

  const sendVerificationCode = async () => {
    setState(prev => ({ ...prev, loading: true, error: "", success: "" }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock verification code (in real app, server generates this)
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`2FA Code sent to ${state.email}: ${mockCode}`);
      
      // Store the code for demo purposes (in real app, server stores this)
      sessionStorage.setItem(`transfermarbell_2fa_code_${state.email}`, mockCode);
      sessionStorage.setItem(`transfermarbell_2fa_expires_${state.email}`, (Date.now() + 5 * 60 * 1000).toString());
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: "Código de verificación enviado a tu email",
        isVerifying: true,
        timeRemaining: 60, // 60 second cooldown
        canResend: false,
        lastSentAt: new Date().toISOString(),
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Error al enviar el código de verificación",
      }));
    }
  };

  const verifyCode = async () => {
    if (state.verificationCode.length !== 6) {
      setState(prev => ({ ...prev, error: "El código debe tener 6 dígitos" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check stored code (simulate server verification)
      const storedCode = sessionStorage.getItem(`transfermarbell_2fa_code_${state.email}`);
      const expiresAt = sessionStorage.getItem(`transfermarbell_2fa_expires_${state.email}`);
      
      if (!storedCode || !expiresAt) {
        throw new Error("Código no encontrado o expirado");
      }
      
      if (Date.now() > parseInt(expiresAt)) {
        throw new Error("El código ha expirado");
      }
      
      if (state.verificationCode !== storedCode) {
        throw new Error("Código incorrecto");
      }
      
      // Verification successful
      if (mode === "setup") {
        // Enable 2FA
        localStorage.setItem(`transfermarbell_2fa_${userEmail}`, "enabled");
        setState(prev => ({
          ...prev,
          loading: false,
          isEnabled: true,
          success: "¡Autenticación de dos factores activada exitosamente!",
          isVerifying: false,
          verificationCode: "",
        }));
      } else {
        // Verification for login
        setState(prev => ({
          ...prev,
          loading: false,
          success: "Verificación exitosa",
        }));
      }
      
      // Clean up stored code
      sessionStorage.removeItem(`transfermarbell_2fa_code_${state.email}`);
      sessionStorage.removeItem(`transfermarbell_2fa_expires_${state.email}`);
      
      // Notify parent component
      onVerificationComplete?.(true);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message || "Error en la verificación",
      }));
      
      onVerificationComplete?.(false);
    }
  };

  const disable2FA = async () => {
    if (!confirm("¿Estás seguro de que quieres desactivar la autenticación de dos factores?")) {
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove 2FA status
      localStorage.removeItem(`transfermarbell_2fa_${userEmail}`);
      
      setState(prev => ({
        ...prev,
        loading: false,
        isEnabled: false,
        success: "Autenticación de dos factores desactivada",
        isVerifying: false,
        verificationCode: "",
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Error al desactivar 2FA",
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === "login" && !state.isEnabled) {
    // Skip 2FA if not enabled for this user
    useEffect(() => {
      onVerificationComplete?.(true);
    }, []);
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-xl">
          {mode === "setup" && "Autenticación de Dos Factores"}
          {mode === "verify" && "Verificar Email"}
          {mode === "login" && "Verificación Requerida"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {mode === "setup" && "Añade una capa extra de seguridad a tu cuenta"}
          {mode === "verify" && "Verifica tu dirección de email"}
          {mode === "login" && "Introduce el código enviado a tu email"}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {state.error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {state.success}
            </AlertDescription>
          </Alert>
        )}

        {/* Setup Mode - 2FA Status */}
        {mode === "setup" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Verificación por Email</p>
                  <p className="text-xs text-gray-500">{state.email}</p>
                </div>
              </div>
              <Badge 
                className={state.isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {state.isEnabled ? "Activado" : "Desactivado"}
              </Badge>
            </div>

            {!state.isEnabled ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Cuando esté activado, recibirás un código de verificación por email cada vez que inicies sesión desde un dispositivo nuevo.
                </p>
                
                {!state.isVerifying ? (
                  <Button
                    onClick={sendVerificationCode}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={state.loading}
                  >
                    {state.loading ? "Enviando..." : "Activar 2FA"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de Verificación
                      </label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          value={state.verificationCode}
                          onChange={(e) => setState(prev => ({ 
                            ...prev, 
                            verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                            error: ""
                          }))}
                          placeholder="123456"
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Introduce el código de 6 dígitos enviado a tu email
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={verifyCode}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={state.loading || state.verificationCode.length !== 6}
                      >
                        {state.loading ? "Verificando..." : "Verificar"}
                      </Button>
                      
                      <Button
                        onClick={sendVerificationCode}
                        variant="outline"
                        disabled={state.loading || !state.canResend}
                        className="flex items-center space-x-2"
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                        {!state.canResend && (
                          <span className="text-xs">
                            {formatTime(state.timeRemaining)}
                          </span>
                        )}
                        {state.canResend && <span className="text-xs">Reenviar</span>}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Autenticación de dos factores activada</span>
                </div>
                
                <Button
                  onClick={disable2FA}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  disabled={state.loading}
                >
                  {state.loading ? "Desactivando..." : "Desactivar 2FA"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Verify/Login Mode */}
        {(mode === "verify" || mode === "login") && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MailIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Hemos enviado un código de verificación a:
              </p>
              <p className="text-sm font-medium text-ocean mb-6">
                {state.email}
              </p>
            </div>

            {!state.isVerifying ? (
              <Button
                onClick={sendVerificationCode}
                className="w-full bg-ocean text-white hover:bg-ocean/90"
                disabled={state.loading}
              >
                {state.loading ? "Enviando..." : "Enviar Código"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Verificación
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={state.verificationCode}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                        error: ""
                      }))}
                      placeholder="123456"
                      className="pl-10 text-center text-lg tracking-widest"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={verifyCode}
                    className="flex-1 bg-ocean text-white hover:bg-ocean/90"
                    disabled={state.loading || state.verificationCode.length !== 6}
                  >
                    {state.loading ? "Verificando..." : "Verificar"}
                  </Button>
                  
                  <Button
                    onClick={sendVerificationCode}
                    variant="outline"
                    disabled={state.loading || !state.canResend}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                    {!state.canResend && (
                      <span className="text-xs">{formatTime(state.timeRemaining)}</span>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    El código expira en 5 minutos. Si no lo recibes, revisa tu carpeta de spam.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Security Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <LockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Tu Seguridad es Importante
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                La autenticación de dos factores protege tu cuenta incluso si alguien conoce tu contraseña.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 2FA Setup Dialog Component
export function TwoFactorSetupDialog({ 
  userEmail, 
  children 
}: { 
  userEmail: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Autenticación de Dos Factores</DialogTitle>
        </DialogHeader>
        <TwoFactorAuth
          userEmail={userEmail}
          mode="setup"
          onVerificationComplete={(success) => {
            if (success) {
              setTimeout(() => setOpen(false), 2000);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
