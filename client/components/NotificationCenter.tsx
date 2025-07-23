import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BellIcon,
  XIcon,
  CheckIcon,
  InfoIcon,
  AlertTriangleIcon,
  CarIcon,
  ClockIcon,
  CreditCardIcon,
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  userRole: string;
}

export default function NotificationCenter({ userRole }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Generate role-specific notifications
    const baseNotifications: Notification[] = [];
    
    if (userRole === "client") {
      return [
        {
          id: "1",
          type: "success",
          title: "Reserva Confirmada",
          message: "Tu traslado para mañana a las 14:30 está confirmado",
          timestamp: "Hace 5 minutos",
          read: false,
        },
        {
          id: "2",
          type: "info",
          title: "Conductor Asignado",
          message: "Carlos Rodríguez será tu conductor. Rating: 4.9/5",
          timestamp: "Hace 15 minutos",
          read: false,
        },
        {
          id: "3",
          type: "warning",
          title: "Recordatorio de Pago",
          message: "Tienes un pago pendiente de €35 por tu último viaje",
          timestamp: "Hace 2 horas",
          read: true,
        },
      ];
    }
    
    if (userRole === "driver") {
      return [
        {
          id: "1",
          type: "info",
          title: "Nuevo Traslado Disponible",
          message: "Aeropuerto → Hotel Majestic, €35 - ¿Aceptas?",
          timestamp: "Hace 2 minutos",
          read: false,
        },
        {
          id: "2",
          type: "success",
          title: "Pago Recibido",
          message: "Has recibido €105 por tus servicios de hoy",
          timestamp: "Hace 1 hora",
          read: false,
        },
        {
          id: "3",
          type: "warning",
          title: "Documentación",
          message: "Tu licencia de conducir caduca en 30 días",
          timestamp: "Hace 3 horas",
          read: true,
        },
      ];
    }
    
    if (userRole === "fleet-manager") {
      return [
        {
          id: "1",
          type: "warning",
          title: "Conductor No Disponible",
          message: "Miguel Torres reportó enfermedad para hoy",
          timestamp: "Hace 10 minutos",
          read: false,
        },
        {
          id: "2",
          type: "info",
          title: "Nuevo Conductor",
          message: "Ana Fernández completó su registro exitosamente",
          timestamp: "Hace 1 hora",
          read: false,
        },
        {
          id: "3",
          type: "success",
          title: "Meta Alcanzada",
          message: "Tu flota completó 50 viajes esta semana",
          timestamp: "Hace 4 horas",
          read: true,
        },
      ];
    }
    
    if (userRole === "admin") {
      return [
        {
          id: "1",
          type: "warning",
          title: "Solicitud Pendiente",
          message: "3 nuevas solicitudes de conductor requieren aprobación",
          timestamp: "Hace 5 minutos",
          read: false,
        },
        {
          id: "2",
          type: "error",
          title: "Disputa Reportada",
          message: "Cliente reportó problema con reserva #TM123456",
          timestamp: "Hace 30 minutos",
          read: false,
        },
        {
          id: "3",
          type: "info",
          title: "Reporte Semanal",
          message: "Estadísticas del sistema disponibles para descarga",
          timestamp: "Hace 2 horas",
          read: true,
        },
      ];
    }
    
    if (userRole === "business") {
      return [
        {
          id: "1",
          type: "success",
          title: "Traslado Completado",
          message: "Sr. Johnson llegó exitosamente al hotel",
          timestamp: "Hace 15 minutos",
          read: false,
        },
        {
          id: "2",
          type: "info",
          title: "Factura Generada",
          message: "Factura mensual de Diciembre disponible",
          timestamp: "Hace 1 hora",
          read: false,
        },
        {
          id: "3",
          type: "warning",
          title: "Reserva Cancelada",
          message: "El cliente canceló la reserva para mañana",
          timestamp: "Hace 3 horas",
          read: true,
        },
      ];
    }
    
    return baseNotifications;
  });

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XIcon className="w-4 h-4 text-red-500" />;
      default:
        return <InfoIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 z-50">
            <Card className="shadow-xl border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notificaciones</CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Marcar todas
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <BellIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          getNotificationColor(notification.type)
                        } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getNotificationIcon(notification.type)}
                            <h4 className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-ocean rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                            >
                              Ver más
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
