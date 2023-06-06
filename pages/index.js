import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import Layout from "@/components/Layout";
import {group_products} from "@/models/Group_Prod";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Loader from "./Loading";
import Image from "next/image";

export default function HomePage({newProducts,Gp_Prod}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  if(router.isFallback) {
    return <Loader />
  }

  if(isLoading) {
    return <Loader />
  }
  return (
    <Layout>
      
      <Featured />
      <section className="mb-16">
        <div className="flex flex-wrap justify-center space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-12 overflow-x-auto pt-10">
          {Gp_Prod.map((p) => (
            <Link href={`/item/${p._id}`} key={p._id}>
              <div className="w-72">
                <Image
                  width={300}
                  height={72}
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-72 object-cover rounded-lg"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <NewProducts products={newProducts} />
    </Layout>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const Gp_Prod = await group_products.find({}, null, {sort: {'_id':-1}} );

  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:6});
  return {
    props: {
      Gp_Prod: JSON.parse(JSON.stringify(Gp_Prod)),

      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}