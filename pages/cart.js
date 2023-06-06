import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Image from "next/image";
import Layout from "@/components/Layout";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import { useTheme } from "next-themes";

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
      setUserEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, [clearCart]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment(e) {
    e.preventDefault();
    const response = await axios.post("/api/checkout", {
      name,
      userEmail,
      phone,
      city,
      postalCode,
      address,
      cartProducts,
      total,
    });

    if (response.status === 200) {
      window.location = "/cart?success=" + response.data.sessionId;
      setIsSuccess(true);
      clearCart();
    } else {
      alert("Something went wrong!");
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (isSuccess) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <div className="bg-white rounded-lg p-6 shadow-md text-black ">
            <h1 className="text-2xl font-bold mb-4">
              Thanks for your order!
            </h1>
            <p>We will email you when your order will be sent.</p>
            <p className="text-black justify-center items-center flex gap-2">
              Your order id is:{" "}
              {window.location.href.split("success=")[1].split("#")[0]}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userId) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <div className="bg-blue-200 rounded-lg p-6 shadow-md">
            <h1 className="text-black text-2xl font-bold mb-4">
              You need to login first!
            </h1>
            <p className="text-black justify-center items-center flex gap-2">
              <Link href="/login">
                <div className="text-blue-500 hover:underline">Login</div>
              </Link>{" "}
              or{"  "}
              <Link href="/register">
                <div className="text-blue-500 hover:underline">Register</div>
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-32">
        {!cartProducts?.length && <div>Your cart is empty</div>}
        {products?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cart */}
            <div className={`rounded-lg p-6 shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
              <div className="flex flex-col space-y-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th className="text-left">Quantity</th>
                      <th className="text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <Link href={`/Product/${product._id}`}>
                              <Image
                                className="w-10 h-10 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 ring-2 ring-blue-500"
                                src={product.images[0]}
                                alt=""
                                width={60}
                                height={60}
                              />
                            </Link>
                          </div>
                          <span>{product.title}</span>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <button
                              className={`${
                                isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-2 py-1 rounded-md`}
                              onClick={() => lessOfThisProduct(product._id)}
                            >
                              -
                            </button>
                            <span className="px-2">
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </span>
                            <button
                              className={`${
                                isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-2 py-1 rounded-md`}
                              onClick={() => moreOfThisProduct(product._id)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          {cartProducts.filter((id) => id === product._id)
                            .length * product.price}{" "}
                          dt
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Total:</h3>
                    <p className="text-lg font-semibold">{total} dt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className={`rounded-lg p-6 shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
              <form>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      name="name"
                      onChange={(ev) => setName(ev.target.value)}
                      required
                      className={`w-full border ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      } rounded-md px-3 py-2`}
                    />
                  </div>
                 
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      name="phone"
                      onChange={(ev) => setPhone(ev.target.value)}
                      required
                      className={`w-full border ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      } rounded-md px-3 py-2`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={address}
                      onChange={(ev) => setAddress(ev.target.value)}
                      required
                      className={`w-full border ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      } rounded-md px-3 py-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      name="city"
                      onChange={(ev) => setCity(ev.target.value)}
                      required
                      className={`w-full border ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      } rounded-md px-3 py-2`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium"
                    >
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      name="postalCode"
                      onChange={(ev) => setPostalCode(ev.target.value)}
                      required
                      className={`w-full border ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      } rounded-md px-3 py-2`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`${
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-md mt-4`}
                  onClick={goToPayment}
                >
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
