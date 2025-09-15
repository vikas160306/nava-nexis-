import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  Phone,
  Menu,
  X,
  LogIn,
  LogOut,
  UserCircle,
  MessageCircle,
  Shield,
  Mail // Added Mail icon import
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { name: "Home", path: "", icon: null },
  { name: "About", path: "About", icon: Users },
  { name: "Services", path: "Services", icon: Briefcase },
  { name: "Contact", path: "Contact", icon: Phone },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    User.login();
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    window.location.href = createPageUrl(''); // Redirect to home on logout
  };

  const whatsappUrl = "https://wa.me/916281883409";
  const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c8236302100f5ecba924f3/ec6c87358_navanexixlogo.jpg";

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("")} className="flex items-center space-x-3">
              <img src={logoUrl} alt="Nava Nexis Logo" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-xl font-bold text-gray-900">Nava Nexis</div>
                <div className="text-xs text-blue-600 font-medium">Your Vision, Our Creation</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                    location.pathname === createPageUrl(item.path)
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Chat Now</span>
              </a>

              <Separator orientation="vertical" className="h-4" />

              {!loading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <UserCircle className="w-4 h-4" />
                          <span>{user.full_name?.split(' ')[0] || 'User'}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          My Projects
                        </DropdownMenuItem>
                        {user.role === 'admin' && (
                          <>
                            <DropdownMenuSeparator />
                            <Link to={createPageUrl('AdminDashboard')}>
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Dashboard
                              </DropdownMenuItem>
                            </Link>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button onClick={handleLogin} size="sm" variant="outline">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className={`text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                      location.pathname === createPageUrl(item.path)
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <Separator className="my-2" />
                
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-base font-medium">Chat on WhatsApp</span>
                </a>

                <Separator className="my-2" />

                {!loading && (
                  <>
                    {user ? (
                      <div className="flex flex-col space-y-3 pt-2">
                        <div className="text-sm text-gray-600 px-1">
                          Welcome, {user.full_name?.split(' ')[0] || 'User'}
                        </div>
                        {user.role === 'admin' && (
                           <Link to={createPageUrl('AdminDashboard')} onClick={() => setMobileMenuOpen(false)}>
                            <Button variant='ghost' className="w-full justify-start">
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button onClick={handleLogout} variant="outline" size="sm" className="w-fit">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleLogin} size="sm" className="w-fit">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login / Register
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoUrl} alt="Nava Nexis Logo" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-bold text-gray-900">Nava Nexis</div>
                  <div className="text-xs text-blue-600 font-medium">Your Vision, Our Creation</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                A professional publishing and creative solutions platform helping authors, businesses, 
                and creators bring their ideas to life with quality, simplicity, and affordability.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 6281883409 • +91 8341848659</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" /> {/* Mail icon used here */}
                  <span>navanexis@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={createPageUrl(item.path)}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Book Publishing</li>
                <li>Creative Design</li>
                <li>Brand Solutions</li>
                <li>Content Creation</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 Nava Nexis. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
