import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Star, Menu, X } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/application", label: t('header.application') },
    { href: "/status", label: t('header.status') },
    { href: "/insurance", label: t('header.insurance') },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-7 shadow-sm">
                <svg width="40" height="28" viewBox="0 0 300 200" className="w-full h-full" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'}}>
                  <defs>
                    <linearGradient id="flagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#E30A17', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#C41E3A', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="200" fill="url(#flagGradient)" rx="2"/>
                  <g fill="#FFFFFF">
                    <circle cx="90" cy="100" r="35" fill="#FFFFFF"/>
                    <circle cx="103" cy="100" r="28" fill="#E30A17"/>
                    <polygon points="165,70 175,85 192,80 185,95 200,100 185,105 192,120 175,115 165,130 170,105 155,100 170,95" fill="#FFFFFF"/>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-neutral-800">Turkey E-Visa</div>
                <div className="text-xs text-neutral-600">Professional Visa Application Service</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-neutral-700"
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
