// src/components/products/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/store/features/products/productSlice';
import { useAppSelector } from '@/lib/store/store'; // Import the hook

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Access the authentication status directly from Redux
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-200 relative">
        <Link href={`/products/${product._id}`} className="block">
          <Image
            src={product.image} // Assuming your product object has an 'image' URL
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </Link>
      </div>
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 truncate">
          <Link href={`/products/${product._id}`} className="block">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-2xl font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </p>

        {/* Conditional Links based on authentication status */}
        <div className="mt-4 flex space-x-2">
          {/* Always show View Details link */}
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            View Details
          </Link>

          {isAuthenticated && (
            <>
              {/* Show Edit and Delete links only when authenticated */}
              <Link
                href={`/products/edit/${product._id}`}
                className="flex-1 flex items-center justify-center bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors"
              >
                Edit
              </Link>
              <button className="flex-1 text-center bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
