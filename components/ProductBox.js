import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

export default function ProductBox({ _id, title, description, price, images }) {
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
      {description.length > 20 ? (
        <p className="text-gray-600 line-clamp-3 mb-4">{description.substring(0, 20)}...</p>
      ) : (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
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

ProductBox.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
