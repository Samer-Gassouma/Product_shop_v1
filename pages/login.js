import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserEmail(decodedToken.email);
        setUserId(decodedToken.userId);
    }  
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.data.error) {
        setMessage(response.data.error);
        return;
      }

      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 1 });
      setUserEmail(response.data.email);

      // Set the authorization header for Axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage(response.data.message);
      router.push("/");
      // Redirect or perform any other actions after successful login
    } catch (error) {
      console.error("Error logging user in the database:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 shadow-md rounded-md w-full max-w-md transform hover:scale-105"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block font-medium mb-1 text-white"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block font-medium mb-1 text-white"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
            >
              Login
            </motion.button>
            <p className="text-white text-center mt-4">
              Dont have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
