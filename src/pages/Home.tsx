import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchSection from "@/components/global/home/SearchSection";
import { ProductPagination } from "@/components/global/home/ProductPagination";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { EmptyProductsState } from "@/components/home/EmptyProductsState";
import { LoadingComponent } from "@/components/global/LoadingComponents";
import { ErrorComponent } from "@/components/global/ErrorComponents";
import { useProductsData } from "@/hooks/useProductsData";
import { useProductFilters } from "@/hooks/useProductFilters";
import { usePagination } from "@/hooks/usePagination";

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, error, refetch } = useProductsData();
  const { filteredProducts } = useProductFilters(products);

  const { currentPage, totalPages, paginatedItems, handlePageChange } =
    usePagination({
      totalItems: filteredProducts.length,
      itemsPerPage: PRODUCTS_PER_PAGE,
    });

  const paginatedProducts = filteredProducts.slice(
    paginatedItems.startIndex,
    paginatedItems.endIndex
  );

  useEffect(() => {
    if (currentPage > 0 && totalPages > 0 && currentPage >= totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("page");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [currentPage, totalPages, searchParams, setSearchParams]);

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
      <HeroSection />
      <SearchSection />
      <section id="products" className="pb-8">
        <div className="grid max-w-7xl px-4 mx-auto lg:gap-8 xl:gap-0">
          {isLoading ? (
            <LoadingComponent />
          ) : error ? (
            <ErrorComponent
              message="Error loading products"
              callback={refetch}
              callbackText="Try again"
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyProductsState />
          ) : (
            <ProductGrid products={paginatedProducts} />
          )}
        </div>
        {totalPages > 1 && (
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
}
