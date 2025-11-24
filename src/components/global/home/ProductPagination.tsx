import { Link, useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  const [searchParams] = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  // Helper to build URL with page param
  const buildPageUrl = (page: number): string => {
    // page is 0-indexed, convert to 1-indexed for URL
    const pageNum = page + 1;
    const newSearchParams = new URLSearchParams(searchParams);

    if (pageNum === 1) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", pageNum.toString());
    }

    const queryString = newSearchParams.toString();
    return queryString ? `/?${queryString}` : "/";
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (currentPage <= 2) {
        // Near the start
        pages.push(1, 2, 3);
        pages.push("ellipsis");
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push("ellipsis");
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // In the middle
        pages.push("ellipsis");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();
  const prevPage = currentPage > 0 ? currentPage - 1 : 0;
  const nextPage =
    currentPage < totalPages - 1 ? currentPage + 1 : totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 0 ? (
            <span
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5 pointer-events-none opacity-50"
              )}
              aria-disabled
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </span>
          ) : (
            <Link
              to={buildPageUrl(prevPage)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5 cursor-pointer"
              )}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Link>
          )}
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isActive = currentPage === page;
          return (
            <PaginationItem key={page}>
              <Link
                to={buildPageUrl(page)}
                onClick={(e) => handlePageClick(page, e)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size: "icon",
                  }),
                  "cursor-pointer"
                )}
              >
                {page + 1}
              </Link>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          {currentPage >= totalPages - 1 ? (
            <span
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5 pointer-events-none opacity-50"
              )}
              aria-disabled
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </span>
          ) : (
            <Link
              to={buildPageUrl(nextPage)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5 cursor-pointer"
              )}
              aria-label="Go to next page"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
