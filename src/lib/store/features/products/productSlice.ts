// src/lib/store/features/products/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// src/lib/store/features/products/productSlice.ts
// ... imports and Product interface
// Define the product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
  user: {
    _id: string;
    email: string;
  };
}

interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number; // Added
  totalPages: number; // Added
  totalProducts: number; // Added
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
  currentPage: 1, // Added
  totalPages: 1, // Added
  totalProducts: 0, // Added
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{
        products: Product[];
        currentPage: number;
        totalPages: number;
        total: number;
      }>,
    ) => {
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalProducts = action.payload.total;
      state.status = 'succeeded';
      state.error = null;
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload; // Added a new reducer to change the page
    },
  },
});

export const { setProducts, setLoading, setError, setCurrentPage } =
  productsSlice.actions;
export default productsSlice.reducer;
