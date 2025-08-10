'use client';
import { removeCart, updateCart } from '@/lib/store/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import Image from 'next/image';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  console.log('cartItems ::', cartItems);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shipping = 5.0;
  const total = subtotal + shipping;

  const removeItem = (id: string) => {
    console.log('id ::', id);
    dispatch(removeCart(id));
  };

  const handleUpdateQty = (id: string, qty: number) => {
    const newQty = parseInt(qty);
    if (newQty > 0) {
      dispatch(updateCart({ id, quantity: newQty }));
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Your Cart
      </h1>
      {cartItems.length == 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <p className="text-xl font-semibold mb-4"> Your cart is empty</p>
          <p>Go back and add some products!</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* cart item list*/}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-4 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                      alt={item.product.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <input
                      id={`quantity-${item.product._id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQty(
                          item.product._id,
                          parseInt(e.target.value) || 1, // Ensure quantity is a number and is at least 1
                        )
                      }
                      className="w-20 border border-gray-300 rounded-md text-center py-1 text-lg"
                    />
                  </div>
                </div>
                <button
                  className=""
                  onClick={() => removeItem(item.product._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full py-3 mt-4 text-white font-bold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
