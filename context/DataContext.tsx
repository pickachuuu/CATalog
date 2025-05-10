import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Category } from '../types/types';

type DataContextType = {
  refreshData: () => Promise<void>;
  refreshTrigger: number;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(async () => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <DataContext.Provider value={{ refreshData, refreshTrigger }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}