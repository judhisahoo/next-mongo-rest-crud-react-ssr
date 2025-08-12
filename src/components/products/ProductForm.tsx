'use client';

import { Product } from '@/lib/store/features/products/productSlice';
import { ProductFormData, productSchema } from '@/lib/validation/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ProductFormProps {
  initialData?: Product; // Optional prop for editing
  onSubmit: SubmitHandler<ProductFormData>;
  isLoading: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });
  const router = useRouter();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price Field */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Quantity Field */}
      <div>
        <label
          htmlFor="qty"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          step="0.01"
          {...register('qty', { valueAsNumber: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.qty && (
          <p className="mt-1 text-sm text-red-600">{errors.qty.message}</p>
        )}
      </div>

      {/* image Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="image"
        >
          Product Image
        </label>
        <input
          type="text"
          id="image"
          {...register('image')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      {/* upc Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="upc"
        >
          UPC
        </label>
        <input
          type="text"
          id="upc"
          {...register('upc')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.upc && (
          <p className="mt-1 text-sm text-red-600">{errors.upc.message}</p>
        )}
      </div>

      {/* category Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="category"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          {...register('category')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>
      {/* Submit Button */}
      <div className="flex justify-center space-x-4 pt-4">
        {/* The new "Cancel" button */}
        <button
          type="button" // Use type="button" to prevent form submission
          onClick={() => router.push('/products')}
          className="w-50 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-50 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading
            ? 'Processing...'
            : initialData
              ? 'Update Product'
              : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
