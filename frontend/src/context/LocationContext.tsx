import {
  createContext,
  useContext,
  useState,
} from "react";

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (
    location: string
  ) => void;
}

const LocationContext =
  createContext<
    LocationContextType | undefined
  >(undefined);

export function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState("");

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context =
    useContext(
      LocationContext
    );

  if (!context) {
    throw new Error(
      "useLocation must be used inside LocationProvider"
    );
  }

  return context;
}