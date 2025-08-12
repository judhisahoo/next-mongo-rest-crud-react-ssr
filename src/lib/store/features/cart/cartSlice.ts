import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/lib/store/features/products/productSlice';
import { RootState } from '../../store';

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
const getInitialCartState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const cartData = localStorage.getItem('cart');
      return {
        items: cartData ? JSON.parse(cartData) : [],
      };
    } catch (error) {
      console.error('Failed to parse cart data from localStorage:', error);
    }
  }
  return { items: [] };
};

const initialState: CartState = getInitialCartState();

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeCart: (state, action: PayloadAction<string>) => {
      // Remove an item by its product ID
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload,
      );
      // Save cart to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    emptyCart: (state) => {
      // Empty the entire cart
      state.items = [];
      // Clear cart from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
  },
});

export const { addCart, removeCart, emptyCart, updateCart } = cartSlice.actions;

// New selector to calculate the total quantity of all items in the cart
export const getTotalCartQty = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
