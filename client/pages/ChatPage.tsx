import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Chat from "@/components/Chat";
import { ArrowLeftIcon, CarIcon } from "lucide-react";

export default function ChatPage() {
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
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-navy mb-2">Chat con tu Conductor</h1>
          <p className="text-gray-600">
            Mantente en contacto con tu conductor en tiempo real
          </p>
        </div>

        <div className="h-[600px]">
          <Chat 
            tripId="TM123456"
            driverName="Carlos Rodríguez"
            driverPhone="+34 600 123 456"
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
}
