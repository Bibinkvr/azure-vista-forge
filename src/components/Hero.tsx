import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TrackableAirplane from "./TrackableAirplane";
import heroStudentsImage from "@/assets/hero-students.png";
import studyAbroadImage from "@/assets/study-abroad-hero.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return <section id="home" className="min-h-screen pt-16 relative overflow-hidden">
      {/* Trackable Airplane */}
      <TrackableAirplane />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{
      animationDelay: "2s"
    }}></div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Unlock Your{" "}
                <span className="text-gradient">Future</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-muted-foreground">
                <span className="text-accent">Global Education</span> means{" "}
                <span className="text-foreground">Limitless Possibilities!</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Transform your academic dreams into reality with our expert guidance. 
              Whether you need student visa assistance, admission guidance, or test 
              preparation - we're here to support your journey to global success.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>)}
                </div>
                <div>
                  <p className="font-semibold">20,000+</p>
                  <p className="text-sm text-muted-foreground">Trust Customers</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-smooth group" onClick={() => navigate("/auth")}>
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
              </Button>
              
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={studyAbroadImage} 
                alt="International students studying abroad" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;