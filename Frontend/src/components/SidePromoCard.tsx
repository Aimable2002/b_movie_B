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
    headline: 'CLOUD HOSTING',
    offer: 'From $5/mo',
    ctaText: 'GET STARTED',
    ctaUrl: 'https://wa.me/0787462384',
    countdown: '48:00:00',
  },
  {
    id: '2',
    image: promoHosting,
    badge: '💡 SPECIAL OFFER',
    headline: 'WEBSITE DESIGN',
    offer: 'Only $299!',
    ctaText: 'CLAIM NOW',
    ctaUrl: 'https://wa.me/0787462384',
    countdown: '24:00:00',
  },
];

const SidePromoCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sidePromos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentPromo = sidePromos[currentIndex];

  return (
    <div className="space-y-3">
      {/* Main Ad Card */}
      <div 
        className="relative rounded-xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated border */}
        <div className="absolute -inset-[2px] bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity animate-pulse" />
        
        <div className="relative bg-black rounded-xl overflow-hidden">
          {/* Image */}
          <div className="relative">
            <img
              src={currentPromo.image}
              alt={currentPromo.headline}
              className="w-full h-32 sm:h-40 object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Floating badge */}
          {/* <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <span className="bg-black/60 backdrop-blur-sm text-white/70 text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded border border-white/10">
              SPONSORED
            </span>
            <span className="bg-linear-to-r from-yellow-500 to-orange-500 text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
              {currentPromo.badge}
            </span>
          </div> */}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-2">
            {/* Countdown timer */}
            {currentPromo.countdown && (
              <div className="flex items-center gap-1.5 text-orange-400">
                <Clock className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono font-bold">
                  Ends in: {currentPromo.countdown}
                </span>
              </div>
            )}

            <p className="text-white/80 text-[10px] sm:text-xs font-semibold tracking-widest">
              {currentPromo.headline}
            </p>
            
            <p className="text-xl sm:text-2xl md:text-3xl font-black bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {currentPromo.offer}
            </p>

            <a
              href={currentPromo.ctaUrl}
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30"
            >
              <Sparkles className="w-4 h-4" />
              {currentPromo.ctaText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Dots */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
            {sidePromos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-4 bg-linear-to-r from-yellow-400 to-orange-500' 
                    : 'w-1 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Link Ads */}
      <div className="hidden sm:flex flex-col gap-2">
        <a 
          href="#visit"
          className="group relative overflow-hidden rounded-lg border border-yellow-500/30 bg-linear-to-r from-yellow-500/10 to-orange-500/10 p-3 hover:border-yellow-500/60 transition-all"
        >
          <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
            AD
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-yellow-500 font-bold">AgasobanuyeTimes.space</span>
            <span className="mx-1">•</span>
            Your #1 Entertainment Hub
            <ArrowRight className="inline w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </p>
        </a>

        <a 
          href="#support"
          className="group relative overflow-hidden rounded-lg border border-cyan-500/30 bg-linear-to-r from-cyan-500/10 to-blue-500/10 p-3 hover:border-cyan-500/60 transition-all"
        >
          <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-400 text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
            AD
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-cyan-400 font-bold">24/7 IT Support</span>
            <span className="mx-1">•</span>
            Remote & On-site Help
            <ArrowRight className="inline w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </p>
        </a>
      </div>
    </div>
  );
};

export default SidePromoCard;
