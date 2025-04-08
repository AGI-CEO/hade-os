"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type TenantContextType = {
  refreshTenants: () => void;
  refreshTrigger: number;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTenants = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <TenantContext.Provider value={{ refreshTenants, refreshTrigger }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider");
  }
  return context;
}
