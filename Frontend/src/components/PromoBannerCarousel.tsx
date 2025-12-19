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
    headline: 'Professional Website Development',
    offer: 'Starting at 100,000 RWF',
    ctaText: 'GET YOURS NOW →',
    ctaUrl: 'https://wa.me/+250787462384',
    accentColor: 'from-orange-500 to-red-500',
  },
  {
    id: '2',
    image: promoHosting,
    icon: <Server className="w-5 h-5" />,
    badge: '⚡ LIMITED TIME',
    headline: 'IT Support & Maintenance',
    offer: 'From RWF 5,000/month',
    ctaText: 'START FREE TRIAL →',
    ctaUrl: 'https://wa.me/+250787462384',
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
    ctaUrl: 'https://wa.me/+250787462384',
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
    <div className="relative rounded-lg overflow-hidden bg-black h-full min-h-[200px] sm:min-h-[220px]">
      <div className="relative h-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.headline}
            className="w-full h-full object-cover"
          />
          {/* Text overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Content with proper padding */}
        <div className="relative h-full p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Badges */}
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
                  ADVERTISEMENT
                </span>
                <span className={`bg-gradient-to-r ${currentSlide.accentColor} text-white text-xs font-bold px-3 py-1 rounded`}>
                  {currentSlide.badge}
                </span>
              </div>

              {/* Headline */}
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded bg-gradient-to-r ${currentSlide.accentColor} text-white`}>
                  {currentSlide.icon}
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl drop-shadow-lg">
                  {currentSlide.headline}
                </h3>
              </div>

              {/* Offer */}
              <p className={`text-2xl sm:text-3xl font-bold ${currentSlide.accentColor.includes('orange') ? 'text-orange-300' : 
                            currentSlide.accentColor.includes('cyan') ? 'text-cyan-300' : 
                            'text-purple-300'} drop-shadow-lg`}>
                {currentSlide.offer}
              </p>
            </div>

            {/* CTA Button */}
            <a
              href={currentSlide.ctaUrl}
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentSlide.accentColor} text-white font-bold text-sm sm:text-base px-5 sm:px-6 py-3 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap`}
            >
              <Zap className="w-4 h-4" />
              {currentSlide.ctaText}
            </a>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentIndex 
                ? 'w-6 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBannerCarousel;