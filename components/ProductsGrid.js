import ProductBox from "@/components/ProductBox";

export default function ProductsGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products?.length > 0 &&
        products.map((product) => <ProductBox key={product._id} {...product} />)}
    </div>
  );
}
