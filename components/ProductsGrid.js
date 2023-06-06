import ProductBox from "@/components/ProductBox";


export default function ProductsGrid({products}) {
  return (
    <div className="flex flex-wrap justify-center space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-12">
      {products?.length > 0 && products.map(product => (
        <ProductBox key={product._id} {...product} />
      ))}
    </div>
  );
}