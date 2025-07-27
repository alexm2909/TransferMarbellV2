import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Trip {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  children: number;
  luggage: number;
  vehicleType: string;
  flightNumber?: string;
  estimatedPrice: number;
  distance?: string;
  duration?: string;
  status: 'available' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  specialRequests?: string;
}

interface TripContextType {
  availableTrips: Trip[];
  assignedTrips: Trip[];
  completedTrips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'createdAt'>) => void;
  acceptTrip: (tripId: string, driverId: string, driverName: string) => void;
  rejectTrip: (tripId: string) => void;
  completeTrip: (tripId: string) => void;
  getRecentAvailableTrips: (limit?: number) => Trip[];
  getTotalAvailableCount: () => number;
  getDriverTrips: (driverId: string) => Trip[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('transfermarbell-trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading trips from localStorage:', error);
      }
    }
    
    // Return some mock data for demonstration
    return [
      {
        id: 'trip-001',
        clientId: 'client-001',
        clientName: 'María González',
        clientPhone: '+34 612 345 678',
        origin: 'Aeropuerto de Málaga (AGP)',
        destination: 'Hotel Majestic, Marbella',
        date: '2024-12-30',
        time: '14:30',
        passengers: 2,
        children: 0,
        luggage: 2,
        vehicleType: 'comfort',
        flightNumber: 'IB6754',
        estimatedPrice: 45,
        distance: '65 km',
        duration: '55 min',
        status: 'available',
        createdAt: '2024-12-27 10:15',
        specialRequests: 'Asiento de bebé requerido',
      },
      {
        id: 'trip-002',
        clientId: 'client-002',
        clientName: 'Carlos Ruiz',
        clientPhone: '+34 655 987 321',
        origin: 'Hotel Villa Padierna, Benahavís',
        destination: 'Aeropuerto de Gibraltar (GIB)',
        date: '2024-12-29',
        time: '09:00',
        passengers: 4,
        children: 2,
        luggage: 4,
        vehicleType: 'van',
        estimatedPrice: 85,
        distance: '45 km',
        duration: '45 min',
        status: 'available',
        createdAt: '2024-12-27 11:30',
      },
      {
        id: 'trip-003',
        clientId: 'client-003',
        clientName: 'Ana Fernández',
        clientPhone: '+34 600 123 456',
        origin: 'Puerto Banús Marina',
        destination: 'Estación de Tren María Zambrano, Málaga',
        date: '2024-12-28',
        time: '16:45',
        passengers: 1,
        children: 0,
        luggage: 1,
        vehicleType: 'economy',
        estimatedPrice: 35,
        distance: '75 km',
        duration: '1h 10min',
        status: 'available',
        createdAt: '2024-12-27 09:45',
      },
    ];
  });

  // Save to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem('transfermarbell-trips', JSON.stringify(trips));
  }, [trips]);

  const availableTrips = trips.filter(trip => trip.status === 'available');
  const assignedTrips = trips.filter(trip => trip.status === 'assigned' || trip.status === 'in_progress');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

  const addTrip = (tripData: Omit<Trip, 'id' | 'status' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    
    setTrips(prev => [...prev, newTrip]);
  };

  const acceptTrip = (tripId: string, driverId: string, driverName: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            status: 'assigned' as const,
            assignedDriverId: driverId,
            assignedDriverName: driverName,
            acceptedAt: new Date().toISOString()
          }
        : trip
    ));
  };

  const rejectTrip = (tripId: string) => {
    // For now, we'll just remove rejected trips
    // In a real app, you might want to track rejections
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  };

  const completeTrip = (tripId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            status: 'completed' as const,
            completedAt: new Date().toISOString()
          }
        : trip
    ));
  };

  const getRecentAvailableTrips = (limit: number = 3) => {
    return availableTrips
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  const getTotalAvailableCount = () => {
    return availableTrips.length;
  };

  const getDriverTrips = (driverId: string) => {
    return trips.filter(trip => trip.assignedDriverId === driverId);
  };

  return (
    <TripContext.Provider
      value={{
        availableTrips,
        assignedTrips,
        completedTrips,
        addTrip,
        acceptTrip,
        rejectTrip,
        completeTrip,
        getRecentAvailableTrips,
        getTotalAvailableCount,
        getDriverTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips(): TripContextType {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
