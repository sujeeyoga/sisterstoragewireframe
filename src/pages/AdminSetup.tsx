import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const createAdmin = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { 
          email: 'Sisterstorageinc@gmail.com',
          password: 'SuhanyaR2218!'
        }
      });

      if (error) throw error;

      console.log('Admin created:', data);
      setSuccess(true);
      toast({
        title: "Admin Account Created!",
        description: `Admin user created: ${data.email}`,
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {success ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Admin Account Created!</h1>
            <p className="text-muted-foreground">
              Email: Sisterstorageinc@gmail.com
            </p>
            <Button
              onClick={() => window.location.href = '/admin'}
              className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
            >
              Go to Admin Login
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Admin Setup</h1>
            <p className="text-muted-foreground">
              Click the button below to create the admin account for<br />
              <strong>Sisterstorageinc@gmail.com</strong>
            </p>
            <Button
              onClick={createAdmin}
              disabled={isLoading}
              size="lg"
              className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
            >
              {isLoading ? "Creating Admin..." : "Create Admin Account"}
            </Button>
            <p className="text-xs text-muted-foreground">
              This is a one-time setup. You can delete this page after use.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
