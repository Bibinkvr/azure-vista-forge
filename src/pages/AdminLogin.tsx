import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield } from "lucide-react";
import ForcePasswordChange from "@/components/admin/ForcePasswordChange";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-create default super admin on first access
    const initializeAdmin = async () => {
      try {
        // Call the function to ensure super admin exists
        await supabase.rpc('create_default_super_admin');
      } catch (error) {
        console.error("Error initializing super admin:", error);
      }
    };

    // Check if user is already logged in and is admin
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: adminProfile } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (adminProfile) {
          if (adminProfile.force_password_change) {
            setNeedsPasswordChange(true);
          } else {
            navigate("/admin/dashboard");
          }
        }
      }
    };
    
    initializeAdmin();
    checkAuth();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Check if user is admin
        const { data: adminProfile, error: profileError } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !adminProfile) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        if (!adminProfile.is_active) {
          await supabase.auth.signOut();
          throw new Error("Account is deactivated. Contact super admin.");
        }

        // Update last login
        await supabase
          .from("admin_profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("user_id", data.user.id);

        if (adminProfile.force_password_change) {
          setNeedsPasswordChange(true);
          toast({
            title: "Password Change Required",
            description: "Please update your credentials for security",
          });
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully as admin",
          });
          navigate("/admin/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeComplete = () => {
    setNeedsPasswordChange(false);
    navigate("/admin/dashboard");
  };

  if (needsPasswordChange) {
    return <ForcePasswordChange onPasswordChanged={handlePasswordChangeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Access the admin dashboard with your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              Back to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;