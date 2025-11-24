import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`/?page=${page - 1}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`/?page=1`}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`/?page=2`} isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`/?page=3`}>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`/?page=${page + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
