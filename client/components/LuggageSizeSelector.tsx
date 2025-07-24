import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LuggageIcon } from "lucide-react";

interface LuggageItem {
  index: number;
  size: "small" | "medium" | "large" | "xlarge";
  description: string;
  price: number;
}

interface LuggageSizeSelectorProps {
  numberOfLuggage: number;
  onLuggageChange: (luggage: LuggageItem[]) => void;
}

const luggageSizes = {
  small: {
    name: "Pequeña",
    description: "Maleta de mano (≤ 55cm)",
    price: 0,
    icon: "🎒",
  },
  medium: {
    name: "Mediana",
    description: "Maleta estándar (≤ 70cm)",
    price: 0,
    icon: "🧳",
  },
  large: {
    name: "Grande",
    description: "Maleta grande (≤ 80cm)",
    price: 0,
    icon: "🧳",
  },
  xlarge: {
    name: "Extra Grande",
    description: "Maleta extra grande (> 80cm)",
    price: 0,
    icon: "🧳",
  },
};

export default function LuggageSizeSelector({
  numberOfLuggage,
  onLuggageChange,
}: LuggageSizeSelectorProps) {
  const [luggage, setLuggage] = useState<LuggageItem[]>([]);

  useEffect(() => {
    // Initialize luggage array based on numberOfLuggage
    const initialLuggage: LuggageItem[] = [];
    for (let i = 0; i < numberOfLuggage; i++) {
      initialLuggage.push({
        index: i,
        size: "medium",
        description: luggageSizes.medium.description,
        price: luggageSizes.medium.price,
      });
    }
    setLuggage(initialLuggage);
  }, [numberOfLuggage]);

  useEffect(() => {
    onLuggageChange(luggage);
  }, [luggage, onLuggageChange]);

  const handleSizeChange = (luggageIndex: number, size: keyof typeof luggageSizes) => {
    const sizeInfo = luggageSizes[size];
    setLuggage(prev =>
      prev.map((item, index) =>
        index === luggageIndex
          ? {
              ...item,
              size,
              description: sizeInfo.description,
              price: sizeInfo.price,
            }
          : item
      )
    );
  };

  const getTotalExtraPrice = () => {
    return luggage.reduce((total, item) => total + item.price, 0);
  };

  if (numberOfLuggage === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <LuggageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay maletas seleccionadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <LuggageIcon className="w-4 h-4 text-ocean" />
          Tamaño de Maletas
        </h4>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          Sin coste extra
        </Badge>
      </div>

      <div className="space-y-3">
        {luggage.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-lg">
                {luggageSizes[item.size].icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Maleta {index + 1}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {item.description}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={item.size}
                onValueChange={(size: keyof typeof luggageSizes) =>
                  handleSizeChange(index, size)
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(luggageSizes).map(([size, info]) => (
                    <SelectItem key={size} value={size}>
                      <div className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">
                            {info.name}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        <div className="font-medium text-blue-800 mb-1">Información sobre tamaños:</div>
        <ul className="space-y-1">
          <li>• <strong>Pequeña:</strong> Equipaje de mano, sin coste extra</li>
          <li>• <strong>Mediana:</strong> Maleta estándar, sin coste extra</li>
          <li>• <strong>Grande:</strong> Maleta grande, +€3 por espacio adicional</li>
          <li>• <strong>Extra Grande:</strong> Maleta muy grande, +€5 por manejo especial</li>
        </ul>
      </div>
    </div>
  );
}
