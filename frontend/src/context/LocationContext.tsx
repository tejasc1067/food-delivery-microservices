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

  // Avoid hydration layout shift by just using state directly. It might cause a tiny 
  // server/client text mismatch on first render but it functions perfectly.

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
