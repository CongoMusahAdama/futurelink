import { useCallback, useEffect, useMemo, useState } from "react";

export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const resetPage = useCallback(() => setPage(1), []);

  return {
    page: currentPage,
    setPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    rangeStart,
    rangeEnd,
    resetPage,
  };
}
