import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, ClockIcon, RouteIcon, NavigationIcon } from "lucide-react";
import { loadGoogleMaps, isGoogleMapsLoaded } from "@/lib/googleMapsLoader";

interface RouteMapProps {
  origin: string;
  destination: string;
  className?: string;
}

export default function RouteMap({ origin, destination, className = "" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    origin: { lat: number; lng: number } | null;
    destination: { lat: number; lng: number } | null;
  }>({ origin: null, destination: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (isGoogleMapsLoaded()) {
      initializeMap();
      return;
    }

    loadGoogleMaps(['places', 'geometry'])
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        setError('Failed to load map');
        setIsLoading(false);
      });
  }, []);

  // Update markers when origin or destination changes
  useEffect(() => {
    if (map && geocoder && origin && destination) {
      addMarkersForLocations();
    }
  }, [origin, destination, map, geocoder]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 36.7213, lng: -4.4214 }, // Málaga center
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 21 }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }],
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
    });

    const geocoderInstance = new window.google.maps.Geocoder();

    setMap(mapInstance);
    setGeocoder(geocoderInstance);
    setIsLoading(false);
  };

  const calculateAndDisplayRoute = () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setError(null);

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response: any, status: any) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          
          const route = response.routes[0];
          const leg = route.legs[0];
          
          // Calculate estimated cost based on distance (€1.5 per km + base €15)
          const distanceKm = parseFloat(leg.distance.text.replace(/[^\d.]/g, ''));
          const estimatedCost = Math.round(15 + (distanceKm * 1.5));
          
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            estimatedCost: `€${estimatedCost}`,
          });
          setIsLoading(false);
        } else {
          setError("No se pudo calcular la ruta. Verifica las direcciones.");
          setIsLoading(false);
        }
      }
    );
  };

  if (!origin || !destination) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-ocean" />
            Ruta del Viaje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Selecciona origen y destino para ver la ruta</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-ocean" />
          Ruta del Viaje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Info */}
        {routeInfo && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-ocean-light/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <NavigationIcon className="w-4 h-4 text-ocean" />
              </div>
              <div className="text-sm font-bold text-ocean">{routeInfo.distance}</div>
              <div className="text-xs text-gray-600">Distancia</div>
            </div>
            <div className="text-center p-3 bg-coral-light/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <ClockIcon className="w-4 h-4 text-coral" />
              </div>
              <div className="text-sm font-bold text-coral">{routeInfo.duration}</div>
              <div className="text-xs text-gray-600">Duración</div>
            </div>
            <div className="text-center p-3 bg-success/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm">💰</span>
              </div>
              <div className="text-sm font-bold text-success">{routeInfo.estimatedCost}</div>
              <div className="text-xs text-gray-600">Estimado</div>
            </div>
          </div>
        )}

        {/* Route Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Origen</div>
              <div className="text-xs text-gray-600 truncate">{origin}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Destino</div>
              <div className="text-xs text-gray-600 truncate">{destination}</div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden"
            style={{ minHeight: "250px" }}
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-2 border-ocean border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Calculando ruta...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center rounded-lg">
              <div className="text-center p-4">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Powered by Google Maps</span>
          <Badge variant="secondary" className="text-xs">
            Ruta óptima
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
