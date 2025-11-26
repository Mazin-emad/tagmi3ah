import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
}

export function usePagination({ totalItems, itemsPerPage }: UsePaginationOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      return page >= 1 ? page - 1 : 0;
    }
    return 0;
  }, [searchParams]);

  const totalPages = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  }, [currentPage, itemsPerPage]);

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

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
  };
}

