"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PaginationCustomProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationCustom: React.FC<PaginationCustomProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between w-full max-w-sm mx-auto text-zinc-500 font-medium", className)}>
      <button
        type="button"
        aria-label="Précédent"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" 
            fill="currentColor" 
          />
        </svg>
      </button>

      <div className="flex items-center gap-2 text-sm font-medium">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-10 w-10 flex items-center justify-center transition-all duration-300 rounded-full",
              currentPage === page
                ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold scale-110"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Suivant"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" 
            fill="currentColor" 
          />
        </svg>
      </button>
    </div>
  );
};
