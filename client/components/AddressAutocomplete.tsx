import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPinIcon, SearchIcon } from "lucide-react";

interface AddressAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

// Mock address suggestions for demonstration
const mockSuggestions = [
  "Malaga Airport (AGP) - Avenida del Comandante García Morato, Málaga",
  "Hotel Majestic - Paseo de Sancha, 6, Málaga",
  "Marbella Old Town - Plaza de los Naranjos, Marbella",
  "Puerto Banús Marina - Puerto José Banús, Marbella",
  "Gibraltar International Airport (GIB) - Winston Churchill Ave, Gibraltar",
  "Costa del Sol Hospital - Autovía A-7, Km 187, Marbella",
  "La Cañada Shopping Center - Ctra. de Ojén, Marbella",
  "Estepona Beach - Paseo Marítimo, Estepona",
];

export default function AddressAutocomplete({
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
}: AddressAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    if (inputValue.length > 2) {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (value.length > 2) {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`${className} pr-10`}
          required={required}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon className="w-4 h-4" />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-ocean-light/20 border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-4 h-4 text-ocean mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {suggestion.split(" - ")[0]}
                  </div>
                  {suggestion.includes(" - ") && (
                    <div className="text-xs text-gray-500">
                      {suggestion.split(" - ")[1]}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="flex items-center text-xs text-gray-500">
              <MapPinIcon className="w-3 h-3 mr-1" />
              Powered by Google Places API (Demo Mode)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
