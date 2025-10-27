import { useNavigate } from "react-router-dom";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const PasswordReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user actually needs to reset password
    const checkResetRequired = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin-setup");
        return;
      }

      const requiresReset = user.user_metadata?.requires_password_reset;
      if (!requiresReset) {
        navigate("/admin");
      }
    };

    checkResetRequired();
  }, [navigate]);

  const handleSuccess = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <PasswordResetForm onSuccess={handleSuccess} />
    </div>
  );
};

export default PasswordReset;
