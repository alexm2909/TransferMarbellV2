import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuggageIcon, MinusIcon, PlusIcon } from "lucide-react";

interface LuggageCount {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

interface LuggageCountSelectorProps {
  totalLuggage: number;
  onLuggageCountChange: (counts: LuggageCount) => void;
}

const luggageSizes = {
  xlarge: {
    name: "Extra Grandes",
    description: "> 80cm",
    icon: "🧳",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  large: {
    name: "Grandes",
    description: "≤ 80cm",
    icon: "🧳",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  medium: {
    name: "Medianas",
    description: "≤ 70cm",
    icon: "🧳",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  small: {
    name: "Pequeñas",
    description: "≤ 55cm",
    icon: "🎒",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
};

export default function LuggageCountSelector({
  totalLuggage,
  onLuggageCountChange,
}: LuggageCountSelectorProps) {
  const [counts, setCounts] = useState<LuggageCount>({
    small: 0,
    medium: Math.min(totalLuggage, 3), // Default to medium size
    large: Math.max(0, totalLuggage - 3),
    xlarge: 0,
  });

  useEffect(() => {
    onLuggageCountChange(counts);
  }, [counts, onLuggageCountChange]);

  const getTotalSelected = () => {
    return counts.small + counts.medium + counts.large + counts.xlarge;
  };

  const handleCountChange = (size: keyof LuggageCount, delta: number) => {
    setCounts(prev => {
      const newCount = Math.max(0, prev[size] + delta);
      const newCounts = { ...prev, [size]: newCount };
      
      // Ensure total doesn't exceed totalLuggage
      const total = newCounts.small + newCounts.medium + newCounts.large + newCounts.xlarge;
      if (total <= totalLuggage) {
        return newCounts;
      }
      return prev;
    });
  };

  const remaining = totalLuggage - getTotalSelected();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuggageIcon className="w-5 h-5 text-ocean" />
          Distribución de Maletas por Tamaño
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Distribuye tus {totalLuggage} maletas por tamaño
          </p>
          <Badge
            variant={remaining === 0 ? "default" : "destructive"}
            className={remaining === 0 ? "bg-green-100 text-green-700" : ""}
          >
            {remaining === 0 ? "Completo" : `Faltan: ${remaining}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(luggageSizes).map(([size, info]) => {
            const count = counts[size as keyof LuggageCount];
            const canIncrease = getTotalSelected() < totalLuggage;
            const canDecrease = count > 0;

            return (
              <div
                key={size}
                className={`p-4 rounded-lg border-2 transition-all ${info.bgColor} ${info.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{info.icon}</span>
                    <div>
                      <div className={`font-semibold ${info.color}`}>
                        {info.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {info.description}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${info.bgColor} ${info.color} border-0`}>
                    {count}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handleCountChange(size as keyof LuggageCount, -1)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    disabled={!canDecrease}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {count}
                  </span>
                  <Button
                    type="button"
                    onClick={() => handleCountChange(size as keyof LuggageCount, 1)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    disabled={!canIncrease}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {remaining > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-700">
              <LuggageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                Te faltan {remaining} maleta{remaining > 1 ? 's' : ''} por clasificar
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <div className="font-medium text-blue-800 mb-1">Guía de tamaños:</div>
          <ul className="space-y-1">
            <li>• <strong>Pequeñas:</strong> Equipaje de mano, mochilas (≤ 55cm)</li>
            <li>• <strong>Medianas:</strong> Maletas estándar (≤ 70cm)</li>
            <li>• <strong>Grandes:</strong> Maletas grandes (≤ 80cm)</li>
            <li>• <strong>Extra Grandes:</strong> Maletas muy grandes (&gt; 80cm)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
