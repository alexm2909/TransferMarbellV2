// Vehicle database service for driver registration
export interface VehicleBrand {
  id: string;
  name: string;
  country: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  type: VehicleType;
  yearStart: number;
  yearEnd?: number;
  category: 'economy' | 'standard' | 'premium' | 'luxury';
}

export type VehicleType = 
  | 'sedan'
  | 'hatchback'
  | 'suv'
  | 'crossover'
  | 'coupe'
  | 'convertible'
  | 'wagon'
  | 'van'
  | 'minivan'
  | 'pickup'
  | 'sports'
  | 'luxury';

export interface PlateDetectionResult {
  make?: string;
  model?: string;
  year?: number;
  type?: VehicleType;
  color?: string;
  confidence: number;
}

// Comprehensive vehicle brands database
export const vehicleBrands: VehicleBrand[] = [
  // German brands
  { id: 'audi', name: 'Audi', country: 'Germany' },
  { id: 'bmw', name: 'BMW', country: 'Germany' },
  { id: 'mercedes', name: 'Mercedes-Benz', country: 'Germany' },
  { id: 'volkswagen', name: 'Volkswagen', country: 'Germany' },
  { id: 'porsche', name: 'Porsche', country: 'Germany' },
  { id: 'opel', name: 'Opel', country: 'Germany' },
  
  // Spanish brands
  { id: 'seat', name: 'SEAT', country: 'Spain' },
  { id: 'cupra', name: 'Cupra', country: 'Spain' },
  
  // French brands
  { id: 'renault', name: 'Renault', country: 'France' },
  { id: 'peugeot', name: 'Peugeot', country: 'France' },
  { id: 'citroen', name: 'Citroën', country: 'France' },
  
  // Italian brands
  { id: 'fiat', name: 'Fiat', country: 'Italy' },
  { id: 'alfa', name: 'Alfa Romeo', country: 'Italy' },
  { id: 'ferrari', name: 'Ferrari', country: 'Italy' },
  { id: 'lamborghini', name: 'Lamborghini', country: 'Italy' },
  { id: 'maserati', name: 'Maserati', country: 'Italy' },
  
  // Japanese brands
  { id: 'toyota', name: 'Toyota', country: 'Japan' },
  { id: 'honda', name: 'Honda', country: 'Japan' },
  { id: 'nissan', name: 'Nissan', country: 'Japan' },
  { id: 'mazda', name: 'Mazda', country: 'Japan' },
  { id: 'mitsubishi', name: 'Mitsubishi', country: 'Japan' },
  { id: 'subaru', name: 'Subaru', country: 'Japan' },
  { id: 'lexus', name: 'Lexus', country: 'Japan' },
  { id: 'infiniti', name: 'Infiniti', country: 'Japan' },
  { id: 'acura', name: 'Acura', country: 'Japan' },
  
  // Korean brands
  { id: 'hyundai', name: 'Hyundai', country: 'Korea' },
  { id: 'kia', name: 'Kia', country: 'Korea' },
  { id: 'genesis', name: 'Genesis', country: 'Korea' },
  
  // American brands
  { id: 'tesla', name: 'Tesla', country: 'USA' },
  { id: 'ford', name: 'Ford', country: 'USA' },
  { id: 'chevrolet', name: 'Chevrolet', country: 'USA' },
  { id: 'cadillac', name: 'Cadillac', country: 'USA' },
  { id: 'lincoln', name: 'Lincoln', country: 'USA' },
  
  // British brands
  { id: 'jaguar', name: 'Jaguar', country: 'UK' },
  { id: 'landrover', name: 'Land Rover', country: 'UK' },
  { id: 'bentley', name: 'Bentley', country: 'UK' },
  { id: 'rollsroyce', name: 'Rolls-Royce', country: 'UK' },
  { id: 'mini', name: 'MINI', country: 'UK' },
  
  // Swedish brands
  { id: 'volvo', name: 'Volvo', country: 'Sweden' },
  { id: 'saab', name: 'Saab', country: 'Sweden' },
  
  // Others
  { id: 'skoda', name: 'Škoda', country: 'Czech Republic' },
  { id: 'dacia', name: 'Dacia', country: 'Romania' },
];

