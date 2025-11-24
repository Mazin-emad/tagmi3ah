import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchSection from "@/components/global/home/SearchSection";
import { ProductCard } from "@/components/global/ProductCard";
import { ProductPagination } from "@/components/global/home/ProductPagination";
import heroImage from "@/assets/imgs/hero.jpg";
import { useProducts } from "@/hooks";
import { LoadingComponent } from "@/components/global/LoadingComponents";
import { ErrorComponent } from "@/components/global/ErrorComponents";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 12;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      return page >= 1 ? page - 1 : 0;
    }
    return 0;
  }, [searchParams]);

  const {
    data: allProductsData,
    isLoading,
    error,
    refetch,
  } = useProducts({ page: 0, size: 1000000000 });

  // Get filter params from URL
  const categoryFilter = searchParams.get("category") || "";
  const brandFilter = searchParams.get("brand");
  const brandsArray = useMemo(() => {
    return brandFilter ? brandFilter.split(",").filter(Boolean) : [];
  }, [brandFilter]);
  const searchFilter = searchParams.get("search") || "";

  // Get all products from API
  const allProducts = useMemo(() => {
    if (!allProductsData) return [];
    if (Array.isArray(allProductsData)) {
      return allProductsData;
    }
    return allProductsData.content ?? [];
  }, [allProductsData]);

  // Filter products based on URL params
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) =>
          product.categoryName?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by brands (multiple brands can be selected)
    // Brands are stored as names in URL
    if (brandsArray.length > 0) {
      filtered = filtered.filter((product) =>
        brandsArray.some(
          (brandName) =>
            product.brandName?.toLowerCase() === brandName.toLowerCase() ||
            product.brand?.toLowerCase() === brandName.toLowerCase()
        )
      );
    }

    // Filter by search term (search in name and description)
    if (searchFilter.trim()) {
      const searchLower = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allProducts, categoryFilter, brandsArray, searchFilter]);

  const totalElements = filteredProducts.length;

  const totalPages = useMemo(() => {
    if (totalElements === 0) return 0;
    return Math.ceil(totalElements / PRODUCTS_PER_PAGE);
  }, [totalElements]);

  // Paginate filtered products
  const products = useMemo(() => {
    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const shouldShowPagination = totalPages > 1;

  const handlePageChange = (page: number) => {
    const newPage = page + 1;

    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", newPage.toString());
    }
    setSearchParams(newSearchParams, { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage > 0 && totalPages > 0 && currentPage >= totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("page");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [
    categoryFilter,
    brandsArray,
    searchFilter,
    totalPages,
    currentPage,
    searchParams,
    setSearchParams,
  ]);

  // Validate page number
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (isNaN(page) || page < 1 || (totalPages > 0 && page > totalPages)) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("page");
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [searchParams, totalPages, setSearchParams]);

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
      <section className="pb-8">
        <div className="grid max-w-7xl px-4 mx-auto lg:gap-8 xl:gap-0">
          {isLoading ? (
            <LoadingComponent />
          ) : error ? (
            <ErrorComponent
              message="Error loading products"
              callback={() => {
                refetch();
              }}
              callbackText="Try again"
            />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">
                No products found matching your filters.
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or clearing the filters.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                products.length < 4
                  ? "grid-cols-[repeat(auto-fit,minmax(280px,280px))]"
                  : "grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"
              )}
            >
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        {shouldShowPagination && (
          <div className="flex justify-center py-8">
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
