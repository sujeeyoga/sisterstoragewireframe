
import React from "react";
import BaseLayout from "./BaseLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <BaseLayout variant="standard">
      {children}
    </BaseLayout>
  );
};

export default Layout;
