import { useState, useEffect, use } from "react";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import Layout from "@/components/Layout";
import {Category} from "@/models/categories";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "./Loading";
import jwt_decode from "jwt-decode";
import { Tag } from "@/models/tag";
const ProductsPage = ({ initialProducts , Categorys,Tag }) => {
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered_Products, setFilteredProducts] = useState(initialProducts);
  
  const router = useRouter();
  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [products, category, tag,sortBy, searchQuery]);

  const {addProduct} = useContext(CartContext);
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleTagChange = (event) => {
    setTag(event.target.value);
  };


  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const loadMoreProducts = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/products?page=${page + 1}`);
    const newProducts = await response.json();
    if (newProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }
    if (tag) {
      filteredProducts = filteredProducts.filter(
        (product) => product.tag === tag
      );
    }

    if (sortBy === "price-low-to-high") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-to-low") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "date-latest") {
      filteredProducts = filteredProducts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }
    
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      filteredProducts = filteredProducts.filter(
        (product) => product.title.match(regex) || product.description.match(regex)
      );
    }

    return filteredProducts;
  };
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !isLoading &&
      hasMore
    ) {
      loadMoreProducts();
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    router.push(`/products?searchQuery=${encodeURIComponent(searchQuery)}`);
  };

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  const filteredProducts = filterProducts();

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-20">
        <div className="mb-4 flex justify-between items-center">
          <div className="mr-4">
            <label htmlFor="category" className="font-medium">
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-md px-2 py-1 ml-2"
            >
              <option value="">All</option>
              {Categorys.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
         
          <div className="flex "> 
          <div className="mr-4">
            <label htmlFor="Tag" className="font-medium">
              Tag:
            </label>
            <select
              id="Tag"
              value={tag}
              onChange={handleTagChange}
              className="border border-gray-300 rounded-md px-2 py-1 ml-2"
            >
              <option value="">All</option>
              {Tag.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-4">
            <label htmlFor="sortBy" className="font-medium">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortByChange}
              className="border border-gray-300 rounded-md px-2 py-1 ml-2"
            >
              <option value="">None</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="date-latest">Date: Latest</option>
            </select>
            </div>
          </div>
        </div>
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <label htmlFor="search" className="font-medium">
            Search:
          </label>
          <div className="flex">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search products..."
              className="border border-gray-300 rounded-md px-2 py-1 ml-2"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md ml-2"
            >
              Search
            </button>
          </div>
        </form>

        {filteredProducts.length === 0 ? (
          <p className="text-xl">No products found.</p>
        ) : (
          <>
          {isLoading ? (
            <Loader />
          ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">  
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/Product/${product._id}`}>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover object-center"
              />
              </Link>
              <div className="p-4">
                <h3 className="text-lg text-gray-600 font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <p className="text-gray-800 font-bold text-lg">
                  {product.price.toFixed(2)} dt
                </p>
                {userId ? (
                <button onClick={() => addProduct(product._id)} className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md mt-4">
                  Add to Cart
                </button>
                ) : (
                  <Link href="/login">
                    <div className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md mt-4">
                      Login to add to cart
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
          {isLoading && <p className="text-center">Loading...</p>}
          
        </div>
          )}
          </>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { date: -1 } })
    .limit(12)
    .lean();

  const Tags = await Tag.find({}, null, { sort: { _id: -1 } });

  const Categorys = await Category.find({}, null, { sort: { _id: -1 } });
  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
      Categorys: JSON.parse(JSON.stringify(Categorys)),
      Tag: JSON.parse(JSON.stringify(Tags)),
    },
  };
}

export default ProductsPage;
