'use client';
import { getProductDetails } from '@/lib/api/api';
import {
  Product,
  setLoading,
} from '@/lib/store/features/products/productSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { addCart } from '@/lib/store/features/cart/cartSlice';
export default function ProductDetailsPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const params = useParams();
  const pathName = usePathname();
  const [prodqty, setProdqty] = useState(1);

  const productId = params.Id; // Correctly get the ID from params.Id
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qtyerr, setQtyerr] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const redirectPath = pathName !== '/' ? `?redirect=${pathName}` : '';

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        //console.log('productId before call getProductDetails() ::', productId);
        const fetchProduct = await getProductDetails(productId);
        console.log(
          'fetchProduct after call getProductDetails() ::',
          fetchProduct,
        );
        setProduct(fetchProduct);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const login4Cart = () => {
    router.push(`/login${redirectPath}`);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //get input value as string
    const value = e.target.value;
    // Parse the value to an integer. If parsing fails (e.g., empty string), default to 1.
    const newQuantity = parseInt(value);
    setProdqty(newQuantity > 0 ? newQuantity : 0);
  };

  const addToCart = () => {
    console.log('product :::', product);
    if (prodqty > 0) {
      // now start working on add to cat here
      console.log('prodqty ::', prodqty);
      console.log('productId ::', productId);
      if (product) {
        if (isAuthenticated) {
          dispatch(addCart({ product, quantity: prodqty }));
          // Optional: Add a success message or redirect to the cart page
          console.log(`Added ${prodqty} of ${product.name} to cart.`);
        } else {
          // show login screen to login
        }
      }
    } else {
      setQtyerr('Please add quantity.');
    }
  };

  console.log('product :::::::::::::::::::::::', product);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p className="text-xl mb-4 font-semibold">{error}</p>
        <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Product not found.</p>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden md:max-w-3xl w-full">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="relative h-96 w-full md:w-96">
              <Image
                src={product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
                className="md:rounded-l-xl"
              />
            </div>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Product Details
            </div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-gray-500">{product.description}</p>
            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Price:</span>
                <span className="text-gray-900 font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {product.qty}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">UPC:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {product.upc}
                </span>
              </div>
            </div>
            <div className="mt-8">
              {qtyerr && (
                <p className="text-sm font-medium text-red-600 text-center px-2 py-2">
                  {qtyerr}
                </p>
              )}
              {isAuthenticated ? (
                <>
                  <input
                    min={1}
                    type="number"
                    id="prodqty"
                    name="prodqty"
                    value={prodqty}
                    onChange={handleQtyChange}
                    className="w-20 px-2 py-2 mx-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={addToCart}
                    className="w-25 py-2 px-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Add to Cart{' '}
                  </button>
                </>
              ) : (
                <button
                  onClick={login4Cart}
                  className="w-40 py-2 px-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Login for add to Cart{' '}
                </button>
              )}
            </div>
            <div className="mt-8">
              <button
                onClick={() => router.back()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
