import { ChevronLeft, ChevronRight } from "lucide-react";

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];

  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("…");
    result.push(p);
  });

  return result;
}

export default function TablePagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
  className = "",
}) {
  if (totalItems === 0) return null;

  const pages = pageNumbers(page, totalPages);

  return (
    <div className={`table-pagination ${className}`}>
      <p className="table-pagination-summary">
        Showing <span className="font-semibold text-navy">{rangeStart}–{rangeEnd}</span> of{" "}
        <span className="font-semibold text-navy">{totalItems}</span>
      </p>

      <div className="table-pagination-controls">
        {totalPages > 1 && (
          <>
            <button
              type="button"
              className="table-pagination-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="table-pagination-pages" role="navigation" aria-label="Pagination">
              {pages.map((p, i) =>
                p === "…" ? (
                  <span key={`gap-${i}`} className="table-pagination-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`table-pagination-page${p === page ? " is-active" : ""}`}
                    onClick={() => onPageChange(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="table-pagination-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
