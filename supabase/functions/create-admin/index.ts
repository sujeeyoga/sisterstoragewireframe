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

    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    console.log("Generated temporary password for:", email);

    // Create the user with temporary password
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

    console.log("User created:", userData.user.id);

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userData.user.id,
        role: "admin"
      });

    if (roleError) throw roleError;

    console.log("Admin role assigned to user:", userData.user.id);

    // Send welcome email with temporary password
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: userData.user.id,
        email: userData.user.email 
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
    
    if (error.message?.includes("already been registered")) {
      statusCode = 409; // Conflict
      errorMessage = "This email is already registered as an admin";
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
