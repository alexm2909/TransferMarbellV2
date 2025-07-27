import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, UserIcon, CarIcon } from "lucide-react";

interface ServiceRatingProps {
  bookingId: string;
  userRole: "client" | "driver";
  targetName?: string; // Driver name for clients, client name for drivers
  targetPhone?: string;
  vehicleInfo?: string;
  onSubmitRating: (rating: {
    bookingId: string;
    stars: number;
    comment: string;
    aspects: {
      punctuality: number;
      vehicle: number;
      service: number;
      communication: number;
    };
  }) => void;
  existingRating?: {
    stars: number;
    comment: string;
    aspects: {
      punctuality: number;
      vehicle: number;
      service: number;
      communication: number;
    };
  };
}

export default function ServiceRating({
  bookingId,
  userRole,
  targetName,
  targetPhone,
  vehicleInfo,
  onSubmitRating,
  existingRating,
}: ServiceRatingProps) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(existingRating?.stars || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [aspects, setAspects] = useState({
    punctuality: existingRating?.aspects.punctuality || 0,
    vehicle: existingRating?.aspects.vehicle || 0,
    service: existingRating?.aspects.service || 0,
    communication: existingRating?.aspects.communication || 0,
  });

  const handleSubmit = () => {
    if (stars === 0) return;

    onSubmitRating({
      bookingId,
      stars,
      comment,
      aspects,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setStars(0);
    setComment("");
    setAspects({
      punctuality: 0,
      vehicle: 0,
      service: 0,
      communication: 0,
    });
  };

  const renderStars = (rating: number, onChange: (value: number) => void, size: "sm" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "w-8 h-8" : "w-5 h-5";
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`${sizeClass} transition-colors hover:scale-110 transform ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <StarIcon className={`${sizeClass} fill-current`} />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return "Sin calificar";
    if (rating === 1) return "Muy malo";
    if (rating === 2) return "Malo";
    if (rating === 3) return "Regular";
    if (rating === 4) return "Bueno";
    if (rating === 5) return "Excelente";
    return "";
  };

  const getAspectLabels = () => {
    if (userRole === "client") {
      return {
        punctuality: "Puntualidad",
        vehicle: "Estado del Vehículo",
        service: "Calidad del Servicio",
        communication: "Comunicación",
      };
    } else {
      return {
        punctuality: "Puntualidad del Cliente",
        vehicle: "Cuidado del Vehículo",
        service: "Facilidad del Servicio",
        communication: "Comunicación",
      };
    }
  };

  const aspectLabels = getAspectLabels();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingRating ? (
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(existingRating.stars, () => {}, "sm")}
            </div>
            <span className="text-sm">Ver Valoración</span>
          </Button>
        ) : (
          <Button size="sm" className="bg-ocean hover:bg-ocean/90 flex items-center space-x-2">
            <StarIcon className="w-4 h-4" />
            <span>Valorar {userRole === "client" ? "Conductor" : "Cliente"}</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {userRole === "client" ? (
              <CarIcon className="w-5 h-5 text-ocean" />
            ) : (
              <UserIcon className="w-5 h-5 text-ocean" />
            )}
            <span>
              {existingRating ? "Tu Valoración" : `Valorar ${userRole === "client" ? "Conductor" : "Cliente"}`}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Info */}
          {targetName && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-ocean to-coral rounded-full flex items-center justify-center">
                    {userRole === "client" ? (
                      <CarIcon className="w-5 h-5 text-white" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{targetName}</div>
                    {targetPhone && (
                      <div className="text-sm text-gray-600">{targetPhone}</div>
                    )}
                    {vehicleInfo && userRole === "client" && (
                      <div className="text-sm text-gray-600">{vehicleInfo}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overall Rating */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Calificación General</div>
              {renderStars(stars, setStars, "lg")}
              <div className="text-sm text-gray-600 mt-2">{getRatingText(stars)}</div>
            </div>
          </div>

          {/* Detailed Aspects */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Aspectos Específicos</div>
            <div className="space-y-3">
              {Object.entries(aspects).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex-1">
                    {aspectLabels[key as keyof typeof aspectLabels]}
                  </span>
                  <div className="flex items-center space-x-2">
                    {renderStars(value, (rating) => 
                      setAspects(prev => ({ ...prev, [key]: rating }))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Comentarios {!existingRating && "(Opcional)"}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Comparte tu experiencia con ${userRole === "client" ? "el conductor" : "el cliente"}...`}
              rows={3}
              readOnly={!!existingRating}
            />
          </div>

          {/* Actions */}
          {!existingRating && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={stars === 0}
                className="flex-1 bg-ocean hover:bg-ocean/90"
              >
                <StarIcon className="w-4 h-4 mr-2" />
                Enviar Valoración
              </Button>
            </div>
          )}

          {existingRating && (
            <div className="text-center">
              <Badge variant="outline" className="border-green-200 text-green-700">
                ✓ Valoración enviada
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
