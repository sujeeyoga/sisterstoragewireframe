
import Layout from "@/components/layout/Layout";
import BrandHeader from "@/components/brand/BrandHeader";
import BrandColors from "@/components/brand/BrandColors";
import BrandTypography from "@/components/brand/BrandTypography";
import BrandComponents from "@/components/brand/BrandComponents";
import BrandApplications from "@/components/brand/BrandApplications";
import BrandVoice from "@/components/brand/BrandVoice";

const Brand = () => {
  return (
    <Layout>
      <div className="min-h-screen font-poppins">
        <BrandHeader />
        <BrandColors />
        <BrandTypography />
        <BrandComponents />
        <BrandApplications />
        <BrandVoice />
      </div>
    </Layout>
  );
};

export default Brand;
