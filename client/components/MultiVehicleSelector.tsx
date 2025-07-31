import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarIcon, MinusIcon, PlusIcon, CheckIcon } from "lucide-react";

interface VehicleSelection {
  vehicleId: string;
  quantity: number;
}

interface MultiVehicleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selections: VehicleSelection[]) => void;
  vehicleTypes: Array<{
    id: string;
    name: string;
    capacity: string;
    maxPassengers: number;
    maxLuggage: number;
    price: string;
    description: string;
    features: string[];
  }>;
}

export default function MultiVehicleSelector({
  isOpen,
  onClose,
  onConfirm,
  vehicleTypes,
}: MultiVehicleSelectorProps) {
  const [selections, setSelections] = useState<VehicleSelection[]>([]);

  const handleQuantityChange = (vehicleId: string, quantity: number) => {
    if (quantity === 0) {
      setSelections(prev => prev.filter(s => s.vehicleId !== vehicleId));
    } else {
      setSelections(prev => {
        const existing = prev.find(s => s.vehicleId === vehicleId);
        if (existing) {
          return prev.map(s => 
            s.vehicleId === vehicleId ? { ...s, quantity } : s
          );
        } else {
          return [...prev, { vehicleId, quantity }];
        }
      });
    }
  };

  const getQuantity = (vehicleId: string) => {
    return selections.find(s => s.vehicleId === vehicleId)?.quantity || 0;
  };

  const getTotalVehicles = () => {
    return selections.reduce((total, selection) => total + selection.quantity, 0);
  };

  const handleConfirm = () => {
    onConfirm(selections);
    onClose();
  };

  const handleReset = () => {
    setSelections([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarIcon className="w-5 h-5 text-purple" />
            Seleccionar Múltiples Vehículos
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Selecciona la cantidad de cada tipo de vehículo que necesitas para tu reserva empresarial.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-purple/10 p-4 rounded-lg border border-purple/20">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Total de vehículos seleccionados: {getTotalVehicles()}
              </span>
              {getTotalVehicles() > 0 && (
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Limpiar selección
                </Button>
              )}
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicleTypes.map((vehicle) => {
              const quantity = getQuantity(vehicle.id);
              const isSelected = quantity > 0;

              return (
                <Card
                  key={vehicle.id}
                  className={`transition-all ${
                    isSelected
                      ? "border-purple bg-purple/5"
                      : "border-gray-200 hover:border-purple/40"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {vehicle.name}
                          {isSelected && (
                            <CheckIcon className="w-4 h-4 text-purple" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{vehicle.capacity}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          Max: {vehicle.maxPassengers} pasajeros, {vehicle.maxLuggage} maletas
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-ocean/10 text-ocean"
                      >
                        {vehicle.price}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {vehicle.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-1 mb-4">
                      {vehicle.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs text-gray-500"
                        >
                          <div className="w-1 h-1 rounded-full bg-ocean mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cantidad</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => handleQuantityChange(vehicle.id, quantity - 1)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          disabled={quantity === 0}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(vehicle.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          type="button"
                          onClick={() => handleQuantityChange(vehicle.id, quantity + 1)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          disabled={quantity >= 10}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={getTotalVehicles() === 0}
              className="bg-purple hover:bg-purple/90 text-white"
            >
              Confirmar Selección ({getTotalVehicles()} vehículos)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
