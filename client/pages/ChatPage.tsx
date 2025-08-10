import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Chat from "@/components/Chat";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeftIcon, CarIcon } from "lucide-react";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const tripId = searchParams.get("transfer") || "TM123456";
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent hidden sm:block">
                Transfermarbell
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent sm:hidden">
                TM
              </span>
            </Link>

            <div className="flex items-center space-x-2 flex-shrink-0">
              {user?.role === "driver" ? (
                <Link to="/driver-panel">
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    <ArrowLeftIcon className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Volver al Panel</span>
                    <span className="sm:hidden">Panel</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/">
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    <ArrowLeftIcon className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Volver al Inicio</span>
                    <span className="sm:hidden">Inicio</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {user?.role === "driver"
              ? "Chat con el Cliente"
              : "Chat con tu Conductor"}
          </h1>
          <p className="text-gray-600">
            {user?.role === "driver"
              ? "Mantente en contacto con tu cliente durante el viaje"
              : "Mantente en contacto con tu conductor en tiempo real"}
          </p>
        </div>

        <div className="h-[600px]">
          <Chat
            tripId={tripId}
            driverName="Carlos Rodríguez"
            driverPhone="+34 600 123 456"
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
}
