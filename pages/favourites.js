import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { mongooseConnect } from "@/lib/mongoose";
import Like from "@/models/Like";
import { Product } from "@/models/Product";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import Link from "next/link";
import Image from "next/image";
export default function FavoritesPage({ products }) {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Favorites</h1>
        {products && products.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((productGroup, index) => (
              <li key={index} className="p-4">
                {productGroup.map((product) => (
                  <ProductBox key={product._id} {...product} />
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No favorites yet.</p>
        )}
      </div>
    </Layout>
  );
}

function ProductBox({ _id, title, description, price, images }) {
  const { addProduct } = useContext(CartContext);
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <Link href={`/Product/${_id}`}>
        <Image
          src={images[0]}
          width="100"
          height={48}
          className="w-full h-48 object-cover mb-4 rounded-lg"
          alt={title}
        />
      </Link>
      <h3 className="text-gray-600 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 line-clamp-3 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-gray-700">{price} dt</p>
        <button
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          onClick={() => addProduct(_id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const token = context.req.cookies.token;
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.userId;
  const likeDoc = await Like.find({ user: userId });
  const productPromises = likeDoc.map(async (item) => {
    const product = await Product.find({ _id: { $in: item.productId } });
    return product;
  });

  const products = await Promise.all(productPromises);

  return {
    props: {
      likeDoc: JSON.parse(JSON.stringify(likeDoc)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
