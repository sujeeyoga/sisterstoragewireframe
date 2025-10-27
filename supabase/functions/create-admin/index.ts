import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateTemporaryPassword(length = 14): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    let userId: string;
    let tempPassword: string | null = null;
    let isNewUser = false;

    if (existingUser) {
      console.log("User already exists:", existingUser.id);
      userId = existingUser.id;

      // Check if they're already an admin
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (existingRole) {
        throw new Error("This user is already an admin");
      }

      // User exists but isn't an admin - add admin role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (roleError) throw roleError;
      console.log("Admin role added to existing user:", userId);

      // Send promotion email to existing user
      const { error: emailError } = await supabaseAdmin.functions.invoke('send-email', {
        body: {
          type: 'admin_promotion',
          to: email,
          data: {
            email,
            loginUrl: `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '')}/admin`
          }
        }
      });

      if (emailError) {
        console.error("Error sending promotion email:", emailError);
        // Don't fail the request if email fails
      } else {
        console.log("Promotion email sent to:", email);
      }
    } else {
      // User doesn't exist - create new user
      isNewUser = true;
      tempPassword = generateTemporaryPassword();
      console.log("Creating new user for:", email);

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          requires_password_reset: true,
          account_created_by: 'admin_invitation',
          invited_at: new Date().toISOString()
        }
      });

      if (userError) throw userError;
      if (!userData.user) throw new Error("User creation failed");

      userId = userData.user.id;
      console.log("User created:", userId);

      // Assign admin role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (roleError) throw roleError;
      console.log("Admin role assigned to new user:", userId);
    }

    // Send welcome email only if it's a new user with temporary password
    if (isNewUser && tempPassword) {
      const { error: emailError } = await supabaseAdmin.functions.invoke('send-email', {
        body: {
          type: 'admin_welcome',
          to: email,
          data: {
            email,
            temporaryPassword: tempPassword,
            loginUrl: `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '')}/admin`
          }
        }
      });

      if (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the request if email fails
      } else {
        console.log("Welcome email sent to:", email);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: userId,
        email: email,
        message: isNewUser ? 'Admin invited successfully' : 'Admin role restored successfully'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    
    // Handle specific error cases
    let statusCode = 500;
    let errorMessage = error.message;
    
    if (error.message?.includes("already an admin")) {
      statusCode = 409; // Conflict
      errorMessage = "This user is already an admin";
    } else if (error.message?.includes("Email is required")) {
      statusCode = 400; // Bad request
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: statusCode,
      }
    );
  }
});
