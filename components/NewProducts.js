import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

export default function NewProducts({ products }) {
  return (
    <section className="mb-16 pt-5">
      <h2 className="text-4xl font-bold text-center mb-12 ">
        Featured Products
      </h2>
      <ProductsGrid products={products} />
      <div className="flex justify-center mt-6">
          <button className="px-10 py-4 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600" onClick={() => {
            window.location.href = "/Products";
          }}>
            View More
          </button>
        </div>
    </section>
  );
}
