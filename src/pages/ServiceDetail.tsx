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
      // Try to load from program_images first
      const { data: programData, error: programError } = await supabase
        .from("program_images")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (programData) {
        setService({
          ...programData,
          isProgram: true
        });
        setEditData({
          title: programData.title,
          description: programData.description || "",
          icon: "Image"
        });
        setLoading(false);
        return;
      }

      // If not found, try services table
      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (serviceData) {
        setService(serviceData);
        setEditData({
          title: serviceData.title,
          description: serviceData.description,
          icon: serviceData.icon
        });
      }
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
        <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              className="mb-8 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-smooth" />
              Back to Home
            </Button>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Image */}
              {service.isProgram && service.image_url ? (
                <div className="order-2 lg:order-1">
                  <div className="rounded-xl overflow-hidden shadow-elegant h-full">
                    <img 
                      src={service.image_url} 
                      alt={service.title}
                      className="w-full h-full object-cover min-h-[400px] lg:min-h-[500px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="order-2 lg:order-1 flex items-center justify-center">
                  <div className="bg-gradient-primary p-12 rounded-2xl shadow-glow">
                    <Icon className="h-32 w-32 text-primary-foreground" />
                  </div>
                </div>
              )}

              {/* Right Side - Content */}
              <div className="order-1 lg:order-2 space-y-6">
                {isAdmin && (
                  <div className="flex gap-2 justify-end">
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

                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="text-3xl lg:text-4xl font-bold bg-transparent border-2 border-primary"
                    />
                    <Textarea
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="text-lg leading-relaxed min-h-32"
                      placeholder={service.isProgram ? "Enter program details..." : "Enter service description..."}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                        {service.title}
                      </h1>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {service.description || "Contact us for more information about this program."}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg mt-1">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Expert Guidance</h4>
                          <p className="text-muted-foreground">Professional consultants with years of experience</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-accent/20 p-2 rounded-lg mt-1">
                          <Users className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Personalized Support</h4>
                          <p className="text-muted-foreground">Tailored solutions for your specific needs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500/20 p-2 rounded-lg mt-1">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Proven Success</h4>
                          <p className="text-muted-foreground">98% success rate with our students</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/auth")}
                      >
                        Book Free Consultation
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center shadow-card hover:shadow-elegant transition-smooth">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">20+ Years Experience</h3>
                  <p className="text-sm text-muted-foreground">Trusted expertise in education consulting</p>
                </Card>
                
                <Card className="p-6 text-center shadow-card hover:shadow-elegant transition-smooth">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Global Network</h3>
                  <p className="text-sm text-muted-foreground">Partnerships with top institutions worldwide</p>
                </Card>
                
                <Card className="p-6 text-center shadow-card hover:shadow-elegant transition-smooth">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">98% Success Rate</h3>
                  <p className="text-sm text-muted-foreground">Proven track record of successful placements</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg mb-8 opacity-90">
                Contact us today for a free consultation and take the first step towards achieving your educational dreams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg"
                  className="bg-background text-foreground hover:bg-secondary w-full sm:w-auto"
                  onClick={() => navigate("/auth")}
                >
                  Book Free Consultation
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+1-555-EDUCATION</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@beyondviewfinder.com</span>
                  </div>
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