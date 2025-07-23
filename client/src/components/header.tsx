import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Star, Menu, X } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeyLogo from "@/assets/turkey-logo.png";
import turkeyFlagCircle from "@/assets/turkey-flag-circle.png";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t('header.home') },
    { href: "/application", label: t('header.application') },
    { href: "/status", label: t('header.status') },
    { href: "/insurance", label: t('header.insurance') },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold gradient-text">Turkey Services</div>
                <div className="text-xs text-gray-500">Digital Platform</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary px-4 py-2 rounded-lg ${
                  location === item.href ? "text-primary bg-purple-50" : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
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
        <div className="md:hidden bg-white border-t border-neutral-200">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-neutral-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
