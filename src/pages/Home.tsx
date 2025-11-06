import { Link } from "react-router-dom";
import SearchSection from "@/components/global/home/SearchSection";
import { ProductCard } from "@/components/global/ProductCard";
import { products } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/imgs/hero.jpg";

const Home = () => {
  return (
    <main>
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-primary">
              Stop Searching. Start Building.
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Our smart recommendation engine finds the best PC parts for your
              budget and performance needs — fast and stress-free.
            </p>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Start Building
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Browse Products
            </Link>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src={heroImage}
              alt="mockup"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
      <SearchSection />
      <section>
        <div className="grid max-w-7xl px-4 mx-auto lg:gap-8 xl:gap-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="flex justify-center py-8">
          <Button
            variant="outline"
            onClick={() => {
              console.log("Load More");
            }}
            className="cursor-pointer hover:bg-primary px-8 text-lg hover:text-white hover:border-primary hover:shadow-md transition-all duration-300"
          >
            Load More
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
