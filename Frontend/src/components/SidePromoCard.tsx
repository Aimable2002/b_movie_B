import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import promoHosting from '@/assets/promo-hosting.jpg';

interface SidePromo {
  id: string;
  image: string;
  badge: string;
  headline: string;
  offer: string;
  ctaText: string;
  ctaUrl: string;
  countdown?: string;
}

const sidePromos: SidePromo[] = [
  {
    id: '1',
    image: promoHosting,
    badge: '🚀 BEST SELLER',
    headline: 'Launch Your Business Website Today!',
    offer: 'From RWF 5,000/month',
    ctaText: 'GET STARTED',
    ctaUrl: 'https://wa.me/+250787462384',
    countdown: '48:00:00',
  },
  {
    id: '2',
    image: promoHosting,
    badge: '💡 SPECIAL OFFER',
    headline: 'Transform Your Business with E-Commerce',
    offer: 'Only RWF 300,000!',
    ctaText: 'CLAIM NOW',
    ctaUrl: 'https://wa.me/+250787462384',
    countdown: '24:00:00',
  },
  {
    id: '3',
    image: promoHosting,
    badge: '💡 SPECIAL OFFER',
    headline: 'Custom E-Commerce App Development',
    offer: 'Only RWF 400,000',
    ctaText: 'CLAIM NOW',
    ctaUrl: 'https://wa.me/+250787462384',
    countdown: '24:00:00',
  },
];

const SidePromoCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sidePromos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentPromo = sidePromos[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Ad Card with proper height */}
      <div className="relative rounded-lg overflow-hidden min-h-[280px] sm:min-h-[300px]">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={currentPromo.image}
            alt={currentPromo.headline}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content with proper padding */}
        <div className="relative h-full p-4 sm:p-5 md:p-6 flex flex-col justify-end">
          <div className="space-y-3">
            {/* Countdown */}
            {currentPromo.countdown && (
              <div className="flex items-center gap-2 text-orange-300 bg-black/30 px-2 py-1 rounded">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold">
                  Ends in: <span className="text-white">{currentPromo.countdown}</span>
                </span>
              </div>
            )}

            {/* Headline */}
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl drop-shadow-lg">
              {currentPromo.headline}
            </h3>
            
            {/* Offer */}
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-300 drop-shadow-lg">
              {currentPromo.offer}
            </p>

            {/* Badge */}
            <div className="mb-3">
              <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded">
                {currentPromo.badge}
              </span>
            </div>

            {/* CTA Button */}
            <a
              href={currentPromo.ctaUrl}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm py-3 rounded hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              {currentPromo.ctaText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute top-4 right-4 flex gap-2">
          {sidePromos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full ${idx === currentIndex 
                ? 'w-4 bg-white' 
                : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Simple Text Ads with better spacing */}
      {/* <div className="space-y-3">
        <a 
          href="#visit"
          className="block bg-gray-900/80 border border-gray-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-0.5 rounded">AD</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-white text-sm">
            <span className="font-bold">AgasobanuyeTimes.space</span>
            <span className="mx-2 text-gray-400">•</span>
            Your #1 Entertainment Hub
          </p>
        </a>

        <a 
          href="#support"
          className="block bg-gray-900/80 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-cyan-400 text-xs font-bold bg-cyan-400/10 px-2 py-0.5 rounded">AD</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-white text-sm">
            <span className="font-bold">24/7 IT Support</span>
            <span className="mx-2 text-gray-400">•</span>
            Remote & On-site Help
          </p>
        </a>
      </div> */}
    </div>
  );
};

export default SidePromoCard;