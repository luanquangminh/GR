import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationMeta } from '@/hooks/usePagination';

interface PaginationControlsProps {
  meta: PaginationMeta | undefined;
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetching?: boolean;
}

export function PaginationControls({
  meta,
  page,
  setPage,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
  isFetching,
}: PaginationControlsProps) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <span className="text-sm text-muted-foreground">
        {meta.total} results — page {page} of {meta.totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(1)}
          disabled={!hasPrevPage || isFetching}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={prevPage}
          disabled={!hasPrevPage || isFetching}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={nextPage}
          disabled={!hasNextPage || isFetching}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(meta.totalPages)}
          disabled={!hasNextPage || isFetching}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
