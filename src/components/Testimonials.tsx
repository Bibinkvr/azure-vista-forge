import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start"
  });
  useEffect(() => {
    loadTestimonials();
  }, []);
  const loadTestimonials = async () => {
    try {
      // Load testimonials from both admin testimonials and user testimonials
      const [adminTestimonials, userTestimonials] = await Promise.all([supabase.from("testimonials").select("*").eq("is_active", true).order("created_at", {
        ascending: false
      }), supabase.from("user_testimonials").select("*").eq("is_active", true).order("created_at", {
        ascending: false
      })]);
      const allTestimonials = [...(adminTestimonials.data || []), ...(userTestimonials.data || [])];

      // Sort by creation date and take the most recent ones
      const sortedTestimonials = allTestimonials.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6); // Show top 6 testimonials

      setTestimonials(sortedTestimonials);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      // Fallback to default testimonials if database fails
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`h-5 w-5 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />);
  };

  // Default testimonials for fallback
  const defaultTestimonials: Testimonial[] = [{
    id: "default-1",
    name: "Sarah Johnson",
    role: "MBA Student, Harvard Business School",
    content: "Beyond View Finder made my dream of studying at Harvard a reality. Their expert guidance through the application process was invaluable.",
    rating: 5,
    created_at: "2024-01-01"
  }, {
    id: "default-2",
    name: "Raj Patel",
    role: "Engineering Student, MIT",
    content: "The visa application process seemed overwhelming until I found Beyond View Finder. They handled everything professionally and kept me informed at every step.",
    rating: 5,
    created_at: "2024-01-02"
  }, {
    id: "default-3",
    name: "Emily Chen",
    role: "Medical Student, Oxford University",
    content: "Thanks to Beyond View Finder's IELTS training program, I achieved the scores needed for Oxford. Their instructors were patient and knowledgeable.",
    rating: 5,
    created_at: "2024-01-03"
  }];
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  if (loading) {
    return <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>;
  }
  return <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-4 text-white">
            <div className="inline-block mb-6">
              <div className="relative">
                <span className="text-sm font-bold tracking-wider border-2 border-white px-6 py-2 inline-block">
                  TESTIMONIALS
                </span>
                <div className="absolute -top-2 -right-2 w-4 h-4">
                  <div className="w-full h-full bg-primary rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl mb-6 leading-tight text-[#29ff03] font-extrabold text-left lg:text-3xl">
              What say peoples<br />about us
            </h2>
            
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              We strongly support best practice sharing across our operations around the world and across various sectors.
            </p>
            
            {/* Navigation Arrows */}
            <div className="flex gap-4">
              <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full w-14 h-14 border-2 border-white bg-transparent hover:bg-white hover:text-slate-900 text-white transition-smooth">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full w-14 h-14 border-2 border-white bg-transparent hover:bg-white hover:text-slate-900 text-white transition-smooth">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Right - Carousel */}
          <div className="lg:col-span-8 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayTestimonials.map(testimonial => <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_45%]">
                  <Card className="bg-white p-8 relative h-full flex flex-col">
                    {/* Avatar with Border */}
                    <div className="flex justify-center mb-6 -mt-16">
                      {testimonial.avatar_url ? <div className="relative">
                          <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
                          <img src={testimonial.avatar_url} alt={testimonial.name} className="w-24 h-24 rounded-full object-cover border-4 border-white" />
                        </div> : <div className="relative">
                          <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
                          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center border-4 border-white">
                            <span className="text-primary-foreground font-bold text-2xl">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        </div>}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-center mb-4 text-slate-900">
                      Great Service
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-6">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-slate-600 text-center leading-relaxed mb-6 flex-grow">
                      {testimonial.content}
                    </p>

                    {/* Name and Role */}
                    <div className="text-center border-t pt-4">
                      <h4 className="font-bold text-lg text-slate-900 mb-1">{testimonial.name}</h4>
                      <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                    </div>
                  </Card>
                </div>)}
            </div>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="mt-20">
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
    </section>;
};
export default Testimonials;