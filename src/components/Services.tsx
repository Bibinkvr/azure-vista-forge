import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import consultationBg from "@/assets/consultation-bg.jpg";

const Services = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("program_images")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            This Month's <span className="text-gradient">Recommended Study Abroad Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest study abroad opportunities and work programs across the globe.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card 
                key={index}
                className="bg-gradient-card shadow-card animate-pulse overflow-hidden"
              >
                <div className="aspect-[4/3] bg-muted"></div>
                <div className="p-4">
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </Card>
            ))
          ) : programs.length > 0 ? (
            programs.map((program, index) => (
              <Card 
                key={program.id}
                className="bg-gradient-card shadow-card hover:shadow-elegant transition-smooth group hover:-translate-y-1 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={program.image_url} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                </div>
                
                <div className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
                    onClick={() => navigate(`/service/${program.id}`)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No programs available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Card className="relative overflow-hidden text-primary-foreground p-8 shadow-elegant">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${consultationBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
            <div className="relative z-10">
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
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;