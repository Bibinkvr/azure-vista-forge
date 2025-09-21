import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  MessageSquare, 
  Settings, 
  Star, 
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminServices from "@/components/admin/AdminServices";
import AdminTestimonials from "@/components/admin/AdminTestimonials";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalServices: 0,
    totalTestimonials: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setAdminProfile(profile);
      await loadStats();
    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get message stats
      const { count: totalMessages } = await supabase
        .from("user_messages")
        .select("*", { count: "exact", head: true });

      const { count: unreadMessages } = await supabase
        .from("user_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      // Get services count
      const { count: totalServices } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true });

      // Get testimonials count
      const { count: totalTestimonials } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true });

      setStats({
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        totalServices: totalServices || 0,
        totalTestimonials: totalTestimonials || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin/login");
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={adminProfile?.avatar_url} />
                <AvatarFallback>
                  {adminProfile?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{adminProfile?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.unreadMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <AdminMessages onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="services">
            <AdminServices onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="testimonials">
            <AdminTestimonials onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="profile">
            <AdminProfile 
              profile={adminProfile} 
              onProfileUpdate={setAdminProfile} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;