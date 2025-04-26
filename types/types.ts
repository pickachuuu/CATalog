export interface Category {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string; 
    image?: string;
    quantity: number;
    lowStockThreshold?: number; 
    category?: string; 
}
