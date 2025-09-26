import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  Users, 
  GraduationCap, 
  Plane, 
  FileCheck,
  ArrowRight 
} from "lucide-react";

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  Plane,
  FileCheck,
  Brain: BookOpen, // fallback
  TrendingUp: FileText, // fallback
  Settings: FileCheck // fallback
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
      // Fallback to default services if database query fails
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  // Fallback services in case database is not available
  const defaultServices = [
    {
      icon: "BookOpen",
      title: "IELTS/TOEFL Training",
      description: "Expert guidance to help you achieve the required language proficiency scores for your dream university.",
    },
    {
      icon: "FileText",
      title: "University Admissions",
      description: "Comprehensive support for university applications, from document preparation to interview coaching.",
    },
    {
      icon: "Plane",
      title: "Visa Application",
      description: "Complete visa processing assistance with high success rates and expert documentation support.",
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            This Month's <span className="text-gradient">Recommended Study Abroad Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive educational consultancy services to guide you through every step of your global education journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card 
                key={index}
                className="bg-gradient-card shadow-card p-6 animate-pulse"
              >
                <div className="mb-4">
                  <div className="bg-gray-300 p-3 rounded-xl w-12 h-12"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </Card>
            ))
          ) : (
            services.map((service, index) => {
              const Icon = iconMap[service.icon] || FileCheck;
              return (
                <Card 
                  key={service.id || service.title}
                  className="bg-gradient-card shadow-card hover:shadow-elegant transition-smooth p-6 group hover:-translate-y-2 animate-fade-in flex flex-col h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="bg-gradient-primary p-3 rounded-xl w-fit group-hover:shadow-glow transition-smooth">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth mt-auto"
                    onClick={() => navigate(`/service/${service.id}`)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              );
            })
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Card className="bg-gradient-hero text-primary-foreground p-8 shadow-elegant">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Get personalized guidance from our expert consultants and take the first step towards your global education dreams.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-secondary hover:shadow-glow transition-smooth"
            >
              Book Free Consultation
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;