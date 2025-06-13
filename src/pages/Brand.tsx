
import { Routes, Route } from "react-router-dom";
import BrandLayout from "@/components/layout/BrandLayout";
import BrandHeader from "@/components/brand/BrandHeader";
import BrandColors from "@/components/brand/BrandColors";
import BrandTypography from "@/components/brand/BrandTypography";
import BrandComponents from "@/components/brand/BrandComponents";
import BrandApplications from "@/components/brand/BrandApplications";
import BrandVoice from "@/components/brand/BrandVoice";
import ContentPage from "./ContentPage";

const BrandMain = () => {
  return (
    <BrandLayout>
      <div className="font-poppins">
        <BrandHeader />
        <BrandColors />
        <BrandTypography />
        <BrandComponents />
        <BrandApplications />
        <BrandVoice />
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
