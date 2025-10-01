import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/beyondviewfinder-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe all sections
    const sections = ["home", "about", "services", "testimonials", "contact"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      subscription.unsubscribe();
      observer.disconnect();
    };
  }, []);
  const loadUserProfile = async (userId: string) => {
    // Try to get admin profile first
    const {
      data: adminProfile
    } = await supabase.from("admin_profiles").select("*").eq("user_id", userId).single();
    if (adminProfile) {
      setUserProfile({
        ...adminProfile,
        type: 'admin'
      });
    } else {
      // If no admin profile, just set as regular user
      setUserProfile({
        type: 'user'
      });
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  const handleProfileClick = () => {
    if (userProfile?.type === 'admin') {
      navigate("/admin/dashboard");
    } else {
      navigate("/profile");
    }
  };
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  const navItems = [{
    label: "Home",
    href: "#home"
  }, {
    label: "About",
    href: "#about"
  }, {
    label: "Services",
    href: "#services"
  }, {
    label: "Testimonials",
    href: "#testimonials"
  }, {
    label: "Contact",
    href: "#contact"
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-elegant transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleSmoothScroll(e, "#home")}
            className="flex items-center space-x-3 hover:opacity-80 transition-smooth"
          >
            <img src={logo} alt="Beyond View Finder" className="h-12 w-auto animate-fade-in" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a 
                  key={item.label} 
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`text-sm font-medium transition-smooth relative group ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-primary transition-smooth origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}></span>
                </a>
              );
            })}
          </nav>

          {/* CTA Button / Profile */}
          <div className="hidden md:block">
            {user ? <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/50 p-2 rounded-lg transition-smooth" onClick={handleProfileClick}>
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={userProfile?.avatar_url} />
                    <AvatarFallback>
                      {userProfile?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{userProfile?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userProfile?.type || 'user'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div> : <Button variant="default" className="bg-gradient-primary hover:shadow-glow transition-smooth hover:scale-105" onClick={() => navigate("/auth")}>
                Sign Up
              </Button>}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-smooth active:scale-95" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 animate-scale-in" /> : <Menu className="h-6 w-6 animate-scale-in" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border animate-slide-in-right bg-background/98 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a 
                    key={item.label} 
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`text-foreground transition-smooth px-4 py-3 rounded-lg font-medium animate-fade-in ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary hover:text-primary"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="px-4 pt-4 animate-fade-in" style={{ animationDelay: "250ms" }}>
                {user ? <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/80 cursor-pointer hover:bg-secondary transition-smooth" onClick={handleProfileClick}>
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback>
                          {userProfile?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm flex-1">
                        <p className="font-medium">{userProfile?.name || user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{userProfile?.type || 'user'}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div> : <Button variant="default" className="w-full bg-gradient-primary hover:shadow-glow transition-smooth hover:scale-105" onClick={() => navigate("/auth")}>
                    Sign Up
                  </Button>}
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;