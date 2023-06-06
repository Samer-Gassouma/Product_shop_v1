import Image from "next/image";
import Link from "next/link";

export default function ProductBox({ _id, title, description, price, images }) {
  return (
    <div className="w-72 p-4 rounded-lg shadow-lg flex flex-col">
      <Link href={`/Product/${_id}`}>
        
          <Image
            src={images[0]}
            width={300}
            height={200}
            className="w-full h-48 object-cover mb-4 rounded-lg"
            alt={title}
          />
        
      </Link>
      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {description}
        </p>
        <p className="text-lg text-gray-600">{price} dt</p>
      </div>
      <button className="mt-auto bg-gray-300 text-black px-8 py-2 rounded-full hover:bg-gray-600 hover:text-white hover:border-gray-800">
        Add to Cart
      </button>
    </div>
  );
}
