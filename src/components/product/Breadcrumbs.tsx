
import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  productName: string;
}

const Breadcrumbs = ({ productName }: BreadcrumbsProps) => {
  return (
    <div className="mb-6 text-xs">
      <Link to="/" className="text-gray-500 hover:text-purple-600">Home</Link>
      <span className="mx-2 text-gray-400">/</span>
      <Link to="/shop" className="text-gray-500 hover:text-purple-600">Shop</Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-800">{productName}</span>
    </div>
  );
};

export default Breadcrumbs;
