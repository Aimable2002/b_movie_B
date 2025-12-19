// components/ads/FullScreenAdModal.tsx
import { useEffect, useState, useRef } from 'react';
import { X, Loader2, Clock, Check } from 'lucide-react';

interface FullScreenAdModalProps {
  onComplete: () => void;
  onCancel?: () => void;
  adTitle?: string;
  duration?: number; // seconds to watch
  showCancel?: boolean;
}

const FullScreenAdModal = ({ 
  onComplete, 
  onCancel, 
  adTitle = "Advertisement",
  duration = 15, // 15 seconds minimum watch time
  showCancel = true
}: FullScreenAdModalProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setShowSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
    };
  }, []);

  // Allow skip after duration
  useEffect(() => {
    if (showSkip) {
      skipTimeoutRef.current = setTimeout(() => {
        setShowSkip(true);
      }, 5000); // Extra 5 seconds before showing skip
    }
  }, [showSkip]);

  const handleSkip = () => {
    if (showSkip) {
      onComplete();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">{adTitle}</span>
        </div>
        
        {showCancel && (
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
            disabled={!showSkip}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Ad Container - Takes full remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Timer Display */}
        <div className="absolute top-20 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-white font-mono text-sm">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Ad Content */}
        <div className="w-full max-w-4xl h-full flex flex-col items-center justify-center">
          {/* Simulated Ad Content */}
          <div className="w-full h-[70vh] max-h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800">
            <div className="text-center p-8">
              <div className="w-64 h-48 mx-auto mb-4 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">ADVERTISEMENT</span>
              </div>
              <p className="text-gray-400 text-sm">
                This is a simulated advertisement
              </p>
              <p className="text-gray-500 text-xs mt-2">
                In production, this would show real Google AdSense ads
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center max-w-2xl">
            <p className="text-gray-300 text-sm mb-2">
              Please watch this advertisement to continue
            </p>
            <p className="text-gray-400 text-xs">
              This supports our free service. The "Continue" button will be enabled in {timeLeft} seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Footer with Continue Button */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-md mx-auto">
          {showSkip ? (
            <button
              onClick={handleSkip}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Check className="w-5 h-5" />
              Continue to Content
            </button>
          ) : (
            <div className="w-full py-3 px-4 bg-gray-800 text-gray-400 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
              <Loader2 className="w-5 h-5 animate-spin" />
              Please wait {timeLeft}s to continue...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenAdModal;