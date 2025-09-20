import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "MBA Student",
      university: "Harvard Business School",
      image: "SJ",
      rating: 5,
      text: "EduReach made my dream of studying at Harvard a reality. Their expert guidance through the application process was invaluable. The team's dedication and personalized approach exceeded my expectations."
    },
    {
      name: "Raj Patel",
      role: "Engineering Student", 
      university: "MIT",
      image: "RP",
      rating: 5,
      text: "The visa application process seemed overwhelming until I found EduReach. They handled everything professionally and kept me informed at every step. Now I'm pursuing my Master's at MIT!"
    },
    {
      name: "Emily Chen",
      role: "Medical Student",
      university: "Oxford University",
      image: "EC",
      rating: 5,
      text: "Thanks to EduReach's IELTS training program, I achieved the scores needed for Oxford. Their instructors were patient, knowledgeable, and truly cared about my success."
    },
    {
      name: "Ahmed Hassan",
      role: "PhD Candidate",
      university: "Stanford University",
      image: "AH",
      rating: 5,
      text: "EduReach didn't just help me get admitted to Stanford - they helped me secure a full scholarship! Their scholarship assistance program is truly exceptional."
    },
    {
      name: "Maria Rodriguez",
      role: "Business Student",
      university: "London School of Economics",
      image: "MR",
      rating: 5,
      text: "The career counseling sessions helped me choose the perfect program at LSE. The team's industry insights and personalized advice were game-changers for my future."
    },
    {
      name: "David Kim",
      role: "Computer Science Student",
      university: "University of Toronto",
      image: "DK",
      rating: 5,
      text: "From document processing to interview preparation, EduReach covered everything. Their attention to detail and commitment to student success is remarkable."
    }
  ];

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
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="bg-gradient-card shadow-card hover:shadow-elegant transition-smooth p-6 relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary/20">
                <Quote className="h-8 w-8" />
              </div>

              {/* Student Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {testimonial.image}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary font-medium">{testimonial.university}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground leading-relaxed text-sm">
                "{testimonial.text}"
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