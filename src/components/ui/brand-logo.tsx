import * as React from "react";

export const BrandLogo = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Mother */}
    <path d="M28 8C28 5.79086 29.7909 4 32 4C34.2091 4 36 5.79086 36 8C36 10.2091 34.2091 12 32 12C29.7909 12 28 10.2091 28 8Z" fill="#f97316"/>
    <path d="M42 44C42 32 36 22 24 20C16 18.6667 10 24 8 32" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
    
    {/* Child */}
    <path d="M18 20C18 18.3431 19.3431 17 21 17C22.6569 17 24 18.3431 24 20C24 21.6569 22.6569 23 21 23C19.3431 23 18 21.6569 18 20Z" fill="#22c55e"/>
    <path d="M30 44C30 36 26 30 18 28C14 26.6667 10 30 8 36" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
