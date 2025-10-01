import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, FileText, Users, GraduationCap, Plane, FileCheck, Phone, Mail, Edit, Save, X } from "lucide-react";
import Header from "@/components/Header";

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  Plane,
  FileCheck,
  Brain: BookOpen,
  TrendingUp: FileText,
  Settings: FileCheck
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    icon: ""
  });

  useEffect(() => {
    checkAdminStatus();
    loadService();
  }, [id]);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      setIsAdmin(!!adminProfile);
    }
  };

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single(); // Remove is_active filter for admins

      if (error) throw error;
      setService(data);
      setEditData({
        title: data.title,
        description: data.description,
        icon: data.icon
      });
    } catch (error) {
      console.error("Error loading service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("services")
        .update(editData)
        .eq("id", id);

      if (error) throw error;
      
      setService({ ...service, ...editData });
      setEditMode(false);
      toast({
        title: "Success",
        description: "Service updated successfully"
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      title: service.title,
      description: service.description,
      icon: service.icon
    });
    setEditMode(false);
  };

  const availableIcons = [
    "BookOpen", "FileText", "Users", "GraduationCap", 
    "Plane", "FileCheck", "Settings", "Brain", "TrendingUp"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 container mx-auto px-4 lg:px-8">
          <div className="animate-pulse space-y-8 py-20">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 container mx-auto px-4 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || FileCheck;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                className="mb-8 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-smooth" />
                Back to Services
              </Button>
              
              <div className="flex items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-primary p-6 rounded-2xl shadow-glow">
                    <Icon className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div>
                    {editMode ? (
                      <div className="space-y-4">
                        <Input
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="text-4xl lg:text-5xl font-bold bg-transparent border-2 border-primary"
                        />
                        <p className="text-xl text-muted-foreground">
                          Professional guidance for your educational journey
                        </p>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                          {service.title}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                          Professional guidance for your educational journey
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-8 shadow-elegant">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Service Overview</h2>
                      {isAdmin && editMode && (
                        <Select value={editData.icon} onValueChange={(value) => setEditData({...editData, icon: value})}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((iconName) => (
                              <SelectItem key={iconName} value={iconName}>
                                {iconName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    {editMode ? (
                      <Textarea
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        className="text-lg leading-relaxed mb-8 min-h-32"
                        placeholder="Enter service description..."
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg mt-1">
                              <FileCheck className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Expert Guidance</h4>
                              <p className="text-sm text-muted-foreground">Professional consultants with years of experience</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-accent/20 p-2 rounded-lg mt-1">
                              <Users className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Personalized Support</h4>
                              <p className="text-sm text-muted-foreground">Tailored solutions for your specific needs</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6 shadow-elegant bg-gradient-hero text-primary-foreground">
                    <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                    <p className="mb-6 opacity-90">
                      Contact us today for a free consultation and take the first step towards your dreams.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-background text-foreground hover:bg-secondary"
                        onClick={() => navigate("/auth")}
                      >
                        Book Consultation
                      </Button>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Phone className="h-4 w-4" />
                        <span>+1-555-EDUCATION</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Mail className="h-4 w-4" />
                        <span>info@beyondviewfinder.com</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 shadow-elegant">
                    <h3 className="text-lg font-semibold mb-4">Why Choose Us?</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">1</span>
                        </div>
                        <span className="text-sm">20+ Years Experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">2</span>
                        </div>
                        <span className="text-sm">100% Success Rate</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">3</span>
                        </div>
                        <span className="text-sm">Global Network</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceDetail;