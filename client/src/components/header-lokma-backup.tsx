import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Utensils, Phone, MapPin } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/menu", label: "Menü" },
    { href: "/locations", label: "Konumlar" },
    { href: "/catering", label: "Etkinlik" },
    { href: "/contact", label: "İletişim" }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-orange-800">Seyyar Lokmacı</div>
                <div className="text-xs text-orange-600">Geleneksel Lezzet</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                  location === item.href ? "text-orange-600" : "text-orange-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              0532 123 4567
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
        <div className="md:hidden bg-white border-t border-orange-200">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-3 rounded text-sm font-medium transition-colors ${
                  location === item.href 
                    ? "bg-orange-100 text-orange-600" 
                    : "text-orange-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-orange-200">
              <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Hemen Ara
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}