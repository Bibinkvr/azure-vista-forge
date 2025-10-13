import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('programs-scroll');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
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

        {/* Programs Grid/Scroll */}
        <div className="relative">
          {programs.length > 6 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-smooth"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-smooth"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div 
            id="programs-scroll"
            className={programs.length > 6 
              ? "flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x snap-mandatory" 
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            }
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card 
                  key={index}
                  className={`bg-gradient-card shadow-card animate-pulse ${programs.length > 6 ? 'flex-shrink-0 w-80 snap-start' : ''}`}
                >
                  <div className="h-64 bg-muted rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </Card>
              ))
            ) : programs.length > 0 ? (
              programs.map((program, index) => (
                <Card 
                  key={program.id}
                  className={`bg-gradient-card shadow-card hover:shadow-elegant transition-smooth group hover:-translate-y-2 animate-fade-in overflow-hidden ${programs.length > 6 ? 'flex-shrink-0 w-80 snap-start' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={program.image_url} 
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                      {program.title}
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
                      onClick={() => navigate(`/service/${program.id}`)}
                    >
                      View More Details
                      <ArrowRight className="ml-2 h-4 w-4" />
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