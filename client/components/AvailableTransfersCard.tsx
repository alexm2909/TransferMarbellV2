import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAvailableBookings, useEmergencyBookings } from "@/hooks/useDatabase";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  LuggageIcon,
  CarIcon,
  PhoneIcon,
  CheckIcon,
  XIcon,
  MoreHorizontalIcon,
} from "lucide-react";

export default function AvailableTransfersCard() {
  const { t, formatCurrency } = useLanguage();
  const { user } = useAuth();
  const [processingTrips, setProcessingTrips] = useState<string[]>([]);
  const { availableBookings } = useAvailableBookings();
  const { emergencyBookings } = useEmergencyBookings();

  const recentTrips = availableBookings.slice(0, 3);
  const totalCount = availableBookings.length;

  const handleAcceptTrip = async (bookingId: string) => {
    if (!user) return;

    setProcessingTrips(prev => [...prev, bookingId]);

    // Simulate API call delay
    setTimeout(() => {
      // This would call the database to assign the booking
      // For now we'll just simulate the processing
      setProcessingTrips(prev => prev.filter(id => id !== bookingId));
    }, 1000);
  };

  const handleRejectTrip = async (bookingId: string) => {
    setProcessingTrips(prev => [...prev, bookingId]);

    // Simulate API call delay
    setTimeout(() => {
      // This could mark the booking as rejected by this driver
      setProcessingTrips(prev => prev.filter(id => id !== bookingId));
    }, 500);
  };

  const getVehicleIcon = (type: string) => {
    const vehicles = {
      economy: "🚗",
      comfort: "🚙", 
      premium: "🚗",
      van: "🚐",
      luxury: "🏎️",
    };
    return vehicles[type as keyof typeof vehicles] || "🚗";
  };

  if (recentTrips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CarIcon className="w-5 h-5 text-ocean" />
              <span>{t('available_transfers')}</span>
            </div>
            <Badge variant="outline" className="text-ocean border-ocean">
              {totalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No hay traslados disponibles</p>
            <p className="text-sm">Los nuevos traslados aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CarIcon className="w-5 h-5 text-ocean" />
            <span>{t('available_transfers')}</span>
          </div>
          <Badge variant="outline" className="text-ocean border-ocean">
            {t('total_available')}: {totalCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTrips.map((booking) => {
          const isProcessing = processingTrips.includes(booking.id);

          // Normalize booking fields from Booking model
          const clientName = booking.clientData?.name || 'Cliente';
          const clientPhone = booking.clientData?.phone || '';
          const estimatedPrice = booking.pricing?.totalPrice ?? 0;
          const distance = booking.tripDetails?.origin?.address && booking.tripDetails?.destination?.address ? null : null; // distance not stored explicitly
          const duration = null;
          const origin = booking.tripDetails?.origin?.address || booking.clientData?.address || 'Origen';
          const destination = booking.tripDetails?.destination?.address || 'Destino';
          const date = booking.tripDetails?.date || booking.timeline?.createdAt?.split('T')[0] || '';
          const time = booking.tripDetails?.time || '';
          const passengers = booking.tripDetails?.passengers ?? 1;
          const children = booking.tripDetails?.children?.count ?? 0;
          const vehicleType = booking.vehicleType || 'economy';
          const specialRequests = booking.tripDetails?.specialRequests || booking.tripDetails?.specialRequests || '';

          return (
            <div
              key={booking.id}
              className="border rounded-lg p-4 bg-gradient-to-r from-ocean-light/10 to-coral-light/10 dark:from-ocean-light/5 dark:to-coral-light/5 hover:shadow-md transition-shadow"
            >
              {/* Header with client info and price */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-ocean to-coral rounded-full flex items-center justify-center text-white font-bold">
                    {clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {clientName}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <PhoneIcon className="w-3 h-3" />
                      <span>{clientPhone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(estimatedPrice)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {distance && `${distance} • ${duration}`}
                  </div>
                </div>
              </div>

              {/* Route information */}
              <div className="space-y-2 mb-3">
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {origin}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip details */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-3 h-3" />
                  <span>{passengers} {children > 0 && `+${children} niños`}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{getVehicleIcon(vehicleType)}</span>
                  <span className="capitalize">{vehicleType}</span>
                </div>
              </div>

              {/* Special requests */}
              {specialRequests && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                  <strong>Requisitos especiales:</strong> {specialRequests}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAcceptTrip(booking.id)}
                  disabled={isProcessing}
                  className="flex-1 bg-success hover:bg-success/90 text-white"
                  size="sm"
                >
                  {isProcessing ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {t('accept')}
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleRejectTrip(booking.id)}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  size="sm"
                >
                  {isProcessing ? (
                    <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <XIcon className="w-4 h-4 mr-2" />
                      {t('reject')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {/* Show more indicator if there are more trips */}
        {totalCount > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-ocean hover:text-ocean/80">
              <MoreHorizontalIcon className="w-4 h-4 mr-2" />
              Ver {totalCount - 3} traslados más
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
