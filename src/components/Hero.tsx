import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TrackableAirplane from "./TrackableAirplane";
import educationHeroImage from "@/assets/education-hero.jpg";
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
            <Card className="bg-gradient-card shadow-card p-6 max-w-md">
              <h3 className="font-semibold mb-2">Contact Us:</h3>
              <p className="text-primary font-semibold text-lg">+1-555-EDUCATION</p>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-smooth group" onClick={() => navigate("/auth")}>
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
              </Button>
              
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <div className="relative z-10">
              <img 
                src={educationHeroImage} 
                alt="Students studying abroad with global education opportunities" 
                className="w-full h-auto rounded-3xl shadow-elegant"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-card shadow-card rounded-2xl p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">30+ Years</p>
                  <p className="text-sm text-muted-foreground">Experience</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card shadow-card rounded-2xl p-4 animate-float" style={{
            animationDelay: "1s"
          }}>
              <div className="flex items-center space-x-3">
                <div className="bg-accent p-2 rounded-lg">
                  <Award className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold">100%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-12 bg-card shadow-card rounded-2xl p-4 animate-float" style={{
            animationDelay: "2s"
          }}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">50+</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;