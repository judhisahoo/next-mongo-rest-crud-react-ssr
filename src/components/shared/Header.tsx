'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { logout } from '@/lib/store/features/auth/authSlice';
import { getLocalStorageWithExpiration } from '@/lib/helper/storage';

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
                    className="hover:text-gray-200 transition-colors"
                  >
                    Cart
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
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link
                        href="/me"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
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
