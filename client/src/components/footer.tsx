import { Link } from "wouter";
import { Megaphone, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">AdAgency</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We create powerful advertising campaigns that connect brands with their audiences and drive real business results.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-pink-400">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services/advertising" className="hover:text-pink-400 transition-colors">
                  Advertising Campaigns
                </Link>
              </li>
              <li>
                <Link href="/services/digital" className="hover:text-pink-400 transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/services/branding" className="hover:text-pink-400 transition-colors">
                  Brand Identity
                </Link>
              </li>
              <li>
                <Link href="/services/production" className="hover:text-pink-400 transition-colors">
                  Creative Production
                </Link>
              </li>
              <li>
                <Link href="/services/analytics" className="hover:text-pink-400 transition-colors">
                  Analytics & Insights
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-pink-400">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-pink-400 transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-pink-400 transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-pink-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-pink-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-pink-400">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">123 Creative Street, NY 10001</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">hello@adagency.com</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-pink-400 mb-2">Office Hours</h4>
              <p className="text-gray-400 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-400 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-400 text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Awards and Certifications */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">AWARD</span>
              </div>
              <p className="text-xs text-gray-500">Best Creative Agency 2024</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">CERT</span>
              </div>
              <p className="text-xs text-gray-500">Google Partner Certified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">ISO</span>
              </div>
              <p className="text-xs text-gray-500">ISO 9001:2015 Certified</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-pink-400 transition-colors">Cookie Policy</Link>
              <Link href="/sitemap" className="hover:text-pink-400 transition-colors">Sitemap</Link>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span>🏆 Award-Winning Agency</span>
              <span>•</span>
              <span>📈 Proven Results</span>
              <span>•</span>
              <span>🎯 Strategic Approach</span>
            </div>
            <p>&copy; 2025 AdAgency. All rights reserved.</p>
            <p className="mt-2 text-xs">Building brands, driving growth, creating impact.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}