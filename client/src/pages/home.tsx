import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Smartphone, Globe, Server, Database, Zap, Users, Award, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Web Development Excellence",
      subtitle: "Modern, Fast & Secure Web Solutions",
      description: "We create stunning websites and powerful web applications that drive your business forward."
    },
    {
      title: "Mobile App Development", 
      subtitle: "iOS & Android Native Apps",
      description: "Cross-platform mobile applications with native performance and beautiful user experiences."
    },
    {
      title: "Custom Software Solutions",
      subtitle: "Tailored to Your Business Needs",
      description: "Enterprise-grade software solutions designed specifically for your unique requirements."
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
      icon: Globe,
      title: "Web Development",
      description: "Responsive websites, e-commerce platforms, and web applications using modern technologies.",
      technologies: ["React", "Next.js", "TypeScript", "Node.js"]
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native iOS and Android apps, React Native, and Flutter cross-platform solutions.",
      technologies: ["React Native", "Flutter", "iOS", "Android"]
    },
    {
      icon: Server,
      title: "Backend Systems",
      description: "Scalable APIs, microservices, cloud infrastructure, and database design.",
      technologies: ["Python", "Node.js", "AWS", "PostgreSQL"]
    },
    {
      icon: Database,
      title: "Database Solutions",
      description: "Database design, optimization, migration, and data analytics solutions.",
      technologies: ["PostgreSQL", "MongoDB", "Redis", "Analytics"]
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Speed optimization, SEO, monitoring, and technical consulting services.",
      technologies: ["SEO", "Analytics", "Monitoring", "CDN"]
    },
    {
      icon: Code,
      title: "Custom Software",
      description: "Enterprise software, automation tools, and business process optimization.",
      technologies: ["Python", "Java", "C#", "Automation"]
    }
  ];

  const features = [
    "Free Consultation & Project Analysis",
    "Modern Tech Stack & Best Practices", 
    "Mobile-First Responsive Design",
    "SEO Optimized & Fast Loading",
    "24/7 Support & Maintenance",
    "Secure & Scalable Solutions"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">DevStudio</div>
                <div className="text-xs text-gray-600">Web & Software Development</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <div className="transition-all duration-1000 ease-in-out">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-xl md:text-3xl font-semibold mb-6 text-blue-200 drop-shadow-md">
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg">
                View Our Work
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive digital solutions to help your business thrive in the modern world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {service.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Quality, Innovation, and Reliability in Every Project</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-200">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get in touch with us today for a free consultation and project estimate
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
              <Users className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Get Free Quote
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
              <p className="text-gray-600">hello@devstudio.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Phone</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Response Time</h4>
              <p className="text-gray-600">Within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">DevStudio</span>
          </div>
          <p className="text-gray-400 mb-4">Professional Web & Software Development Services</p>
          <p className="text-sm text-gray-500">
            © 2025 DevStudio. All rights reserved. | Made with ❤️ for businesses worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}