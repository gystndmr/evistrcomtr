import { Link } from "wouter";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeyEmblem from "@assets/Ekran Resmi 2025-07-15 17.05.26_1752588365236.png";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Application</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/application" className="hover:text-primary transition-colors">
                  New Application
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  Check Status
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  Download E-Visa
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Processing Times
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Live Chat
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors text-xs opacity-30">
                  •
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8">
          {/* Security and Payment badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span>Government Approved</span>
            </div>
          </div>
          
          {/* Credit Card Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-xs text-neutral-400 mr-2">We Accept:</div>
            <div className="flex items-center space-x-2 flex-wrap justify-center">
              <div className="w-12 h-7 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-12 h-7 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-12 h-7 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
              <div className="w-12 h-7 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">DISC</div>
              <div className="w-12 h-7 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">TROY</div>
              <div className="w-12 h-7 bg-yellow-600 rounded text-white text-xs flex items-center justify-center font-bold">UNION</div>
              <div className="w-12 h-7 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">JCB</div>
              <div className="w-12 h-7 bg-indigo-600 rounded text-white text-xs flex items-center justify-center font-bold">DINER</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-neutral-400">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 mr-3 shadow-sm">
                <svg width="32" height="32" viewBox="0 0 200 200" className="w-full h-full" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'}}>
                  <defs>
                    <linearGradient id="footerEmblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#E30A17', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#C41E3A', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="url(#footerEmblemGradient)" stroke="#C41E3A" strokeWidth="10"/>
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
              <span className="font-medium text-white">Turkey E-Visa Service</span>
            </div>
            
            {/* Official Turkish Government Emblem */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src={turkeyEmblem} 
                  alt="Turkish Government Emblem" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            
            <p>&copy; 2024 Turkey E-Visa Application Service. All rights reserved.</p>
            <p className="mt-2">Professional Visa Application Service</p>
            <p className="mt-1 text-xs">Fast, reliable and secure visa processing</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
