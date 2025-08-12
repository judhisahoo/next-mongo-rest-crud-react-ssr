'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
  removeProduct,
} from '@/lib/store/features/products/productSlice';
import { getAllProducts, deleteProduct } from '@/lib/api/api';
import ProductCard from '@/components/products/ProductCard';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { AxiosError } from 'axios';

const PRODUCTS_PER_PAGE = 4;

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, status, error, currentPage, totalPages } = useAppSelector(
    (state) => state.products,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        dispatch(setLoading());
        const data = await getAllProducts(currentPage, PRODUCTS_PER_PAGE);
        dispatch(setProducts(data));
      } catch (err: unknown) {
        dispatch(
          setError((err as Error).message || 'Failed to fetch products'),
        );
      }
    };
    fetchProductsData();
  }, [currentPage, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleDeleteClick = (id: string) => {
    setProductIdToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return;

    try {
      await deleteProduct(productIdToDelete);
      dispatch(removeProduct(productIdToDelete));
      setProductIdToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        (err as AxiosError)?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to delete product.';
      dispatch(setError(errorMessage));
      setProductIdToDelete(null);
    }
  };

  if (status === 'loading') {
    return (
      <p className="text-center text-lg text-gray-600">Loading products...</p>
    );
  }

  if (status === 'failed') {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          // The fix is here: passing the handleDeleteClick function as the onDelete prop
          <ProductCard
            key={product._id}
            product={product}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {productIdToDelete && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-20 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setProductIdToDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
