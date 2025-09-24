import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url?: string;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      // Load testimonials from both admin testimonials and user testimonials
      const [adminTestimonials, userTestimonials] = await Promise.all([
        supabase.from("testimonials").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("user_testimonials").select("*").eq("is_active", true).order("created_at", { ascending: false })
      ]);

      const allTestimonials = [
        ...(adminTestimonials.data || []),
        ...(userTestimonials.data || [])
      ];

      // Sort by creation date and take the most recent ones
      const sortedTestimonials = allTestimonials
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6); // Show top 6 testimonials

      setTestimonials(sortedTestimonials);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      // Fallback to default testimonials if database fails
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  // Default testimonials for fallback
  const defaultTestimonials: Testimonial[] = [
    {
      id: "default-1",
      name: "Sarah Johnson",
      role: "MBA Student, Harvard Business School",
      content: "EduReach made my dream of studying at Harvard a reality. Their expert guidance through the application process was invaluable.",
      rating: 5,
      created_at: "2024-01-01"
    },
    {
      id: "default-2",
      name: "Raj Patel",
      role: "Engineering Student, MIT", 
      content: "The visa application process seemed overwhelming until I found EduReach. They handled everything professionally and kept me informed at every step.",
      rating: 5,
      created_at: "2024-01-02"
    },
    {
      id: "default-3",
      name: "Emily Chen",
      role: "Medical Student, Oxford University",
      content: "Thanks to EduReach's IELTS training program, I achieved the scores needed for Oxford. Their instructors were patient and knowledgeable.",
      rating: 5,
      created_at: "2024-01-03"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  if (loading) {
    return (
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="text-gradient">Students</span> Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our successful students have to say about their experience with EduReach.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Students</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our successful students have to say about their experience with EduReach.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="bg-gradient-card shadow-card hover:shadow-elegant transition-smooth p-6 relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary/20">
                <Quote className="h-8 w-8" />
              </div>

              {/* Student Info */}
              <div className="flex items-center space-x-4 mb-4">
                {testimonial.avatar_url ? (
                  <img 
                    src={testimonial.avatar_url} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
            </Card>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Card className="bg-gradient-hero text-primary-foreground p-8 shadow-elegant">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold mb-2">20,000+</h3>
                <p className="text-primary-foreground/90">Happy Students</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">50+</h3>
                <p className="text-primary-foreground/90">Countries</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">98%</h3>
                <p className="text-primary-foreground/90">Success Rate</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">30+</h3>
                <p className="text-primary-foreground/90">Years Experience</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;