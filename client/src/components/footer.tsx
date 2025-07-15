import { Link } from "wouter";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
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
          
          <div>
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
          
          <div>
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
          
          <div>
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-10 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
              <div className="w-10 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">DISC</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-neutral-400">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <div className="w-8 h-5 rounded-sm overflow-hidden mr-3">
                <img 
                  src={turkeyFlag} 
                  alt="Turkey Flag" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-white">Turkey E-Visa Service</span>
            </div>
            
            {/* Official Turkish Government Emblem */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center p-2">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#DAA520" stroke="#FFD700" strokeWidth="2"/>
                  <g fill="#FFFFFF">
                    {/* Outer stars ring */}
                    <g transform="translate(50,50)">
                      {Array.from({ length: 16 }, (_, i) => (
                        <g key={i} transform={`rotate(${i * 22.5})`}>
                          <path d="M0,-38 L1,-36 L3,-36 L1,-34 L2,-32 L0,-33 L-2,-32 L-1,-34 L-3,-36 L-1,-36 Z"/>
                        </g>
                      ))}
                    </g>
                    {/* Crescent and star */}
                    <path d="M35 50 A8 8 0 0 0 51 50 A6 6 0 0 1 35 50 Z"/>
                    <path d="M58 45 L60 49 L64 49 L61 52 L62 56 L58 54 L54 56 L55 52 L52 49 L56 49 Z"/>
                  </g>
                </svg>
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
