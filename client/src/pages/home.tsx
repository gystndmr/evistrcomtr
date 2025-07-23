import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <Header />
      
      {/* Modern Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="slide-up">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Modern Digital Service Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              Turkey Travel
              <br />
              <span className="text-6xl md:text-8xl">Services</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Fast, secure, and professional e-visa applications and travel insurance services for Turkey
            </p>

            {/* Modern Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/application">
                <Button size="lg" className="group px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  Apply for E-Visa
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/status">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white transition-all duration-300">
                  Check Application Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel documentation with our cutting-edge digital platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="modern-card rounded-2xl p-8 text-center float-animation">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your e-visa approved in minutes with our streamlined digital processing system
              </p>
            </div>

            {/* Feature 2 */}
            <div className="modern-card rounded-2xl p-8 text-center float-animation delay-75">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your personal data is protected with enterprise-grade security and encryption
              </p>
            </div>

            {/* Feature 3 */}
            <div className="modern-card rounded-2xl p-8 text-center float-animation delay-150">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply from anywhere in the world with support for 6 languages and 24/7 service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Insurance CTA */}
      <section className="py-20 purple-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Protect Your Journey
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Comprehensive travel insurance coverage for your Turkey adventure. Get instant protection and peace of mind.
            </p>
            <Link href="/insurance">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold bg-white text-purple-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Travel Insurance
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="slide-up">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600">Applications Processed</div>
            </div>
            <div className="slide-up">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="slide-up">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="slide-up">
              <div className="text-4xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}