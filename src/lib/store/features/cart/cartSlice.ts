import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/lib/store/features/products/productSlice';

// Define the shape of a single item in the cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the shape of the entire cart state
export interface CartState {
  items: CartItem[];
}

// Function to get the cart from localStorage
const getStoredCart = (): CartState => {
  if (typeof window !== 'undefined') {
    const storeCart = localStorage.getItem('cart');
    return storeCart ? JSON.parse(storeCart) : { items: [] };
  }
  return { items: [] };
};

const initialState: CartState = getStoredCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id,
      );
      if (existingItem) {
        // If the item already exists, update its quantity
        existingItem.quantity += quantity;
      } else {
        // Otherwise, add the new item to the cart
        state.items.push({ product, quantity });
      }
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCart: (state, action: PayloadAction<string>) => {
      // Remove an item by its product ID
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload,
      );
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    emptyCart: (state) => {
      // Empty the entire cart
      state.items = [];
      // Clear cart from localStorage
      localStorage.removeItem('cart');
    },
    // New Reducer: Correctly updates the quantity of an existing item
    updateCart: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.product._id === id);
      if (existingItem) {
        // This is the critical change: Use '=' to set the new quantity
        existingItem.quantity = quantity;
      }
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addCart, removeCart, emptyCart, updateCart } = cartSlice.actions;

export default cartSlice.reducer;
