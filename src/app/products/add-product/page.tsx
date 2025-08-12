'use client';
import ProductForm from '@/components/products/ProductForm';
import { addProduct } from '@/lib/api/api';
import { ProductFormData } from '@/lib/validation/product';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = async (formData: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      //console.log('formData ::', formData);
      const dataToSubmit = {
        ...formData,
        status: true,
      };
      await addProduct(dataToSubmit);
      router.push('/products');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Failed to add product.');
      } else if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-5">Add/Edit Product</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ProductForm onSubmit={handleAddProduct} isLoading={isLoading} />
    </div>
  );
}
