import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import ShopHero from "@/components/shop/ShopHero";

interface ShopLayoutProps {
  children: ReactNode;
  hero?: ReactNode;
}

const ShopLayout = ({ children, hero }: ShopLayoutProps) => {
  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      {hero}
      <Section spacing="lg" width="contained" background="white">
        <div className="min-h-screen">
          {children}
        </div>
      </Section>
    </BaseLayout>
  );
};

export default ShopLayout;