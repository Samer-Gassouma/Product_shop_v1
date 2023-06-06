import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import axios from "axios";


const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repassword) {
      setMessage("Passwords do not match");
      return;
    }
    e.preventDefault();
    try {
      const response = await axios.post("/api/storeUser", {
        email,
        password,
      });
      if (response.data.error) {
        setMessage(response.data.error);
        return;
      }

        setMessage(response.data.message);
    } catch (error) {
      console.error("Error storing user in the database:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-10">
        
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 shadow-md rounded-md w-full max-w-md transform hover:scale-105"
      >
        <div className="text-center">
            <p className="text-white">{message}</p>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1 text-white">
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
            <label htmlFor="password" className="block font-medium mb-1 text-white">
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
          <div className="mb-4">
            <label htmlFor="re-password" className="block font-medium mb-1 text-white">
             Re-Password:
            </label>
            <input
              type="password"
              id="repassword"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
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
            Sign In
          </motion.button>
        </form>
      </motion.div>
    </div>
    </Layout>
  );
};

export default SignInPage;
