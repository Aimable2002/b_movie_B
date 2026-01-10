// DownloadSection.tsx - Updated version
import { useState, useEffect } from "react";
import { Download, X, Zap, Play} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";
import { toast } from "sonner";
import { getDownloadUrl } from "../data/mockMovies";
// import { useNavigate } from "react-router-dom";
import { useAdContext } from "@/contexts/AdContext";
import FullScreenAdModal from "@/components/ads/FullScreenAdModal";

interface DownloadSectionProps {
  downloadUrl: string;
  streamUrl: string;
  externalUrl: string;
  movieId: string;
  title?: string;
}

const DownloadSection = ({ externalUrl, movieId, title}: DownloadSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [buttonAdCount, setButtonAdCount] = useState(0);
  // const navigate = useNavigate()
  // const navigate = useNavigate();
  
  const { 
    showFullScreenAd, 
    isShowingAd, 
    currentAdType, 
    onAdComplete, 
    onAdCancel,
  } = useAdContext();

  useEffect(() => {
    if (isDownloading && !downloadComplete) {
      const duration = 2000;
      const interval = 50;
      const steps = duration / interval;
      const increment = 100 / steps;
      
      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(timer);
          setDownloadComplete(true);
          toast.success("Download complete!");
        } else {
          setProgress(currentProgress);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isDownloading, downloadComplete]);

  const handleDownload = async () => {
    // Show 3 ads before download
    if (buttonAdCount < 3) {
      const adShown = await showFullScreenAd('button');
      if (adShown) {
        setButtonAdCount(prev => prev + 1);
        if (buttonAdCount + 1 === 3) {
          // After 3 ads, start download
          startDownload();
        } else {
          toast.info(`Watch ${3 - (buttonAdCount + 1)} more ads to download`);
        }
      }
    } else {
      startDownload();
    }
  };

  const startDownload = async () => {
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);
    
    try {
      const url = await getDownloadUrl(movieId);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = title || 'movie';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info("Download started!");
      }
    } catch (error) {
      console.error("Error getting download URL:", error);
      toast.error("Failed to get download URL");
    }
  };

  // const handleWatchNow = async () => {
  //   // Show 1 ad for video
  //   const adShown = await showFullScreenAd('video');
  //   if (adShown) {
  //     navigate(`/watch/${movieId}`);
  //   } else {
  //     toast.info("Please complete the ad to watch");
  //   }
  // };

  const handleAssistedDownload = async () => {
    // Show 3 ads for assisted download
    if (buttonAdCount < 3) {
      const adShown = await showFullScreenAd('button');
      if (adShown) {
        setButtonAdCount(prev => prev + 1);
        if (buttonAdCount + 1 === 3) {
          window.open('https://wa.me/+250788484589', '_blank');
        } else {
          toast.info(`Watch ${3 - (buttonAdCount + 1)} more ads for assistance`);
        }
      }
    } else {
      window.open('https://wa.me/+250788484589', '_blank');
    }
  };

  const handleCancel = () => {
    setIsDownloading(false);
    setProgress(0);
    setDownloadComplete(false);
    toast.info("Download cancelled");
  };

  const handleOpenExternal = async () => {
    // Show 3 ads for external link
    if (buttonAdCount < 3) {
      const adShown = await showFullScreenAd('button');
      if (adShown) {
        setButtonAdCount(prev => prev + 1);
        if (buttonAdCount + 1 === 3) {
          window.open(externalUrl, '_blank');
        } else {
          toast.info(`Watch ${3 - (buttonAdCount + 1)} more ads to open`);
        }
      }
    } else {
      window.open(externalUrl, '_blank');
    }
  };

  return (
    <>
      {/* Full Screen Ad Modal */}
      {isShowingAd && (
        <FullScreenAdModal
          onComplete={onAdComplete}
          onCancel={onAdCancel}
          adTitle={
            currentAdType === 'video' ? "Watch Video" : "Advertisement"
          }
          duration={currentAdType === 'video' ? 10 : 15}
          showCancel={false}
        />
      )}

      <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
        {/* Ad Counter Display */}
        <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Ads watched for buttons:</span>
            <span className="text-lg font-bold text-white">
              {buttonAdCount}/3
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(buttonAdCount / 3) * 100}%` }}
            />
          </div>
          {buttonAdCount < 3 && (
            <p className="text-xs text-amber-400 mt-1">
              Click any button to watch ads ({3 - buttonAdCount} more needed)
            </p>
          )}
        </div>

        <ProgressBar 
          isAnimating={isDownloading} 
          progress={progress} 
          className="mb-6"
        />
        
        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button 
            variant="default" 
            size="lg"
            className="flex-1 min-h-8 cursor-pointer"
            onClick={handleDownload}
            disabled={isDownloading || isShowingAd}
          >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? "Downloading..." : `Download Now (${3 - buttonAdCount} ads)`}
          </Button>
          
          {/* <Button 
            variant="secondary" 
            size="lg"
            className="flex-1 min-h-8 cursor-pointer"
            onClick={() => navigate(`/watch/${streamUrl}`)}
            // disabled={isShowingAd}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Now (1 ad)
          </Button> */}
          
          <Button 
            variant="outline" 
            size="lg"
            className="flex-1 sm:flex-none sm:w-auto min-h-8 cursor-pointer"
            onClick={handleCancel}
            disabled={!isDownloading}
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Alternative Options */}
        <div className="glass-card-subtle rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Alternative options (3 ads required for each):
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={handleAssistedDownload}
              disabled={isShowingAd}
            >
              <Zap className="w-4 h-4 mr-2" />
              Assisted Download ({3 - buttonAdCount} ads)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenExternal}
              disabled={isShowingAd}
            >
              Open Original ({3 - buttonAdCount} ads)
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-600 font-medium">
              ⚠ Important: Each button requires watching {buttonAdCount < 3 ? '3' : 'no more'} advertisements.
              The "Cancel" button is the only free action.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadSection;