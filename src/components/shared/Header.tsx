'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { logout } from '@/lib/store/features/auth/authSlice';
import { getTotalCartQty } from '@/lib/store/features/cart/cartSlice';
//import { getLocalStorageWithExpiration } from '@/lib/helper/storage';

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const totalCartQuantity = useAppSelector(getTotalCartQty);

  // State to control the visibility of the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref to hold the timeout ID so we can clear it
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the dropdown after a short delay (e.g., 300ms)
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const redirectPath = pathName !== '/' ? `?redirect=${pathName}` : '';

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <Link
          href="/"
          className="text-xl font-bold hover:text-gray-200 transition-colors"
        >
          Your App
        </Link>
        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/products"
                className="hover:text-gray-200 transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-200 transition-colors"
              >
                Contact
              </Link>
            </li>
            {/* Conditional Links based on auth state */}
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/products/add-product"
                    className="hover:text-gray-200 transition-colors"
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="relative flex items-center hover:text-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.023.854l.153 1.134a.823.823 0 01-.061.564L4.73 10.5M12.25 15.75h5.36a1.045 1.045 0 001.036-.88L21.75 6H6.124a1.5 1.5 0 01-1.423-1.891l-.153-1.134A.823.823 0 014.136 3H2.25"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                    </svg>{' '}
                    {totalCartQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {totalCartQuantity}
                      </span>
                    )}
                  </Link>
                </li>
                {/* My Account Dropdown */}
                <li
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center hover:text-gray-200 transition-colors">
                    My Account
                  </button>
                  {isDropdownOpen && (
                    <div className="z-3 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link
                        href="/me"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/change-password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Change Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li>
                <Link
                  href={`/login${redirectPath}`}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
