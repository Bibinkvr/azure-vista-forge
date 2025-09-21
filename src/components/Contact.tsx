import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  Plane,
  MessageCircle 
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-consultation-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your consultation request has been sent successfully. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending consultation request:", error);
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "Netherlands", "Sweden", "New Zealand", "Ireland"
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-primary/90"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-8 w-8 mr-3 animate-glow" />
            <h2 className="text-4xl lg:text-6xl font-bold">
              EduReach – Bridging Dreams to Global Success!
            </h2>
          </div>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Simplifying Your Journey to Global Education
          </p>
          <p className="text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed">
            At EduReach, we make studying abroad seamless and stress-free. Whether you need student visa assistance, admission guidance, or test preparation, our team of experts is here to support you at every step. With a high success rate and years of experience, we provide personalized solutions tailored to your academic and career goals.
          </p>
          <p className="text-xl font-semibold mt-6">
            Your dream university is just one step away. Let us guide you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="bg-background/95 backdrop-blur-sm shadow-elegant p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Talk to Our Experts!</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Your Name</Label>
                  <Input 
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 bg-background border-border focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1 bg-background border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone No.</Label>
                  <Input 
                    id="phone"
                    placeholder="Enter your phone no."
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1 bg-background border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-foreground">Desired Country</Label>
                  <Select>
                    <SelectTrigger className="mt-1 bg-background border-border focus:border-primary">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country.toLowerCase()}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="city" className="text-foreground">City</Label>
                <Input 
                  id="city"
                  placeholder="Enter your city"
                  className="mt-1 bg-background border-border focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea 
                  id="message"
                  placeholder="Tell us about your educational goals..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                  className="mt-1 bg-background border-border focus:border-primary resize-none"
                  required
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth group"
                disabled={loading}
              >
                {loading ? "Sending..." : "Get a Free Consultation!"}
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {/* Contact Details */}
            <Card className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 shadow-card p-6">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-primary-foreground/90">+1-555-EDUCATION</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-primary-foreground/90">info@edureach.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Office</p>
                    <p className="text-primary-foreground/90">123 Education Plaza, Global City</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <Clock className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Office Hours</p>
                    <p className="text-primary-foreground/90">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Why Choose Us */}
            <Card className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 shadow-card p-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose EduReach?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-primary-foreground/90">30+ Years Experience: Thousands of students have achieved their dreams through our guidance.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-primary-foreground/90">High Success Rate: We maintain an excellent track record with visa approvals.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-primary-foreground/90">Global Partnerships: Strong relationships with top universities worldwide.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-primary-foreground/90">End-to-End Support: From first consultation to your departure - we're with you.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;