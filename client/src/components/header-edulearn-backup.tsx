import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Phone, Mail } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/courses", label: "Kurslar" },
    { href: "/about", label: "Hakkımızda" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "İletişim" }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-gray-900">EduLearn</div>
                <div className="text-xs text-gray-600">Online Eğitim Platformu</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location === item.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              0212 444 0 555
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-3 rounded text-sm font-medium transition-colors ${
                  location === item.href 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                İletişim
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}