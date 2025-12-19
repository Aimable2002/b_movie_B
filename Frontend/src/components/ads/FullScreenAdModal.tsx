import { useEffect, useState, useRef } from "react";
import { X, Loader2, Clock, Check, Zap, Code, Server, Cpu, Mail, Phone } from "lucide-react";

interface FullScreenAdModalProps {
  onComplete: () => void;
  onCancel?: () => void;
  adTitle?: string;
  duration?: number;
  showCancel?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const FullScreenAdModal = ({
  onComplete,
  onCancel,
  adTitle = "Advertisement",
  duration = 15,
  showCancel = true,
}: FullScreenAdModalProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canContinue, setCanContinue] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [containerHeight, setContainerHeight] = useState('350px');

  const timerRef = useRef<number | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adInstanceRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current && showFallback) {
        const contentHeight = contentRef.current.scrollHeight;
        const newHeight = Math.max(350, Math.min(500, contentHeight + 50));
        setContainerHeight(`${newHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [showFallback]);

  useEffect(() => {
    isMounted.current = true;
    
    timerRef.current = window.setInterval(() => {
      if (isMounted.current) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setCanContinue(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    const showFallbackAd = () => {
      if (!isMounted.current) return;
      setShowFallback(true);
      setAdLoaded(true);
    };

    const loadAdSenseAd = () => {
      const container = adContainerRef.current;
      if (!container || !isMounted.current) return;

      const useDevelopmentFallback = window.location.hostname === 'localhost' || 
                                    window.location.hostname.includes('127.0.0.1') ||
                                    !(window as any).adsbygoogle;

      if (useDevelopmentFallback) {
        setTimeout(() => {
          if (isMounted.current) {
            showFallbackAd();
          }
        }, 1000);
        return;
      }

      try {
        if ((window as any).adsbygoogle) {
          const adWrapper = document.createElement('div');
          adWrapper.id = `adsense-wrapper-${Date.now()}`;
          adWrapper.style.width = '100%';
          adWrapper.style.height = '100%';
          adWrapper.style.position = 'relative';
          adWrapper.style.minHeight = '350px';
          
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.style.width = '100%';
          adElement.style.height = '100%';
          adElement.style.overflow = 'hidden';
          adElement.style.borderRadius = '0.5rem';
          
          adElement.setAttribute('data-ad-client', 'ca-pub-6077829775020531');
          adElement.setAttribute('data-ad-slot', 'YOUR_AD_SLOT_ID');
          adElement.setAttribute('data-ad-format', 'auto');
          adElement.setAttribute('data-full-width-responsive', 'true');
          
          adWrapper.appendChild(adElement);
          container.appendChild(adWrapper);
          adInstanceRef.current = adWrapper;

          try {
            (window as any).adsbygoogle.push({});
            
            setTimeout(() => {
              if (isMounted.current) {
                const container = adContainerRef.current;
                if (container) {
                  const hasAd = container.querySelector('iframe, img, div[class*="ad"]');
                  if (!hasAd) {
                    showFallbackAd();
                  } else {
                    setAdLoaded(true);
                  }
                } else {
                  showFallbackAd();
                }
              }
            }, 3000);
          } catch (adError) {
            showFallbackAd();
          }
        } else {
          setTimeout(() => {
            if (isMounted.current) {
              showFallbackAd();
            }
          }, 1500);
        }
      } catch (error) {
        showFallbackAd();
      }
    };

    const loadTimer = setTimeout(loadAdSenseAd, 100);

    return () => {
      isMounted.current = false;
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (loadTimer) {
        clearTimeout(loadTimer);
      }
      
      if (adInstanceRef.current && adInstanceRef.current.parentNode) {
        try {
          adInstanceRef.current.parentNode.removeChild(adInstanceRef.current);
        } catch (err) {}
      }
    };
  }, []);

  const handleContinue = () => {
    if (canContinue) {
      onComplete();
    }
  };

  const handleCancel = () => {
    if (canContinue && onCancel) {
      onCancel();
    }
  };

  const ServiceAd = () => (
    <div 
      ref={contentRef}
      className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 bg-linear-to-br from-gray-900 via-blue-900/20 to-purple-900/20 overflow-y-auto"
    >
      <div className="w-full max-w-2xl">
        <div className="flex mt-[550px] flex-col md:flex-row items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative mr-4">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Powered by <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Reuble Group</span>
              </h3>
              <p className="text-sm text-gray-300 mt-1">Professional IT Solutions</p>
            </div>
          </div>
          
          <span className="inline-block bg-linear-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">
            🚀 EXPERT TEAM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-bold text-white">Web Development</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Custom websites, e-commerce, web applications with modern tech stack
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-green-500/50 transition-colors">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="font-bold text-white">Cloud Solutions</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Hosting, deployment, server management, and cloud infrastructure
            </p>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-900/30 via-purple-900/20 to-gray-900/30 rounded-xl p-5 md:p-6 mb-6 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            Get In Touch
          </h4>
          
          <div className="space-y-3">
            <a 
              href="https://wa.me/+250788484589" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white">WhatsApp</p>
                  <p className="text-sm text-gray-300">+250 788 484 589</p>
                </div>
              </div>
              <div className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>

            <a
              href="tel:+250788484589"
              className="flex items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Call Us</p>
                <p className="text-sm text-gray-300">+250 788 484 589</p>
              </div>
            </a>

            {/* <a 
              href="https://reuble.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Website</p>
                  <p className="text-sm text-gray-300">reuble.com</p>
                </div>
              </div>
              <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a> */}
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="inline-flex items-center bg-black/40 px-4 py-2 rounded-full border border-white/10">
            <span className="text-amber-300 font-bold text-lg mr-2">🔥 LIMITED OFFER:</span>
            <span className="text-white">Starting from RWF 5,000/month</span>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            This advertisement supports our free service. Contact us for custom IT solutions!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">{adTitle}</span>
        </div>

        {showCancel && (
          <button
            onClick={handleCancel}
            disabled={!canContinue}
            className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col px-4 py-4 md:py-8">
          <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700 z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-mono">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mb-6 md:mb-8">
            <div className="max-w-4xl w-full">
              <div 
                className="w-full rounded-xl border border-gray-800 overflow-hidden mb-6 md:mb-8 shadow-2xl"
                style={{ 
                  minHeight: '350px',
                  height: containerHeight,
                  maxHeight: '500px'
                }}
              >
                <div ref={adContainerRef} className="w-full h-full">
                  {!adLoaded && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-black">
                      <div className="text-center px-4">
                        <div className="relative mb-6">
                          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-300 text-lg font-medium mb-2">
                          Loading advertisement...
                        </p>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                          Please wait while we load the advertisement. 
                          This supports our free service.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {adLoaded && showFallback && <ServiceAd />}
                </div>
              </div>

              <div className="text-center max-w-md mx-auto mb-8">
                <p className="text-gray-300 text-lg font-medium mb-2">
                  Please watch this advertisement to continue
                </p>
                {!canContinue ? (
                  <p className="text-gray-400">
                    The continue button will unlock in <span className="text-amber-400 font-bold">{timeLeft}</span> seconds
                  </p>
                ) : (
                  <p className="text-green-400 font-medium">
                    ✓ You can now continue!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pb-6">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`
                  w-full flex items-center justify-center gap-3 
                  py-4 px-6 rounded-xl font-semibold text-lg 
                  transition-all duration-300 mb-4
                  ${canContinue
                    ? "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-2xl hover:shadow-green-600/40 active:scale-[0.98]"
                    : "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
                  }
                `}
              >
                {canContinue ? (
                  <>
                    <Check className="w-6 h-6" />
                    Continue to Content
                  </>
                ) : (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Waiting {timeLeft}s...
                  </>
                )}
              </button>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <p className="text-gray-400 text-sm text-center">
                  This advertisement supports our free service. 
                  {!canContinue && " Please watch it fully to continue."}
                </p>
                {canContinue && (
                  <p className="text-green-400 text-xs text-center mt-2">
                    ✓ You've completed the advertisement requirement
                  </p>
                )}
                <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                  <span className="mr-1">📢</span>
                  <span>Advertisement by {showFallback ? 'Reuble Group IT Services' : 'Google AdSense'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullScreenAdModal;