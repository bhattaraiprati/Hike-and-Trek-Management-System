
import React from 'react';

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface PaginationProps {
  pagination: PaginationMetadata;
  onPageChange: (page: number) => void;
  itemName?: string; 
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  itemName = 'items',
}) => {
  const generatePageNumbers = (): (number | string)[] => {
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];
    const delta = 2; 

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta) 
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (pagination.hasPrevious) {
      onPageChange(pagination.currentPage - 2); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (pagination.hasNext) {
      onPageChange(pagination.currentPage); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum - 1); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render for only one page
  if (pagination.totalPages <= 0) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Page info */}
      <div className="text-sm text-gray-600">
        Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
        {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalElements)} of{' '}
        {pagination.totalElements} {itemName}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={!pagination.hasPrevious}
          className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
            pagination.hasPrevious
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </button>

        {generatePageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum as number)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                pagination.currentPage === pageNum
                  ? 'bg-[#1E3A5F] text-white'
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {pageNum}
            </button>
          )
        ))}

        <button
          onClick={handleNext}
          disabled={!pagination.hasNext}
          className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
            pagination.hasNext
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};