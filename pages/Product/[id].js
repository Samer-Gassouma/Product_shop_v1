import Layout from "@/components/Layout";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { ObjectId } from "mongodb";
import Comment from "@/models/comments";
import Like from "@/models/Like";

export default function Prod({
  product,
  recommendedProducts,
  comments2,
  isLiked,
}) {
  return (
    <Layout>
      <ProductPage
        product={product}
        recommendedProducts={recommendedProducts}
        comments2={comments2}
        isLiked2={isLiked}
      />
    </Layout>
  );
}

function ProductPage({ product, recommendedProducts, comments2, isLiked2 }) {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLiked, setIsLiked] = useState(isLiked2);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
      setUserEmail(decodedToken.email);
    }
  }, []);

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const { addProduct } = useContext(CartContext);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(comments2);
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCommentSubmit = async () => {
    const newComment = {
      user: userEmail,
      comment,
    };
    const updatedComments = [...comments, newComment];

    setComments(updatedComments);
    setComment("");

    try {
      const response = await fetch(`/api/products/${product._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the comment");
      }

      const data = await response.json();
      if (data.success) {
        return data;
      }
    } catch (error) {
      console.error("Error submitting the comment:", error);
    }
  };
  const handleLike = async () => {
    if (!isLiked) {
      try {
        const response = await fetch(
          `/api/products/${product._id}/Like?userId=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setIsLiked(true);
      } catch (error) {
        console.error("Error liking the product:", error);
      }
    } else {
      try {
        const response = await fetch(
          `/api/products/${product._id}/Like?userId=${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setIsLiked(false);
      } catch (error) {
        console.error("Error liking the product:", error);
      }
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8 pt-16">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center "
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full rounded-lg shadow-md mb-6"
              />
              <div className="flex justify-center space-x-2 mb-6">
                {product.images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={product.name}
                    className={`w-10 h-10 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 ${
                      selectedImage === image ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleImageClick(image)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { delay: index * 0.1 },
                    }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
              {product.description.length > 20 ? (
                <p className="text-lg mb-4">
                  {product.description.substring(0, 20)}...
                </p>
              ) : (
              <p className="text-lg mb-4">{product.description}</p>
              )}
              {userId ? (
                <div className="flex items-center mb-6">
                  <span className="text-2xl font-bold">{product.price} dt</span>
                  <motion.button
                    className={`ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addProduct(product._id)}
                  >
                    Add to Cart
                  </motion.button>
                  <motion.button
                    className={`ml-2 ${
                      isLiked ? "bg-red-500" : "bg-gray-500"
                    } hover:bg-red-600 text-white font-bold py-2 px-4 rounded`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                  >
                    {isLiked ? (
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
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    ) : (
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
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    )}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  className={`ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => history.push("/login")}
                >
                  Login to add to cart
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Comments</h3>
          <div className="space-y-4">
            {comments &&
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">{comment.user}</p>
                  <p className="text-gray-900">{comment.comment}</p>
                </div>
              ))}

            {comments.length === 0 && (
              <p className="text-gray-400">No comments yet</p>
            )}
          </div>
          {userId && (
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-2">Leave a Comment</h4>
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded"
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleCommentSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">Recommended Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.length === 0 && (
              <p className="text-gray-700">No recommended products</p>
            )}
            {recommendedProducts &&
              recommendedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="rounded-lg shadow-md overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/Product/${product._id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-40 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <h4 className="text-lg font-bold mb-2 ">{product.title}</h4>
                    <p className="">{product.price} dt</p>
                    {userId ? (
                      <button
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => addProduct(product._id)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <motion.button
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => history.push("/login")}
                      >
                        Login to add to cart
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const token = context.req.cookies.token;
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.userId;
  const product = await Product.findById(id);
  const recommendedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);
  const comments = await Comment.find({ productId: new ObjectId(product._id) });
  const like = await Like.findOne({
    productId: new ObjectId(product._id),
    user: userId,
  });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      comments2: JSON.parse(JSON.stringify(comments)),
      recommendedProducts: JSON.parse(JSON.stringify(recommendedProducts)),
      isLiked: like ? true : false,
    },
  };
}
