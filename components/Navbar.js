import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import jwt_decode from "jwt-decode";
import DarkMode from "./darkmode";
const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [isDrop, setIsDrop] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserEmail(decodedToken.email);
      setUserId(decodedToken.userId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleDrop = () => {
    setIsDrop(!isDrop);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const { cartProducts } = useContext(CartContext);
  return (
    <nav className="bg-black fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 justify-center">
            <Link href="/">
              <div className="text-white font-bold text-2xl">boggy</div>
            </Link>
          <DarkMode />
          </div>
          <div className="flex sm:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className={`${isMenuOpen ? "hidden" : "block"}`}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 4H4v2h16v-2zm0 4H4v2h16v-2z"
                />
                <path
                  className={`${isMenuOpen ? "block" : "hidden"}`}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 9H4v2h2V9zm0 5H4v2h2v-2zm13-5h-2v2h2V9zm0 5h-2v2h2v-2zm0 5h-2v2h2v-2z"
                />
              </svg>
            </button>
          </div>
          
          <div className="hidden sm:flex space-x-4">
            <Link href="/Products">
              <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Products
              </div>
            </Link>
            <Link href="/groups">
              <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Groups
              </div>
            </Link>
            <Link href="/contact">
              <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Contact
              </div>
            </Link>
            <Link href="/cart">
              <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex gap-2">
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
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                Cart ({cartProducts.length})
              </div>
            </Link>
            {userId ? (
              <div className="relative">
                <button
                  type="button"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex gap-2"
                  onClick={toggleDrop}
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
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Profile
                </button>
                {isDrop && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link href="/favourites">
                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                          Favourites
                        </div>
                      </Link>
                      <button
                        type="button"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex gap-2">
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div
        className={`sm:hidden transition-all duration-300 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/Products">
            <div className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
              Products
            </div>
          </Link>
          <Link href="/groups">
            <div className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
              Groups
            </div>
          </Link>
          <Link href="/contact">
            <div className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
              Contact
            </div>
          </Link>
          <Link href="/cart">
            <div className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline-block align-text-bottom"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              Cart ({cartProducts.length})
            </div>
          </Link>
          {userId ? (
            <div className="relative">
              <Link href="/favourites">
                <div className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 inline-block align-text-bottom"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  Favourites
                </div>
              </Link>

              <button
                type="button"
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block align-text-bottom"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex gap-2">
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
