import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Category } from '../types/types';

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true
});

// Keys for storage
const PRODUCTS_KEY = 'products';
const CATEGORIES_KEY = 'categories';

// Product methods
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        // Get existing products
        const existingProducts = await getProducts();
        
        // Create new product with ID
        const newProduct: Product = {
            ...product,
            id: Date.now().toString(), // Simple ID generation
        };
        
        // Add to storage
        await storage.save({
            key: PRODUCTS_KEY,
            data: [...existingProducts, newProduct]
        });
        
        return newProduct;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const products = await storage.load({
            key: PRODUCTS_KEY
        });
        return products || [];
    } catch (error) {
        // If key doesn't exist, return empty array
        if (error instanceof Error && error.name === 'NotFoundError') {
            return [];
        }
        console.error('Error getting products:', error);
        throw error;
    }
};

export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const products = await getProducts();
        return products.find(product => product.id === id) || null;
    } catch (error) {
        console.error('Error getting product by ID:', error);
        throw error;
    }
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    try {
        const products = await getProducts();
        const updatedProducts = products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
        );
        
        await storage.save({
            key: PRODUCTS_KEY,
            data: updatedProducts
        });
        
        return updatedProduct;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        const products = await getProducts();
        const filteredProducts = products.filter(product => product.id !== id);
        
        await storage.save({
            key: PRODUCTS_KEY,
            data: filteredProducts
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Category methods
// Update addCategory to verify data persistence
export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
        const existingCategories = await getCategories();
        console.log('Existing categories:', existingCategories);
        
        const newCategory: Category = {
            ...category,
            id: Date.now().toString(),
        };
        
        const updatedCategories = [...existingCategories, newCategory];
        
        await storage.save({
            key: CATEGORIES_KEY,
            data: updatedCategories
        });
        
        // Verify save was successful
        const savedCategories = await getCategories();
        console.log('Updated categories:', savedCategories); // Debug log
        
        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

// Update getCategories to add more error context
export const getCategories = async (): Promise<Category[]> => {
    try {
        const categories = await storage.load({
            key: CATEGORIES_KEY
        });
        return categories || [];
    } catch (error) {
        if (error instanceof Error && error.name === 'NotFoundError') {
            console.log('No categories found, returning empty array');
            return [];
        }
        console.error('Error getting categories:', error);
        throw error;
    }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
        const categories = await getCategories();
        return categories.find(category => category.id === id) || null;
    } catch (error) {
        console.error('Error getting category by ID:', error);
        throw error;
    }
};

export const updateCategory = async (updatedCategory: Category): Promise<Category> => {
    try {
        const categories = await getCategories();
        const updatedCategories = categories.map(category => 
            category.id === updatedCategory.id ? updatedCategory : category
        );
        
        await storage.save({
            key: CATEGORIES_KEY,
            data: updatedCategories
        });
        
        return updatedCategory;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const categories = await getCategories();
        const filteredCategories = categories.filter(category => category.id !== id);
        
        await storage.save({
            key: CATEGORIES_KEY,
            data: filteredCategories
        });
        
        // Also update products that reference this category
        const products = await getProducts();
        const updatedProducts = products.map(product => {
            if (product.category === id) {
                return { ...product, category: undefined };
            }
            return product;
        });
        
        await storage.save({
            key: PRODUCTS_KEY,
            data: updatedProducts
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// Assign category to product
export const assignCategoryToProduct = async (productId: string, categoryId: string): Promise<Product> => {
    try {
        const product = await getProductById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        
        const category = await getCategoryById(categoryId);
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }
        
        const updatedProduct = {
            ...product,
            category: categoryId
        };
        
        return await updateProduct(updatedProduct);
    } catch (error) {
        console.error('Error assigning category to product:', error);
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
    try {
        const products = await getProducts();
        return products.filter(product => product.category === categoryId);
    } catch (error) {
        console.error('Error getting products by category:', error);
        throw error;
    }
};

// Get products with low stock
export const getLowStockProducts = async (): Promise<Product[]> => {
    try {
        const products = await getProducts();
        return products.filter(product => {
            // Check if quantity is less than or equal to lowStockThreshold
            // If lowStockThreshold is not defined, use a default of 10
            const threshold = product.lowStockThreshold ?? 10;
            return product.quantity <= threshold;
        });
    } catch (error) {
        console.error('Error getting low stock products:', error);
        throw error;
    }
};

// Clear all data (for testing or reset)
export const clearAllData = async (): Promise<void> => {
    try {
        await storage.remove({
            key: PRODUCTS_KEY
        });
        await storage.remove({
            key: CATEGORIES_KEY
        });
    } catch (error) {
        console.error('Error clearing all data:', error);
        throw error;
    }
};

export default storage;