// Comprehensive vehicle models database
export const vehicleModels: VehicleModel[] = [
  // Mercedes-Benz models
  { id: 'mercedes-a-class', brandId: 'mercedes', name: 'Clase A', type: 'hatchback', yearStart: 1997, category: 'premium' },
  { id: 'mercedes-c-class', brandId: 'mercedes', name: 'Clase C', type: 'sedan', yearStart: 1993, category: 'premium' },
  { id: 'mercedes-e-class', brandId: 'mercedes', name: 'Clase E', type: 'sedan', yearStart: 1953, category: 'luxury' },
  { id: 'mercedes-s-class', brandId: 'mercedes', name: 'Clase S', type: 'sedan', yearStart: 1972, category: 'luxury' },
  { id: 'mercedes-gle', brandId: 'mercedes', name: 'GLE', type: 'suv', yearStart: 2015, category: 'luxury' },
  { id: 'mercedes-glc', brandId: 'mercedes', name: 'GLC', type: 'suv', yearStart: 2015, category: 'premium' },
  { id: 'mercedes-v-class', brandId: 'mercedes', name: 'Clase V', type: 'van', yearStart: 2014, category: 'luxury' },
  
  // BMW models
  { id: 'bmw-1-series', brandId: 'bmw', name: 'Serie 1', type: 'hatchback', yearStart: 2004, category: 'premium' },
  { id: 'bmw-3-series', brandId: 'bmw', name: 'Serie 3', type: 'sedan', yearStart: 1975, category: 'premium' },
  { id: 'bmw-5-series', brandId: 'bmw', name: 'Serie 5', type: 'sedan', yearStart: 1972, category: 'luxury' },
  { id: 'bmw-7-series', brandId: 'bmw', name: 'Serie 7', type: 'sedan', yearStart: 1977, category: 'luxury' },
  { id: 'bmw-x3', brandId: 'bmw', name: 'X3', type: 'suv', yearStart: 2003, category: 'premium' },
  { id: 'bmw-x5', brandId: 'bmw', name: 'X5', type: 'suv', yearStart: 1999, category: 'luxury' },
  
  // Audi models
  { id: 'audi-a3', brandId: 'audi', name: 'A3', type: 'hatchback', yearStart: 1996, category: 'premium' },
  { id: 'audi-a4', brandId: 'audi', name: 'A4', type: 'sedan', yearStart: 1994, category: 'premium' },
  { id: 'audi-a6', brandId: 'audi', name: 'A6', type: 'sedan', yearStart: 1994, category: 'luxury' },
  { id: 'audi-a8', brandId: 'audi', name: 'A8', type: 'sedan', yearStart: 1994, category: 'luxury' },
  { id: 'audi-q3', brandId: 'audi', name: 'Q3', type: 'suv', yearStart: 2011, category: 'premium' },
  { id: 'audi-q5', brandId: 'audi', name: 'Q5', type: 'suv', yearStart: 2008, category: 'premium' },
  { id: 'audi-q7', brandId: 'audi', name: 'Q7', type: 'suv', yearStart: 2005, category: 'luxury' },
  
  // Volkswagen models
  { id: 'vw-golf', brandId: 'volkswagen', name: 'Golf', type: 'hatchback', yearStart: 1974, category: 'standard' },
  { id: 'vw-passat', brandId: 'volkswagen', name: 'Passat', type: 'sedan', yearStart: 1973, category: 'standard' },
  { id: 'vw-tiguan', brandId: 'volkswagen', name: 'Tiguan', type: 'suv', yearStart: 2007, category: 'standard' },
  { id: 'vw-touareg', brandId: 'volkswagen', name: 'Touareg', type: 'suv', yearStart: 2002, category: 'premium' },
  { id: 'vw-sharan', brandId: 'volkswagen', name: 'Sharan', type: 'minivan', yearStart: 1995, category: 'standard' },
  
  // Toyota models
  { id: 'toyota-corolla', brandId: 'toyota', name: 'Corolla', type: 'sedan', yearStart: 1966, category: 'economy' },
  { id: 'toyota-camry', brandId: 'toyota', name: 'Camry', type: 'sedan', yearStart: 1982, category: 'standard' },
  { id: 'toyota-prius', brandId: 'toyota', name: 'Prius', type: 'hatchback', yearStart: 1997, category: 'standard' },
  { id: 'toyota-rav4', brandId: 'toyota', name: 'RAV4', type: 'suv', yearStart: 1994, category: 'standard' },
  { id: 'toyota-highlander', brandId: 'toyota', name: 'Highlander', type: 'suv', yearStart: 2000, category: 'standard' },
  { id: 'toyota-sienna', brandId: 'toyota', name: 'Sienna', type: 'minivan', yearStart: 1997, category: 'standard' },
  
  // Tesla models
  { id: 'tesla-model-s', brandId: 'tesla', name: 'Model S', type: 'sedan', yearStart: 2012, category: 'luxury' },
  { id: 'tesla-model-3', brandId: 'tesla', name: 'Model 3', type: 'sedan', yearStart: 2017, category: 'premium' },
  { id: 'tesla-model-x', brandId: 'tesla', name: 'Model X', type: 'suv', yearStart: 2015, category: 'luxury' },
  { id: 'tesla-model-y', brandId: 'tesla', name: 'Model Y', type: 'suv', yearStart: 2020, category: 'premium' },
  
  // SEAT models
  { id: 'seat-ibiza', brandId: 'seat', name: 'Ibiza', type: 'hatchback', yearStart: 1984, category: 'economy' },
  { id: 'seat-leon', brandId: 'seat', name: 'León', type: 'hatchback', yearStart: 1999, category: 'standard' },
  { id: 'seat-ateca', brandId: 'seat', name: 'Ateca', type: 'suv', yearStart: 2016, category: 'standard' },
  { id: 'seat-tarraco', brandId: 'seat', name: 'Tarraco', type: 'suv', yearStart: 2018, category: 'standard' },
  { id: 'seat-alhambra', brandId: 'seat', name: 'Alhambra', type: 'minivan', yearStart: 1996, category: 'standard' },
  
  // Add more models as needed...
];

