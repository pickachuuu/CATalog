import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Category } from '../types/types';
import * as Storage from '@/services/storage';

type DataContextType = {
  products: Product[];
  categories: Category[];
  refreshData: () => Promise<void>;
  refreshTrigger: number;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(async () => {
    try {
      const [newProducts, newCategories] = await Promise.all([
        Storage.getProducts(),
        Storage.getCategories(),
      ]);
      setProducts(newProducts);
      setCategories(newCategories);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      await Storage.updateProduct(product);
      await refreshData();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, [refreshData]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await Storage.deleteProduct(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }, [refreshData]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      await Storage.addProduct(product);
      await refreshData();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, [refreshData]);

  const updateCategory = useCallback(async (category: Category) => {
    try {
      await Storage.updateCategory(category);
      await refreshData();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }, [refreshData]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await Storage.deleteCategory(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }, [refreshData]);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    try {
      await Storage.addCategory(category);
      await refreshData();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }, [refreshData]);

  // Load initial data
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DataContext.Provider value={{
      products,
      categories,
      refreshData,
      refreshTrigger,
      updateProduct,
      deleteProduct,
      addProduct,
      updateCategory,
      deleteCategory,
      addCategory,
    }}>
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