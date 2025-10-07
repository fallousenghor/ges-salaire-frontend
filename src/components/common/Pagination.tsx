interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, hasMore, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
        }`}
        title="Page précédente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        {/* Premier numéro */}
        {currentPage > 2 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-all duration-200"
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="text-gray-500 px-1">...</span>
            )}
          </>
        )}

        {/* Page précédente si ce n'est pas la première */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-all duration-200"
          >
            {currentPage - 1}
          </button>
        )}

        {/* Page actuelle */}
        <button
          className="w-10 h-10 rounded-lg bg-theme-primary text-white flex items-center justify-center"
        >
          {currentPage}
        </button>

        {/* Page suivante si ce n'est pas la dernière */}
        {hasMore && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-all duration-200"
          >
            {currentPage + 1}
          </button>
        )}

        {/* Points de suspension et dernière page */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="text-gray-500 px-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-all duration-200"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
          !hasMore
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
        }`}
        title="Page suivante"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}