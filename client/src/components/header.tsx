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
              <div className="w-10 h-10 shadow-sm">
                <svg width="40" height="40" viewBox="0 0 200 200" className="w-full h-full" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'}}>
                  <defs>
                    <linearGradient id="headerEmblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#E30A17', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#C41E3A', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="url(#headerEmblemGradient)" stroke="#C41E3A" strokeWidth="10"/>
                  <g fill="#E30A17">
                    {/* Crescent moon */}
                    <path d="M 60 100 A 25 25 0 1 1 60 100.1 A 20 20 0 1 0 60 100 Z"/>
                    {/* Star */}
                    <polygon points="130,85 135,95 145,95 137,102 140,112 130,107 120,112 123,102 115,95 125,95"/>
                    {/* Laurel wreath left */}
                    <path d="M 40 120 Q 45 115 50 120 Q 52 125 48 130 Q 45 135 40 130 Q 35 125 40 120"/>
                    <path d="M 45 135 Q 50 130 55 135 Q 57 140 53 145 Q 50 150 45 145 Q 40 140 45 135"/>
                    <path d="M 50 150 Q 55 145 60 150 Q 62 155 58 160 Q 55 165 50 160 Q 45 155 50 150"/>
                    <path d="M 42 108 Q 47 103 52 108 Q 54 113 50 118 Q 47 123 42 118 Q 37 113 42 108"/>
                    <path d="M 47 96 Q 52 91 57 96 Q 59 101 55 106 Q 52 111 47 106 Q 42 101 47 96"/>
                    <path d="M 52 84 Q 57 79 62 84 Q 64 89 60 94 Q 57 99 52 94 Q 47 89 52 84"/>
                    <path d="M 57 72 Q 62 67 67 72 Q 69 77 65 82 Q 62 87 57 82 Q 52 77 57 72"/>
                    {/* Laurel wreath right */}
                    <path d="M 160 120 Q 155 115 150 120 Q 148 125 152 130 Q 155 135 160 130 Q 165 125 160 120"/>
                    <path d="M 155 135 Q 150 130 145 135 Q 143 140 147 145 Q 150 150 155 145 Q 160 140 155 135"/>
                    <path d="M 150 150 Q 145 145 140 150 Q 138 155 142 160 Q 145 165 150 160 Q 155 155 150 150"/>
                    <path d="M 158 108 Q 153 103 148 108 Q 146 113 150 118 Q 153 123 158 118 Q 163 113 158 108"/>
                    <path d="M 153 96 Q 148 91 143 96 Q 141 101 145 106 Q 148 111 153 106 Q 158 101 153 96"/>
                    <path d="M 148 84 Q 143 79 138 84 Q 136 89 140 94 Q 143 99 148 94 Q 153 89 148 84"/>
                    <path d="M 143 72 Q 138 67 133 72 Q 131 77 135 82 Q 138 87 143 82 Q 148 77 143 72"/>
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
