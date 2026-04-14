'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const LOCATIONS = ["Mumbai", "Pune", "Pandharpur", "Nagpur", "Nashik", "Sangli", "Kolhapur", "Satara", "Latur", "Nanded"];

interface LocationContextType {
  location: string;
  setLocation: (loc: string) => void;
  locations: string[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<string>("Pandharpur");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('foodie_location');
    if (saved && LOCATIONS.includes(saved)) {
      setLocationState(saved);
    }
  }, []);

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem('foodie_location', loc);
  };



  return (
    <LocationContext.Provider value={{ location: mounted ? location : "Pandharpur", setLocation, locations: LOCATIONS }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}
