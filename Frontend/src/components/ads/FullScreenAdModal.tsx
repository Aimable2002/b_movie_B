// components/ads/FullScreenAdModal.tsx - CORRECTED VERSION
import { useEffect, useState, useRef } from "react";
import { X, Loader2, Clock, Check } from "lucide-react";

interface FullScreenAdModalProps {
  onComplete: () => void;
  onCancel?: () => void;
  adTitle?: string;
  duration?: number;
  showCancel?: boolean;
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

  const timerRef = useRef<number | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);

  // Initialize AdSense ad
  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create the AdSense ad element
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.style.width = '100%';
    adElement.style.height = '100%';
    
    // Set your AdSense properties
    adElement.setAttribute('data-ad-client', 'ca-pub-6077829775020531');
    adElement.setAttribute('data-ad-slot', 'YOUR_AD_SLOT_ID'); // Replace with actual slot
    adElement.setAttribute('data-ad-format', 'auto');
    adElement.setAttribute('data-full-width-responsive', 'true');
    
    // Append to container
    container.appendChild(adElement);

    // Load the ad
    const loadAd = () => {
      try {
        // Use type assertion for adsbygoogle
        const adsbygoogle = (window as any).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
          setAdLoaded(true);
        } else {
          // Retry if AdSense not loaded yet
          setTimeout(loadAd, 100);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        // Fallback to your original design if ad fails
        container.innerHTML = `
          <div class="text-center px-4 py-6">
            <div class="w-64 h-48 mx-auto mb-6 bg-linear-to-r from-blue-900 via-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg font-bold">ADVERTISEMENT</span>
            </div>
            <p class="text-gray-400 text-sm">
              This is a simulated advertisement
            </p>
            <p class="text-gray-500 text-xs mt-2">
              In production, this will show real Google AdSense ads
            </p>
          </div>
        `;
        setAdLoaded(true);
      }
    };

    loadAd();

    // Cleanup on unmount
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleContinue = () => {
    if (canContinue) onComplete();
  };

  const handleCancel = () => {
    if (canContinue && onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black flex flex-col">
      {/* HEADER */}
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
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col px-4 py-8">
          {/* TIMER */}
          <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700 z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-mono">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* AD CONTENT AREA */}
          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            <div className="max-w-4xl w-full">
              {/* AD CONTAINER */}
              <div className="w-full h-[300px] md:h-[350px] bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden mb-8">
                <div 
                  ref={adContainerRef}
                  className="w-full h-full flex items-center justify-center"
                >
                  {/* Loading state */}
                  {!adLoaded && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-400 text-sm">Loading advertisement...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* INSTRUCTIONS */}
              <div className="hidden md:block text-center max-w-md mx-auto mb-12">
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

          {/* FOOTER */}
          <div className="mt-auto pb-8">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`
                  w-full flex items-center justify-center gap-3 
                  py-4 px-6 rounded-xl font-semibold text-lg 
                  transition-all duration-300
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
              
              {/* Additional guidance */}
              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <p className="text-gray-400 text-sm text-center">
                  This advertisement supports our free service. 
                  {!canContinue && " Please watch it fully to continue."}
                </p>
                {canContinue && (
                  <p className="text-green-400 text-xs text-center mt-2">
                    ✓ You've completed the advertisement requirement
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullScreenAdModal;