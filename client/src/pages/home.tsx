import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, Target, TrendingUp, Users, Award, Star, 
  ArrowRight, CheckCircle, BarChart3, Zap, Eye, 
  Camera, Palette, Monitor, Smartphone, Globe 
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Creative Advertising Solutions",
      subtitle: "Your Brand, Our Passion",
      description: "We create powerful advertising campaigns that connect with your audience and drive real results."
    },
    {
      title: "Digital Marketing Excellence", 
      subtitle: "Reach More, Sell More",
      description: "Strategic digital marketing campaigns across all platforms to maximize your brand's visibility."
    },
    {
      title: "Brand Identity & Design",
      subtitle: "Stand Out From The Crowd",
      description: "Complete brand identity solutions that make your business memorable and impactful."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      icon: Megaphone,
      title: "Advertising Campaigns",
      description: "Creative and strategic advertising campaigns across traditional and digital channels.",
      features: ["TV & Radio Ads", "Print Advertising", "Outdoor Billboards", "Digital Display"]
    },
    {
      icon: Target,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies to reach your target audience effectively.",
      features: ["Social Media Marketing", "Google Ads", "SEO & Content", "Email Campaigns"]
    },
    {
      icon: Palette,
      title: "Brand Identity",
      description: "Complete brand identity development from logo design to brand guidelines.",
      features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy"]
    },
    {
      icon: Camera,
      title: "Creative Production",
      description: "High-quality video, photo, and graphic content production for all your needs.",
      features: ["Video Production", "Photography", "Graphic Design", "Animation"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Data-driven insights and performance tracking for all your campaigns.",
      features: ["Campaign Analytics", "ROI Tracking", "Market Research", "Performance Reports"]
    },
    {
      icon: Globe,
      title: "Web & Digital",
      description: "Modern websites and digital experiences that convert visitors into customers.",
      features: ["Website Design", "E-commerce", "Landing Pages", "Mobile Apps"]
    }
  ];

  const achievements = [
    { number: "500+", label: "Successful Campaigns" },
    { number: "200+", label: "Happy Clients" },
    { number: "50M+", label: "People Reached" },
    { number: "15+", label: "Years Experience" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      text: "Their creative approach transformed our brand completely. Sales increased by 300% in just 6 months!"
    },
    {
      name: "Michael Chen",
      company: "Restaurant Chain",
      text: "The digital campaigns they created brought us thousands of new customers. Amazing results!"
    },
    {
      name: "Emma Davis",
      company: "Fashion Brand",
      text: "Professional, creative, and results-driven. They understand our brand perfectly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-6xl mx-auto">
            <div className="transition-all duration-1000 ease-in-out">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-pink-200 drop-shadow-md">
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-10 py-6 text-xl font-semibold">
                Start Your Campaign
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-900 px-10 py-6 text-xl font-semibold">
                View Our Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From creative strategy to execution, we provide end-to-end advertising solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h2>
            <p className="text-xl text-purple-200">Numbers that speak for our success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  {achievement.number}
                </div>
                <div className="text-purple-200 text-lg">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real results from real businesses</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-10 opacity-90">
            Let's create an advertising campaign that drives real results for your brand
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-10 py-6 text-xl font-semibold">
              <Users className="w-6 h-6 mr-2" />
              Get Free Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700 px-10 py-6 text-xl font-semibold">
              Request Quote
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-xl mb-2">Contact</h4>
              <p className="text-purple-200">hello@adagency.com</p>
              <p className="text-purple-200">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-2">Office Hours</h4>
              <p className="text-purple-200">Monday - Friday</p>
              <p className="text-purple-200">9:00 AM - 6:00 PM</p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-2">Response Time</h4>
              <p className="text-purple-200">Within 2 hours</p>
              <p className="text-purple-200">24/7 Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}