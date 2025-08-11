import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSystemStats } from "@/hooks/useDatabase";
import { database } from "@/services/database";
import { DatabaseIcon, CheckCircleIcon, Activity } from "lucide-react";

export default function DatabaseStatus() {
  const { stats } = useSystemStats();
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Subscribe to database changes to show activity
    const unsubscribers = [
      database.subscribe('users', () => setLastUpdate(new Date())),
      database.subscribe('bookings', () => setLastUpdate(new Date())),
      database.subscribe('notifications', () => setLastUpdate(new Date())),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <DatabaseIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Base de Datos</span>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Conectada
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-green-700">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{stats?.totalUsers || 0} usuarios</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{stats?.totalBookings || 0} reservas</span>
            </div>
            <div className="text-xs text-green-600">
              Última actividad: {lastUpdate.toLocaleTimeString('es-ES')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
