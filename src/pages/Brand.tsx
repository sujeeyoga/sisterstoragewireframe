
import { Routes, Route } from "react-router-dom";
import BrandLayout from "@/components/layout/BrandLayout";
import Section from "@/components/layout/Section";
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";
import BrandHeader from "@/components/brand/BrandHeader";
import BrandColors from "@/components/brand/BrandColors";
import BrandTypography from "@/components/brand/BrandTypography";
import BrandComponents from "@/components/brand/BrandComponents";
import BrandApplications from "@/components/brand/BrandApplications";
import BrandVoice from "@/components/brand/BrandVoice";
import BrandGallery from "@/components/brand/BrandGallery";
import ContentPage from "./ContentPage";

const BrandMain = () => {
  return (
    <BrandLayout>
      <div className="font-poppins">
        <Section spacing="xl" width="full" background="brand-pink" as="div">
          <BrandHeader />
        </Section>
        
        <Section spacing="lg" width="contained" background="white">
          <BrandColors />
        </Section>
        
        <Section spacing="lg" width="contained" background="gray">
          <BrandTypography />
        </Section>
        
        <Section spacing="lg" width="contained" background="white">
          <BrandComponents />
        </Section>
        
        <Section spacing="lg" width="contained" background="gray">
          <BrandApplications />
        </Section>
        
        <Section spacing="lg" width="contained" background="white">
          <BrandGallery />
        </Section>
        
        <Section spacing="xl" width="full" background="dark">
          <BrandVoice />
        </Section>
      </div>
    </BrandLayout>
  );
};

const Brand = () => {
  return (
    <Routes>
      <Route path="/" element={<BrandMain />} />
      <Route path="/content/:slug" element={<ContentPage />} />
    </Routes>
  );
};

export default Brand;
