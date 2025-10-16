import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/beyondviewfinder-logo.png";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
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
    return () => subscription.unsubscribe();
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
  return <header className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-background/40 backdrop-blur-md border border-border/50 rounded-2xl shadow-elegant">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Beyond View Finder" className="h-16 w-auto" />
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <a key={item.label} href={item.href} className="text-foreground hover:text-primary transition-smooth relative group">
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-smooth origin-left"></span>
              </a>)}
          </nav>

          {/* CTA Button / Profile */}
          <div className="hidden md:block">
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-0">
                    <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-smooth">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {userProfile?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border z-[100]">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-sm">{userProfile?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userProfile?.type || 'user'}</p>
                  </div>
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button variant="default" className="bg-gradient-primary hover:shadow-glow transition-smooth" onClick={() => navigate("/auth")}>
                Sign Up
              </Button>}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-smooth" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navItems.map(item => <a key={item.label} href={item.href} className="text-foreground hover:text-primary transition-smooth px-4 py-2 rounded-lg hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>)}
              <div className="px-4 pt-2">
                {user ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={userProfile?.avatar_url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {userProfile?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Profile Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-[100]">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="font-medium text-sm">{userProfile?.name || user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{userProfile?.type || 'user'}</p>
                      </div>
                      <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <Button variant="default" className="w-full bg-gradient-primary hover:shadow-glow transition-smooth" onClick={() => navigate("/auth")}>
                    Sign Up
                  </Button>}
              </div>
            </nav>
          </div>}
        </div>
      </div>
    </header>;
};
export default Header;