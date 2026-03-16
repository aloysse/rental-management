import React, { createContext, useContext, useState } from "react";

type VersionContextType = {
  isUpgrade: boolean;
  setIsUpgrade: (v: boolean) => void;
};

const VersionContext = createContext<VersionContextType>({
  isUpgrade: false,
  setIsUpgrade: () => {},
});

export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [isUpgrade, setIsUpgrade] = useState(false);
  return (
    <VersionContext.Provider value={{ isUpgrade, setIsUpgrade }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  return useContext(VersionContext);
}
