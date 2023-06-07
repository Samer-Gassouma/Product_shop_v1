import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mongooseConnect } from "@/lib/mongoose";
import { group_products } from "@/models/Group_Prod";
import { Product } from "@/models/Product";
import Link from "next/link";
import Loader from "../Loading";
import jwt_decode from "jwt-decode";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

export default function Item({ Grp_product, products }) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  if (router.isFallback || isLoading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="min-h-screen pt-16 container mx-auto p-4">
        <GroupsPage Grp_product={Grp_product} products={products} userId={userId} />
      </div>
    </Layout>
  );
}

function GroupsPage({ Grp_product, products, userId }) {
  const { addProduct } = useContext(CartContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{Grp_product.title}</h2>
      <div className="flex items-center justify-center mb-6">
        <Image
          src={Grp_product.images[0]}
          alt={Grp_product.title}
          width={300}
          height={200}
          className="w-full h-64 object-cover rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((element) => (
          <div
            key={element.id}
            className="shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl "
          >
            <Link href={`/Product/${element.id}`}>
                <div className="relative bg-white">
                  <Image
                    src={element.images}
                    alt={element.title}
                    width={300}
                    height={200}
                    className="w-full h-64 object-cover rounded-t-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-80 rounded-b-md">
                    <h3 className="text-lg text-gray-800 font-semibold mb-2">{element.title}</h3>
                    <p className="text-gray-600">{element.price} dt</p>
                  </div>
                </div>  
              
            </Link>
            {userId ? (
              <button  onClick={() => addProduct(element.id)}  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-b-md">
                Add to Cart
              </button>
            ) : (
              <Link href="/login">
                <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-b-md">
                  Add to Cart
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const Grp_product = await group_products.findById(id).populate("Group_Prod");
  const groupProdArray = Object.values(Grp_product.Group_Prod);

  const productIds = groupProdArray.map((product) => product);

  // Fetching the details of each product from the Product table
  const products = await Product.find({ _id: { $in: productIds } });

  // Creating an array of product details
  const productDetails = products.map((product) => {
    return {
      id: product._id,
      title: product.title,
      images: product.images[0],
      price: product.price,
    };
  });

  return {
    props: {
      Grp_product: JSON.parse(JSON.stringify(Grp_product)),
      products: JSON.parse(JSON.stringify(productDetails)),
    },
  };
}
