import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Globe, Server, Smartphone } from 'lucide-react';
import promoItServices from '@/assets/promo-it-services.jpg';
import promoHosting from '@/assets/promo-hosting.jpg';

interface PromoSlide {
  id: string;
  image: string;
  icon: React.ReactNode;
  badge: string;
  headline: string;
  offer: string;
  ctaText: string;
  ctaUrl: string;
  accentColor: string;
}

const promoSlides: PromoSlide[] = [
  {
    id: '1',
    image: promoItServices,
    icon: <Globe className="w-5 h-5" />,
    badge: '🔥 HOT DEAL',
    headline: 'Professional Website development',
    offer: 'Starting at 100,000 RWF',
    ctaText: 'GET YOURS NOW →',
    ctaUrl: 'https://wa.me/0787462384',
    accentColor: 'from-orange-500 to-red-500',
  },
  {
    id: '2',
    image: promoHosting,
    icon: <Server className="w-5 h-5" />,
    badge: '⚡ LIMITED TIME',
    headline: 'IT support & Maintenance',
    offer: 'From RWF 5,000/month',
    ctaText: 'START FREE TRIAL →',
    ctaUrl: 'https://wa.me/0787462384',
    accentColor: 'from-cyan-500 to-blue-500',
  },
  {
    id: '3',
    image: promoItServices,
    icon: <Smartphone className="w-5 h-5" />,
    badge: '✨ NEW SERVICE',
    headline: 'Mobile App Development',
    offer: 'Custom Quote',
    ctaText: 'GET FREE QUOTE →',
    ctaUrl: 'https://wa.me/0787462384',
    accentColor: 'from-purple-500 to-pink-500',
  },
];

const PromoBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = promoSlides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % promoSlides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);

  return (
    <div className="relative rounded-xl overflow-hidden group">
      {/* Animated border glow */}
      <div className={`absolute -inset-[2px] bg-linear-to-r ${currentSlide.accentColor} rounded-xl opacity-75 blur-sm animate-pulse`} />
      
      <div className="relative bg-black rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.headline}
            className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 md:p-8 min-h-[140px] sm:min-h-[160px]">
          <div className="flex-1 space-y-2 sm:space-y-3">
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/10 backdrop-blur-sm text-white/60 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded border border-white/20">
                ADVERTISEMENT
              </span>
              <span className={`bg-linear-to-r ${currentSlide.accentColor} text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full animate-bounce`}>
                {currentSlide.badge}
              </span>
            </div>

            {/* Headline with icon */}
            <div className="flex items-center gap-2">
              <div className={`p-1.5 sm:p-2 rounded-lg bg-linear-to-r ${currentSlide.accentColor} text-white`}>
                {currentSlide.icon}
              </div>
              <h3 className="text-white font-bold text-base sm:text-xl md:text-2xl tracking-tight">
                {currentSlide.headline}
              </h3>
            </div>

            {/* Offer - Big and attention grabbing */}
            <p className={`text-2xl sm:text-3xl md:text-4xl font-black bg-linear-to-r ${currentSlide.accentColor} bg-clip-text text-transparent drop-shadow-lg`}>
              {currentSlide.offer}
            </p>
          </div>

          {/* CTA Button */}
          <div className="hidden sm:block">
            <a
              href={currentSlide.ctaUrl}
              className={`relative inline-flex items-center gap-2 bg-linear-to-r ${currentSlide.accentColor} text-white font-bold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <Zap className="w-4 h-4 animate-pulse" />
              {currentSlide.ctaText}
            </a>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden px-4 pb-4">
          <a
            href={currentSlide.ctaUrl}
            className={`flex items-center justify-center gap-2 w-full bg-linear-to-r ${currentSlide.accentColor} text-white font-bold text-sm py-3 rounded-lg`}
          >
            <Zap className="w-4 h-4" />
            {currentSlide.ctaText}
          </a>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? `w-6 sm:w-8 bg-linear-to-r ${currentSlide.accentColor}` 
                  : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBannerCarousel;
