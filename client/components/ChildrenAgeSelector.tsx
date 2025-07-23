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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: numberOfChildren }, (_, index) => (
          <div key={index} className="space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Niño {index + 1}
            </label>
            <Select
              value={childrenAges[index]?.toString() || ""}
              onValueChange={(value) => handleAgeChange(index, value)}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:border-ocean">
                <SelectValue placeholder="Edad" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 16 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i === 0
                      ? "Bebé (0-11 meses)"
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

      {/* Child Seats Information Cards */}
      {childrenAges.some((age) => age !== null) && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-ocean" />
            Sillas infantiles requeridas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {childrenAges.map((age, index) => {
              if (age === null) return null;
              
              const seatInfo = getSeatInfo(age);
              
              return (
                <Card
                  key={index}
                  className="border border-gray-200 hover:border-ocean/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BabyIcon className="w-4 h-4 text-ocean" />
                        <span className="text-sm font-medium">
                          Niño {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({age} {age === 1 ? "año" : "años"})
                        </span>
                      </div>
                      {seatInfo.price > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +€{seatInfo.price}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge
                        className={`text-xs ${getSeatTypeColor(seatInfo.seatType)}`}
                        variant="outline"
                      >
                        {seatInfo.seatType}
                      </Badge>
                      
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {seatInfo.description}
                      </p>
                      
                      {seatInfo.price === 0 && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <InfoIcon className="w-3 h-3" />
                          <span>Sin costo adicional</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Total child seats cost */}
          {childrenAges.some((age) => age !== null && getSeatInfo(age).price > 0) && (
            <div className="mt-4 p-3 bg-ocean-light/10 rounded-lg border border-ocean/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Costo total sillas infantiles:
                </span>
                <span className="text-sm font-bold text-ocean">
                  +€
                  {childrenAges.reduce((total, age) => {
                    if (age === null) return total;
                    return total + getSeatInfo(age).price;
                  }, 0)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Sillas instaladas y revisadas por nuestros profesionales
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
