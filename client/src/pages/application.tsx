import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisaForm } from "@/components/visa-form";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import cappadociaImg from "../../../attached_assets/pexels-musaortac-14186574_1752590100661.jpg";
import ephesusImg from "../../../attached_assets/pexels-hilal-tosun-54875889-33011223_1752590240668.jpg";
import antalyaImg from "../../../attached_assets/pexels-mikhail-nilov-8322807_1752590250012.jpg";
import bosphorusImg from "../../../attached_assets/pexels-ugur-kahraman-1765266160-29649889_1752590268560.jpg";
import pamukkaleImg from "../../../attached_assets/pexels-fromsalih-27829278_1752590288989.jpg";

export default function Application() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Turkish landmark images 
  const turkishLandmarks = [
    { image: cappadociaImg },
    { image: ephesusImg }, 
    { image: antalyaImg },
    { image: bosphorusImg },
    { image: pamukkaleImg }
  ];

  // Seed initial data on component mount
  const seedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/seed");
    },
    onError: (error) => {
      console.error("Failed to seed data:", error);
    },
  });

  // ⚡ PERFORMANCE: Progressive image loading - show first image immediately
  useEffect(() => {
    const progressiveImageLoad = async () => {
      // ⚡ Step 1: Load first image immediately for instant display
      const firstImage = new Image();
      firstImage.onload = () => {
        setImagesLoaded(true); // Show content immediately with first image
        console.log('🚀 First application image loaded - showing content');
      };
      firstImage.onerror = () => {
        setImagesLoaded(true); // Show content even if first image fails
      };
      firstImage.src = turkishLandmarks[0].image;

      // ⚡ Step 2: Load remaining images in background (non-blocking)
      setTimeout(() => {
        const remainingImagePromises = turkishLandmarks.slice(1).map((landmark) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = landmark.image;
          });
        });

        Promise.all(remainingImagePromises).then(() => {
          console.log('🚀 All remaining application images loaded in background');
        }).catch((error) => {
          console.log('⚠️ Some background images failed to load:', error);
        });
      }, 100); // Small delay to prioritize first image
    };

    progressiveImageLoad();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % turkishLandmarks.length);
    }, 5000); // Slower transition for form page
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Seed data when component mounts
    seedMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative min-h-screen overflow-hidden">
        {/* Loading Placeholder */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Loading Turkey's beautiful landmarks...</p>
            </div>
          </div>
        )}

        {/* Background Slides - Turkish Landmarks */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {turkishLandmarks.map((landmark, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={landmark.image}
                alt={`Turkish landmark ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                {...(index === 0 ? { fetchpriority: "high" } : { fetchpriority: "low" })}
                style={{
                  contentVisibility: index === currentSlide ? 'visible' : 'auto',
                  contain: 'layout style paint'
                }}
              />
              <div className="absolute inset-0 bg-black opacity-40" />
            </div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-4 sm:pt-6 lg:pt-8 z-10">
          <VisaForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
