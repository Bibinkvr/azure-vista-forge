import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
  Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminServices from "@/components/admin/AdminServices";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminManagement from "@/components/admin/AdminManagement";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeView, setActiveView] = useState("messages");
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalServices: 0,
    totalTestimonials: 0,
    totalAdmins: 0
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
      setIsSuperAdmin(profile.is_super_admin);
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

      // Get admins count (only for super admin)
      let totalAdmins = 0;
      if (adminProfile?.is_super_admin) {
        const { count: adminsCount } = await supabase
          .from("admin_profiles")
          .select("*", { count: "exact", head: true });
        totalAdmins = adminsCount || 0;
      }

      setStats({
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        totalServices: totalServices || 0,
        totalTestimonials: totalTestimonials || 0,
        totalAdmins
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

  // Define menu items
  const menuItems = [
    { id: "messages", title: "Messages", icon: MessageSquare },
    { id: "services", title: "Services", icon: Settings },
    { id: "testimonials", title: "Testimonials", icon: Star },
    ...(isSuperAdmin ? [{ id: "admins", title: "Admin Management", icon: Shield }] : []),
    { id: "profile", title: "Profile", icon: User },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "messages":
        return <AdminMessages onStatsUpdate={loadStats} />;
      case "services":
        return <AdminServices onStatsUpdate={loadStats} />;
      case "testimonials":
        return <AdminTestimonials onStatsUpdate={loadStats} />;
      case "admins":
        return isSuperAdmin ? <AdminManagement /> : null;
      case "profile":
        return <AdminProfile profile={adminProfile} onProfileUpdate={setAdminProfile} />;
      default:
        return <AdminMessages onStatsUpdate={loadStats} />;
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="w-64 border-r">
          <SidebarContent>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        className={activeView === item.id ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card h-16 flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              
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

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Stats Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isSuperAdmin ? '5' : '4'} gap-6 mb-8`}>
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

              {isSuperAdmin && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Dynamic Content */}
            <div className="space-y-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;