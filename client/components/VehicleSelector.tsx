import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getVehicleBrands,
  getModelsByBrand,
  getAvailableYears,
  getVehicleTypeForModel,
  getBrandById,
  getModelById,
  detectVehicleFromPlate,
  formatVehicleType,
  vehicleTypes,
  type VehicleBrand,
  type VehicleModel,
  type VehicleType,
  type PlateDetectionResult,
} from "@/services/vehicleDatabase";
import {
  SearchIcon,
  CarIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
} from "lucide-react";

export interface VehicleData {
  make: string;
  model: string;
  year: string;
  type: VehicleType | "";
  plate: string;
  color: string;
}

interface VehicleSelectorProps {
  value: VehicleData;
  onChange: (data: VehicleData) => void;
}

export default function VehicleSelector({ value, onChange }: VehicleSelectorProps) {
  const [brands] = useState<VehicleBrand[]>(getVehicleBrands());
  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<PlateDetectionResult | null>(null);
  const [detectionError, setDetectionError] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  // Update available models when brand changes
  useEffect(() => {
    if (selectedBrandId) {
      const models = getModelsByBrand(selectedBrandId);
      setAvailableModels(models);
      
      // Reset model and dependent fields if current model doesn't belong to new brand
      const currentModel = availableModels.find(m => m.name === value.model);
      if (!currentModel || currentModel.brandId !== selectedBrandId) {
        setSelectedModelId("");
        setAvailableYears([]);
        onChange({
          ...value,
          model: "",
          year: "",
          type: "",
        });
      }
    } else {
      setAvailableModels([]);
      setSelectedModelId("");
      setAvailableYears([]);
    }
  }, [selectedBrandId]);

  // Update available years and vehicle type when model changes
  useEffect(() => {
    if (selectedModelId) {
      const years = getAvailableYears(selectedModelId);
      setAvailableYears(years);
      
      const vehicleType = getVehicleTypeForModel(selectedModelId);
      const selectedModel = getModelById(selectedModelId);
      
      if (selectedModel && vehicleType) {
        onChange({
          ...value,
          model: selectedModel.name,
          type: vehicleType,
          year: years.length > 0 && !years.includes(parseInt(value.year)) ? "" : value.year,
        });
      }
    } else {
      setAvailableYears([]);
    }
  }, [selectedModelId]);

  // Initialize selected brand and model from current values
  useEffect(() => {
    if (value.make && value.model) {
      const brand = brands.find(b => b.name === value.make);
      if (brand) {
        setSelectedBrandId(brand.id);
        const models = getModelsByBrand(brand.id);
        const model = models.find(m => m.name === value.model);
        if (model) {
          setSelectedModelId(model.id);
        }
      }
    }
  }, [value.make, value.model, brands]);

  const handlePlateDetection = async () => {
    if (!value.plate || value.plate.length < 6) {
      setDetectionError("Por favor, introduce una matrícula válida");
      return;
    }

    setIsDetecting(true);
    setDetectionResult(null);
    setDetectionError("");

    try {
      const result = await detectVehicleFromPlate(value.plate);
      
      if (result && result.confidence > 0.7) {
        setDetectionResult(result);
        
        // Find matching brand and model in our database
        const brand = brands.find(b => 
          b.name.toLowerCase().includes(result.make?.toLowerCase() || "")
        );
        
        if (brand) {
          setSelectedBrandId(brand.id);
          const models = getModelsByBrand(brand.id);
          const model = models.find(m => 
            m.name.toLowerCase().includes(result.model?.toLowerCase() || "")
          );
          
          if (model) {
            setSelectedModelId(model.id);
            onChange({
              ...value,
              make: brand.name,
              model: model.name,
              year: result.year?.toString() || "",
              type: result.type || model.type,
              color: result.color || value.color,
            });
          }
        }
      } else {
        setDetectionError("No se pudo detectar información del vehículo para esta matrícula");
      }
    } catch (error) {
      setDetectionError("Error al detectar el vehículo. Inténtalo de nuevo.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleBrandChange = (brandId: string) => {
    const brand = getBrandById(brandId);
    setSelectedBrandId(brandId);
    onChange({
      ...value,
      make: brand?.name || "",
      model: "",
      year: "",
      type: "",
    });
  };

  const handleModelChange = (modelId: string) => {
    const model = getModelById(modelId);
    setSelectedModelId(modelId);
    // The useEffect will handle updating the form data
  };

  const handleYearChange = (year: string) => {
    onChange({
      ...value,
      year,
    });
  };

  const handlePlateChange = (plate: string) => {
    onChange({
      ...value,
      plate: plate.toUpperCase(),
    });
    
    // Clear detection results when plate changes
    if (detectionResult || detectionError) {
      setDetectionResult(null);
      setDetectionError("");
    }
  };

  const handleColorChange = (color: string) => {
    onChange({
      ...value,
      color,
    });
  };

  return (
    <div className="space-y-6">
      {/* License Plate Auto-Detection */}
      <Card className="border-ocean/20 bg-ocean-light/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <SearchIcon className="w-5 h-5 text-ocean" />
            <h3 className="font-semibold text-gray-900">Autodetección por Matrícula</h3>
            <Badge variant="secondary" className="text-xs">Recomendado</Badge>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Ej: 1234 ABC"
                value={value.plate}
                onChange={(e) => handlePlateChange(e.target.value)}
                className="border-gray-200 focus:border-ocean focus:ring-ocean"
                maxLength={10}
              />
            </div>
            <Button
              type="button"
              onClick={handlePlateDetection}
              disabled={isDetecting || !value.plate || value.plate.length < 6}
              className="bg-ocean hover:bg-ocean/90 text-white px-6"
            >
              {isDetecting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Detectando...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Detectar
                </>
              )}
            </Button>
          </div>

          {/* Detection Results */}
          {detectionResult && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Vehículo detectado con {Math.round(detectionResult.confidence * 100)}% de confianza
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {detectionResult.make} {detectionResult.model} ({detectionResult.year})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detection Error */}
          {detectionError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{detectionError}</p>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-start gap-2">
            <InfoIcon className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-xs text-gray-600">
              Introduce tu matrícula para autocompletar los datos del vehículo automáticamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manual Vehicle Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CarIcon className="w-4 h-4" />
            Marca *
          </label>
          <Select value={selectedBrandId} onValueChange={handleBrandChange}>
            <SelectTrigger className="border-gray-200 focus:border-ocean focus:ring-ocean">
              <SelectValue placeholder="Selecciona una marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  <div className="flex items-center gap-2">
                    <span>{brand.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {brand.country}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Modelo *
          </label>
          <Select 
            value={selectedModelId} 
            onValueChange={handleModelChange}
            disabled={!selectedBrandId}
          >
            <SelectTrigger className="border-gray-200 focus:border-ocean focus:ring-ocean">
              <SelectValue placeholder={selectedBrandId ? "Selecciona un modelo" : "Primero selecciona una marca"} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatVehicleType(model.type)}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Año *
          </label>
          <Select 
            value={value.year} 
            onValueChange={handleYearChange}
            disabled={!selectedModelId}
          >
            <SelectTrigger className="border-gray-200 focus:border-ocean focus:ring-ocean">
              <SelectValue placeholder={selectedModelId ? "Selecciona el año" : "Primero selecciona un modelo"} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle Type (Auto-filled) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tipo de Vehículo *
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            {value.type ? (
              <div className="flex items-center gap-2">
                <CarIcon className="w-4 h-4 text-ocean" />
                <span className="font-medium text-gray-900">
                  {formatVehicleType(value.type)}
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Auto-completado
                </Badge>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">
                Se completará automáticamente al seleccionar el modelo
              </span>
            )}
          </div>
        </div>

        {/* Color */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Color *
          </label>
          <Input
            placeholder="Ej: Negro, Blanco, Plata, Azul"
            value={value.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="border-gray-200 focus:border-ocean focus:ring-ocean"
            required
          />
        </div>
      </div>

      {/* Vehicle Type Information */}
      {value.type && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">
                  Tipo de vehículo: {formatVehicleType(value.type)}
                </h4>
                <p className="text-sm text-green-700">
                  {vehicleTypes.find(t => t.value === value.type)?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
