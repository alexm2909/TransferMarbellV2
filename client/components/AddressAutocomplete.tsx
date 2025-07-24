import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPinIcon, SearchIcon, LoaderIcon } from "lucide-react";

interface AddressAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBdejLAhodEvEQoLM8bDGpElU6xKFk12SQ";

export default function AddressAutocomplete({
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);

  // Load Google Maps script and initialize services
  useEffect(() => {
    if (window.google) {
      initializeServices();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeServices();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeServices = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.AutocompleteService();
      setAutocompleteService(service);
      
      // Create a dummy map for PlacesService (required by Google Maps API)
      const map = new window.google.maps.Map(document.createElement('div'));
      const placesServiceInstance = new window.google.maps.places.PlacesService(map);
      setPlacesService(placesServiceInstance);
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    if (inputValue.length > 2 && autocompleteService) {
      setIsLoading(true);
      
      const request = {
        input: inputValue,
        componentRestrictions: { country: 'es' }, // Restrict to Spain
        types: ['establishment', 'geocode'], // Allow both places and addresses
        fields: ['place_id', 'formatted_address', 'name', 'types'],
      };

      autocompleteService.getPlacePredictions(request, (predictions: any[], status: any) => {
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Filter and enhance predictions
          const filteredPredictions = predictions.slice(0, 6).map(prediction => ({
            ...prediction,
            isAirport: prediction.types.includes('airport'),
            isHotel: prediction.types.includes('lodging'),
            isTransitStation: prediction.types.includes('transit_station'),
          }));
          
          setPredictions(filteredPredictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      });
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handlePredictionClick = (prediction: any) => {
    onChange(prediction.description);
    setShowPredictions(false);
    setPredictions([]);
  };

  const handleFocus = () => {
    if (value.length > 2 && predictions.length > 0) {
      setShowPredictions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow click on predictions
    setTimeout(() => setShowPredictions(false), 200);
  };

  const getLocationIcon = (prediction: any) => {
    if (prediction.isAirport) return "✈️";
    if (prediction.isHotel) return "🏨";
    if (prediction.isTransitStation) return "🚌";
    return "📍";
  };

  const getLocationCategory = (prediction: any) => {
    if (prediction.isAirport) return "Aeropuerto";
    if (prediction.isHotel) return "Hotel";
    if (prediction.isTransitStation) return "Estación";
    return null; // No mostrar etiqueta para ubicaciones generales
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${className} pr-10`}
          required={required}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          ) : (
            <SearchIcon className="w-4 h-4" />
          )}
        </div>
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id || index}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-ocean-light/10 border-b border-gray-100 last:border-b-0 transition-colors group"
              onClick={() => handlePredictionClick(prediction)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-lg">{getLocationIcon(prediction)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-medium text-gray-900 text-sm truncate group-hover:text-ocean transition-colors">
                      {prediction.structured_formatting?.main_text || prediction.description.split(',')[0]}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                      {getLocationCategory(prediction)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting?.secondary_text || 
                     prediction.description.split(',').slice(1).join(',').trim()}
                  </div>
                </div>
                <MapPinIcon className="w-4 h-4 text-gray-300 group-hover:text-ocean transition-colors flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}

          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <MapPinIcon className="w-3 h-3 mr-1" />
                Powered by Google Places
              </span>
              <span className="text-ocean">🔍 Búsqueda en España</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
