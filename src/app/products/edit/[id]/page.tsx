// src/app/products/edit-product/[id]/page.tsx
'use client';

import ProductForm from '@/components/products/ProductForm';
import { editProduct, getProductDetails } from '@/lib/api/api';
import { Product } from '@/lib/store/features/products/productSlice';
import { ProductFormData } from '@/lib/validation/product';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetechProduct = async () => {
      try {
        const fetchedProduct = await getProductDetails(id as string);
        setProduct(fetchedProduct);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message || 'Failed to update product.',
          );
        } else if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetechProduct();
    }
  }, [id]);

  const handleUpdateProduct = async (formData: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await editProduct(id as string, formData);
      router.push('/products');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Failed to update product.');
      } else if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-4">Loading product data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        initialData={product}
        onSubmit={handleUpdateProduct}
        isLoading={isLoading}
      />
    </div>
  );
}
