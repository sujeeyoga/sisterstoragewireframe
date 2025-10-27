import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

interface PasswordResetFormProps {
  onSuccess: () => void;
}

export const PasswordResetForm = ({ onSuccess }: PasswordResetFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: 0, label: "Too short", color: "text-red-500" };
    
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 25, label: "Weak", color: "text-orange-500" };
    if (strength === 3) return { strength: 50, label: "Fair", color: "text-yellow-500" };
    if (strength === 4) return { strength: 75, label: "Good", color: "text-blue-500" };
    return { strength: 100, label: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain a special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate new password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast({
        title: "Invalid Password",
        description: validationError,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Invalid Current Password",
          description: "The current password you entered is incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Clear the password reset flag
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { requires_password_reset: false }
      });

      if (metadataError) throw metadataError;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Password Reset Required
        </CardTitle>
        <CardDescription>
          For security reasons, you must change your password before continuing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className={newPassword.length >= 8 ? "text-green-600" : ""}>
                    {newPassword.length >= 8 ? "✓" : "•"} At least 8 characters
                  </p>
                  <p className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                    {/[a-z]/.test(newPassword) ? "✓" : "•"} One lowercase letter
                  </p>
                  <p className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                    {/[A-Z]/.test(newPassword) ? "✓" : "•"} One uppercase letter
                  </p>
                  <p className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                    {/[0-9]/.test(newPassword) ? "✓" : "•"} One number
                  </p>
                  <p className={/[^a-zA-Z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                    {/[^a-zA-Z0-9]/.test(newPassword) ? "✓" : "•"} One special character
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && (
              <p className={`text-xs ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                {newPassword === confirmPassword ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </span>
                ) : (
                  "Passwords do not match"
                )}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
