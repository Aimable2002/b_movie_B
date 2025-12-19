// Watch.tsx - Updated version
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useAdContext } from "@/contexts/AdContext";
import FullScreenAdModal from "@/components/ads/FullScreenAdModal";

interface movieProp {
  url: string;
}

const Watch = ({ url }: movieProp) => {
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  
  const { 
    showFullScreenAd, 
    isShowingAd, 
    currentAdType, 
    onAdComplete, 
    onAdCancel 
  } = useAdContext();

  const startVideo = async () => {
    const adShown = await showFullScreenAd('video');
    if (adShown) {
      setVideoStarted(true);
      setLoading(true);
      try {
        setStreamUrl(url);
      } catch (err) {
        setError("Unable to load video stream.");
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleAdCancel = () => {
  //   navigate(-1);
  // };

  const handleRetry = () => {
    setVideoStarted(false);
    setStreamUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-[40%] bg-[#0d0d0d] text-white flex flex-col">
      {/* Full Screen Ad Modal for video */}
      {isShowingAd && currentAdType === 'video' && (
        <FullScreenAdModal
          onComplete={onAdComplete}
          onCancel={onAdCancel}
          adTitle="Watch Video Advertisement"
          duration={10}
          showCancel={false}
        />
      )}

      {!videoStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">!</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Advertisement Required</h3>
            <p className="text-gray-400 mb-6">
              You must watch a full advertisement before the video can play.
              This supports our free service.
            </p>
            <button
              onClick={startVideo}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              disabled={isShowingAd}
            >
              {isShowingAd ? "Loading Ad..." : "Watch Ad to Play Video"}
            </button>
            <div className="text-xs text-gray-500 mt-4">
              Clicking outside or closing will cancel and go back
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-14 h-14 animate-spin text-primary mb-4" />
              <p className="text-gray-300">Loading your movie…</p>
              <p className="text-sm text-gray-400 mt-2">
                Niba video imaze iminota 2 itarafunguka. refreshinga page wongere utegereze
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-3">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Go Back
                </button>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition"
                >
                  Retry (Watch Ad Again)
                </button>
              </div>
            </div>
          ) : streamUrl ? (
            <div className="w-full max-w-5xl animate-fade-in">
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
                <iframe
                  src={streamUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title="Movie Player"
                ></iframe>
              </div>
              
              {/* Message about ads */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Want to watch another video? You'll need to watch another advertisement first.
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-3 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition"
                >
                  Watch Another (Ad Required)
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Watch;