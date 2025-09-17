import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BabyIcon, ShieldIcon, InfoIcon } from "lucide-react";

interface ChildrenAgeSelectorProps {
  numberOfChildren: number;
  onChildSeatsChange: (seats: ChildSeat[]) => void;
}

interface ChildSeat {
  childIndex: number;
  age: number;
  seatType: string;
  description: string;
  price: number;
}

export default function ChildrenAgeSelector({
  numberOfChildren,
  onChildSeatsChange,
}: ChildrenAgeSelectorProps) {
  const [childrenAges, setChildrenAges] = useState<(number | null)[]>(
    Array(numberOfChildren).fill(null)
  );

  const getSeatInfo = (age: number): Omit<ChildSeat, 'childIndex'> => {
    if (age <= 1) {
      return {
        age,
        seatType: "Grupo 0+",
        description: "Silla para bebés (0-15 meses, hasta 13kg)",
        price: 15,
      };
    } else if (age <= 4) {
      return {
        age,
        seatType: "Grupo I",
        description: "Silla para niños pequeños (9 meses-4 años, 9-18kg)",
        price: 12,
      };
    } else if (age <= 7) {
      return {
        age,
        seatType: "Grupo II",
        description: "Silla para niños (4-7 años, 15-25kg)",
        price: 10,
      };
    } else if (age <= 12) {
      return {
        age,
        seatType: "Elevador",
        description: "Elevador con respaldo (6-12 años, 22-36kg)",
        price: 8,
      };
    } else {
      return {
        age,
        seatType: "Sin silla",
        description: "No requiere silla infantil (mayor de 12 años)",
        price: 0,
      };
    }
  };

  const handleAgeChange = (childIndex: number, age: string) => {
    const ageNum = parseInt(age);
    const newAges = [...childrenAges];
    newAges[childIndex] = ageNum;
    setChildrenAges(newAges);
  };

  useEffect(() => {
    const childSeats: ChildSeat[] = childrenAges
      .map((age, index) => {
        if (age === null) return null;
        const seatInfo = getSeatInfo(age);
        return {
          childIndex: index,
          ...seatInfo,
        };
      })
      .filter((seat): seat is ChildSeat => seat !== null);

    onChildSeatsChange(childSeats);
  }, [childrenAges, onChildSeatsChange]);

  useEffect(() => {
    if (childrenAges.length !== numberOfChildren) {
      const newAges = Array(numberOfChildren).fill(null);
      // Preserve existing ages if the array is getting longer
      for (let i = 0; i < Math.min(childrenAges.length, numberOfChildren); i++) {
        newAges[i] = childrenAges[i];
      }
      setChildrenAges(newAges);
    }
  }, [numberOfChildren, childrenAges.length]);

  if (numberOfChildren === 0) {
    return null;
  }

  const getSeatTypeColor = (seatType: string) => {
    switch (seatType) {
      case "Grupo 0+":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Grupo I":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Grupo II":
        return "bg-green-100 text-green-800 border-green-200";
      case "Elevador":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <BabyIcon className="w-4 h-4 text-ocean" />
        <span className="text-sm font-medium text-gray-700">
          Edades de los niños (para sillas infantiles)
        </span>
      </div>

      {/* Layout vertical compacto */}
      <div className="space-y-2">
        {Array.from({ length: numberOfChildren }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
            <div className="w-6 h-6 bg-ocean rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {index + 1}
            </div>

            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                Niño {index + 1}
              </span>
            </div>

            <Select
              value={childrenAges[index]?.toString() || ""}
              onValueChange={(value) => handleAgeChange(index, value)}
            >
              <SelectTrigger className="w-32 h-9 border-gray-200 focus:border-ocean">
                <SelectValue placeholder="Edad" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 16 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i === 0
                      ? "Bebé (0-11m)"
                      : i === 1
                      ? "1 año"
                      : `${i} años`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Resumen compacto de sillas requeridas */}
      {childrenAges.some((age) => age !== null) && (
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Sillas infantiles incluidas
              </span>
            </div>

            <div className="space-y-1">
              {childrenAges.map((age, index) => {
                if (age === null) return null;
                const seatInfo = getSeatInfo(age);

                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-blue-700">
                      Niño {index + 1} ({age} {age === 1 ? "año" : "años"}) - {seatInfo.seatType}
                    </span>
                    <span className="font-medium text-blue-800">€{seatInfo.price}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
              <span className="text-sm font-medium text-blue-800">Total sillas:</span>
              <span className="text-sm font-bold text-blue-800">
                +€{childrenAges.reduce((total, age) => {
                  if (age === null) return total;
                  return total + getSeatInfo(age).price;
                }, 0)}
              </span>
            </div>

            <p className="text-xs text-blue-700 mt-2 opacity-90">
              Obligatorias por ley • Instalación incluida • Normativa ECE R44/04
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
