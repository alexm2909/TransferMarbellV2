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

  const addMarkersForLocations = () => {
    if (!origin || !destination || !map || !geocoder) return;

    setIsLoading(true);
    setError(null);

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];
    let completedRequests = 0;
    const totalRequests = 2;

    // Geocode origin
    geocoder.geocode({ address: origin }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const originLocation = results[0].geometry.location;

        const originMarker = new window.google.maps.Marker({
          position: originLocation,
          map: map,
          title: 'Origen',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#10b981', // Green for origin
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }
        });

        newMarkers.push(originMarker);
        setLocationInfo(prev => ({ ...prev, origin: { lat: originLocation.lat(), lng: originLocation.lng() } }));
      }

      completedRequests++;
      if (completedRequests === totalRequests) {
        finishAddingMarkers(newMarkers);
      }
    });

    // Geocode destination
    geocoder.geocode({ address: destination }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const destLocation = results[0].geometry.location;

        const destMarker = new window.google.maps.Marker({
          position: destLocation,
          map: map,
          title: 'Destino',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#ef4444', // Red for destination
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }
        });

        newMarkers.push(destMarker);
        setLocationInfo(prev => ({ ...prev, destination: { lat: destLocation.lat(), lng: destLocation.lng() } }));
      }

      completedRequests++;
      if (completedRequests === totalRequests) {
        finishAddingMarkers(newMarkers);
      }
    });
  };

  const finishAddingMarkers = (newMarkers: any[]) => {
    setMarkers(newMarkers);

    // Fit map to show both markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);

      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }

    setIsLoading(false);
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
        {/* Location Info */}
        {locationInfo.origin && locationInfo.destination && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-600">Punto de Origen</div>
              <div className="text-sm font-bold text-green-700">Listo</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-600">Punto de Destino</div>
              <div className="text-sm font-bold text-red-700">Listo</div>
            </div>
          </div>
        )}

        {/* Location Details */}
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
