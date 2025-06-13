
import React from "react";
import BaseLayout from "./BaseLayout";

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout: React.FC<BrandLayoutProps> = ({ children }) => {
  return (
    <BaseLayout 
      variant="brand" 
      showFooter={true}
      showSaleBanner={false}
      spacing="none"
      background="white"
      pageId="brand"
    >
      {children}
    </BaseLayout>
  );
};

export default BrandLayout;
