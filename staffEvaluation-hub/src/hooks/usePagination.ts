import { useState, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

interface UsePaginatedQueryOptions {
  queryKey: readonly unknown[];
  path: string;
  limit?: number;
  enabled?: boolean;
}

export function usePaginatedQuery<T>({
  queryKey,
  path,
  limit = 20,
  enabled = true,
}: UsePaginatedQueryOptions) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () =>
      api.get<PaginatedResponse<T>>(`${path}?page=${page}&limit=${limit}`),
    enabled,
    placeholderData: keepPreviousData,
  });

  const meta = query.data?.meta;

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, meta?.totalPages ?? 1)));
  }, [meta?.totalPages]);

  const nextPage = useCallback(() => {
    if (meta && page < meta.totalPages) setPage(page + 1);
  }, [meta, page]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  return {
    data: query.data?.data ?? [],
    meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    page,
    setPage: goToPage,
    nextPage,
    prevPage,
    hasNextPage: meta ? page < meta.totalPages : false,
    hasPrevPage: page > 1,
  };
}
