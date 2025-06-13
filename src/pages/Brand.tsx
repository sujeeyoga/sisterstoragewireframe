
import BrandLayout from "@/components/layout/BrandLayout";
import BrandHeader from "@/components/brand/BrandHeader";
import BrandColors from "@/components/brand/BrandColors";
import BrandTypography from "@/components/brand/BrandTypography";
import BrandComponents from "@/components/brand/BrandComponents";
import BrandApplications from "@/components/brand/BrandApplications";
import BrandVoice from "@/components/brand/BrandVoice";

const Brand = () => {
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

export default Brand;