export const vehicleTypes: { value: VehicleType; label: string; description: string }[] = [
  { value: 'sedan', label: 'Sedán', description: 'Vehículo de 4 puertas con maletero separado' },
  { value: 'hatchback', label: 'Hatchback', description: 'Vehículo compacto con portón trasero' },
  { value: 'suv', label: 'SUV', description: 'Vehículo utilitario deportivo' },
  { value: 'crossover', label: 'Crossover', description: 'Cruce entre SUV y hatchback' },
  { value: 'coupe', label: 'Coupé', description: 'Vehículo deportivo de 2 puertas' },
  { value: 'convertible', label: 'Convertible', description: 'Vehículo con techo convertible' },
  { value: 'wagon', label: 'Familiar', description: 'Vehículo familiar con espacio de carga' },
  { value: 'van', label: 'Furgoneta', description: 'Vehículo comercial o de pasajeros' },
  { value: 'minivan', label: 'Monovolumen', description: 'Vehículo familiar de gran capacidad' },
  { value: 'pickup', label: 'Pick-up', description: 'Vehículo con área de carga abierta' },
  { value: 'sports', label: 'Deportivo', description: 'Vehículo de altas prestaciones' },
  { value: 'luxury', label: 'Lujo', description: 'Vehículo de alta gama' },
];

// Service functions
export const getVehicleBrands = (): VehicleBrand[] => {
  return vehicleBrands.sort((a, b) => a.name.localeCompare(b.name));
};

export const getModelsByBrand = (brandId: string): VehicleModel[] => {
  return vehicleModels
    .filter(model => model.brandId === brandId)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getAvailableYears = (modelId: string): number[] => {
  const model = vehicleModels.find(m => m.id === modelId);
  if (!model) return [];
  
  const currentYear = new Date().getFullYear();
  const endYear = model.yearEnd || currentYear;
  const years: number[] = [];
  
  for (let year = endYear; year >= model.yearStart && year >= 2010; year--) {
    years.push(year);
  }
  
  return years;
};

export const getVehicleTypeForModel = (modelId: string): VehicleType | null => {
  const model = vehicleModels.find(m => m.id === modelId);
  return model?.type || null;
};

export const getBrandById = (brandId: string): VehicleBrand | null => {
  return vehicleBrands.find(brand => brand.id === brandId) || null;
};

export const getModelById = (modelId: string): VehicleModel | null => {
  return vehicleModels.find(model => model.id === modelId) || null;
};

// Mock license plate detection service
export const detectVehicleFromPlate = async (plate: string): Promise<PlateDetectionResult | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data based on common Spanish plates
  const mockDetections: { [key: string]: PlateDetectionResult } = {
    '1234ABC': {
      make: 'Mercedes-Benz',
      model: 'Clase E',
      year: 2020,
      type: 'sedan',
      color: 'Negro',
      confidence: 0.95
    },
    '5678DEF': {
      make: 'BMW',
      model: 'Serie 5',
      year: 2019,
      type: 'sedan',
      color: 'Blanco',
      confidence: 0.92
    },
    '9012GHI': {
      make: 'Audi',
      model: 'A6',
      year: 2021,
      type: 'sedan',
      color: 'Gris',
      confidence: 0.88
    },
    '3456JKL': {
      make: 'Toyota',
      model: 'Prius',
      year: 2020,
      type: 'hatchback',
      color: 'Azul',
      confidence: 0.85
    }
  };
  
  // Clean plate format
  const cleanPlate = plate.replace(/\s+/g, '').toUpperCase();
  
  // Check if we have mock data for this plate
  if (mockDetections[cleanPlate]) {
    return mockDetections[cleanPlate];
  }
  
  // Return null if no detection found
  return null;
};

// Utility function to format vehicle type for display
export const formatVehicleType = (type: VehicleType): string => {
  const typeInfo = vehicleTypes.find(t => t.value === type);
  return typeInfo?.label || type;
};
