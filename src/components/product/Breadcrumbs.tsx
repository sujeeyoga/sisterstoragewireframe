
import React from "react";

interface BreadcrumbsProps {
  productName: string;
}

const Breadcrumbs = ({ productName }: BreadcrumbsProps) => {
  return (
    <div className="mb-6 text-xs">
      <a href="/" className="text-gray-500 hover:text-purple-600">Home</a>
      <span className="mx-2 text-gray-400">/</span>
      <a href="/shop" className="text-gray-500 hover:text-purple-600">Shop</a>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-800">{productName}</span>
    </div>
  );
};

export default Breadcrumbs;
