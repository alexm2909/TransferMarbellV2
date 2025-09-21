import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LuggageIcon, Minus, Plus } from "lucide-react";

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

  const [smallCount, setSmallCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [largeCount, setLargeCount] = useState(0);
  const [xlargeCount, setXlargeCount] = useState(0);

  const totalSelectedCounts =
    smallCount + mediumCount + largeCount + xlargeCount;

  // Ensure counts never exceed numberOfLuggage by clamping them when numberOfLuggage changes
  useEffect(() => {
    if (numberOfLuggage > 2) {
      // default: all medium
      setSmallCount(0);
      setMediumCount(numberOfLuggage);
      setLargeCount(0);
      setXlargeCount(0);
      const items: LuggageItem[] = Array.from({ length: numberOfLuggage }).map(
        (_, i) => ({
          index: i,
          size: "medium",
          description: luggageSizes.medium.description,
          price: luggageSizes.medium.price,
        }),
      );
      setLuggage(items);
      return;
    }

    // For small numbers, build explicit items
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

    // Also clamp counts to not exceed numberOfLuggage
    setSmallCount(0);
    setMediumCount(numberOfLuggage);
    setLargeCount(0);
    setXlargeCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfLuggage]);

  // If counts are manually adjusted and total exceeds numberOfLuggage, reduce counts
  useEffect(() => {
    if (totalSelectedCounts > numberOfLuggage) {
      // reduce in priority: xlarge -> large -> medium -> small
      let overflow = totalSelectedCounts - numberOfLuggage;
      let xs = xlargeCount;
      let l = largeCount;
      let m = mediumCount;
      let s = smallCount;

      const reduce = (count: number, reduceBy: number) => {
        const actualReduce = Math.min(count, reduceBy);
        return [count - actualReduce, reduceBy - actualReduce];
      };

      let remaining = overflow;
      [xs, remaining] = reduce(xs, remaining);
      [l, remaining] = reduce(l, remaining);
      [m, remaining] = reduce(m, remaining);
      [s, remaining] = reduce(s, remaining);

      // Apply the clamped values
      setXlargeCount(xs);
      setLargeCount(l);
      setMediumCount(m);
      setSmallCount(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smallCount, mediumCount, largeCount, xlargeCount, numberOfLuggage]);

  useEffect(() => {
    onLuggageChange(luggage);
  }, [luggage, onLuggageChange]);

  const rebuildLuggageFromCounts = () => {
    const counts: { size: keyof typeof luggageSizes }[] = [];
    for (let i = 0; i < smallCount; i++) counts.push({ size: "small" });
    for (let i = 0; i < mediumCount; i++) counts.push({ size: "medium" });
    for (let i = 0; i < largeCount; i++) counts.push({ size: "large" });
    for (let i = 0; i < xlargeCount; i++) counts.push({ size: "xlarge" });

    // Ensure we do not exceed numberOfLuggage
    if (counts.length > numberOfLuggage) {
      counts.length = numberOfLuggage;
    }

    // If total counts are less than numberOfLuggage, fill the remainder with medium
    while (counts.length < numberOfLuggage) {
      counts.push({ size: "medium" });
    }

    const items: LuggageItem[] = counts.map((c, idx) => ({
      index: idx,
      size: c.size,
      description: luggageSizes[c.size].description,
      price: luggageSizes[c.size].price,
    }));

    setLuggage(items);
  };

  useEffect(() => {
    if (numberOfLuggage > 2) {
      rebuildLuggageFromCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smallCount, mediumCount, largeCount, xlargeCount]);

  const handleSizeChange = (
    luggageIndex: number,
    size: keyof typeof luggageSizes,
  ) => {
    const sizeInfo = luggageSizes[size];
    setLuggage((prev) =>
      prev.map((item, index) =>
        index === luggageIndex
          ? {
              ...item,
              size,
              description: sizeInfo.description,
              price: sizeInfo.price,
            }
          : item,
      ),
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

  // Helper to increment a specific count without exceeding numberOfLuggage
  const canIncrement = () => {
    return (
      smallCount + mediumCount + largeCount + xlargeCount < numberOfLuggage
    );
  };

  // Compact mode when more than 2 luggage
  if (numberOfLuggage > 2) {
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border flex flex-col items-center">
            <div className="text-xs text-gray-600">Pequeñas</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSmallCount(Math.max(0, smallCount - 1));
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium">{smallCount}</div>
              <button
                type="button"
                onClick={() => {
                  if (!canIncrement()) return;
                  setSmallCount((c) => c + 1);
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border flex flex-col items-center">
            <div className="text-xs text-gray-600">Medianas</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMediumCount(Math.max(0, mediumCount - 1));
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium">{mediumCount}</div>
              <button
                type="button"
                onClick={() => {
                  if (!canIncrement()) return;
                  setMediumCount((c) => c + 1);
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border flex flex-col items-center">
            <div className="text-xs text-gray-600">Grandes</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLargeCount(Math.max(0, largeCount - 1));
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium">{largeCount}</div>
              <button
                type="button"
                onClick={() => {
                  if (!canIncrement()) return;
                  setLargeCount((c) => c + 1);
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border flex flex-col items-center">
            <div className="text-xs text-gray-600">Extra Grande</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setXlargeCount(Math.max(0, xlargeCount - 1));
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium">{xlargeCount}</div>
              <button
                type="button"
                onClick={() => {
                  if (!canIncrement()) return;
                  setXlargeCount((c) => c + 1);
                  setTimeout(rebuildLuggageFromCounts, 0);
                }}
                className="p-1 rounded-md bg-white border"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <div className="font-medium text-blue-800 mb-1">
            Información sobre tamaños:
          </div>
          <ul className="space-y-1">
            <li>
              • <strong>Pequeña:</strong> Equipaje de mano (≤ 55cm)
            </li>
            <li>
              • <strong>Mediana:</strong> Maleta estándar (≤ 70cm)
            </li>
            <li>
              • <strong>Grande:</strong> Maleta grande (≤ 80cm)
            </li>
            <li>
              • <strong>Extra Grande:</strong> Maleta muy grande (&gt; 80cm)
            </li>
          </ul>
          <p className="mt-2 text-blue-700 font-medium">
            Esta información nos ayuda a seleccionar el vehículo más adecuado
            para tu equipaje.
          </p>
        </div>
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
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-lg">{luggageSizes[item.size].icon}</span>
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
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(luggageSizes).map(([size, info]) => (
                    <SelectItem key={size} value={size}>
                      <div className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">{info.name}</div>
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
        <div className="font-medium text-blue-800 mb-1">
          Información sobre tamaños:
        </div>
        <ul className="space-y-1">
          <li>
            • <strong>Pequeña:</strong> Equipaje de mano (≤ 55cm)
          </li>
          <li>
            • <strong>Mediana:</strong> Maleta estándar (≤ 70cm)
          </li>
          <li>
            • <strong>Grande:</strong> Maleta grande (≤ 80cm)
          </li>
          <li>
            • <strong>Extra Grande:</strong> Maleta muy grande (&gt; 80cm)
          </li>
        </ul>
        <p className="mt-2 text-blue-700 font-medium">
          Esta información nos ayuda a seleccionar el vehículo más adecuado para
          tu equipaje.
        </p>
      </div>
    </div>
  );
}
