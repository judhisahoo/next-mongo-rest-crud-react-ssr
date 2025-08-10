// src/app/products/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
} from '@/lib/store/features/products/productSlice';
import { getAllProducts } from '@/lib/api/api';
import ProductCard from '@/components/products/ProductCard';
import Pagination from '@/components/Pagination'; // You'll need to create this component
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 4; // Define the number of products per page

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, status, error, currentPage, totalPages } = useAppSelector(
    (state) => state.products,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // This effect will run when the component mounts or when the currentPage changes
    const fetchProductsData = async () => {
      try {
        dispatch(setLoading());
        // Pass currentPage and PRODUCTS_PER_PAGE to the API helper
        const data = await getAllProducts(currentPage, PRODUCTS_PER_PAGE);
        console.log('all products ::', data);
        dispatch(setProducts(data));
      } catch (err: unknown) {
        dispatch(setError(err.message || 'Failed to fetch products'));
      }
    };
    fetchProductsData();
  }, [currentPage, dispatch]); // Dependency array includes currentPage

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Our Products</h1>
        {isAuthenticated && (
          <Link
            href="/products/add-product"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Product
          </Link>
        )}
      </div>

      {status === 'loading' && (
        <p className="text-center text-lg text-gray-600">Loading products...</p>
      )}
      {status === 'failed' && (
        <p className="text-center text-lg text-red-500">Error: {error}</p>
      )}

      {status === 'succeeded' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
