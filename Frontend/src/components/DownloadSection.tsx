import { useState, useEffect } from "react";
import { Download, X, Home, ExternalLink, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";
import { toast } from "sonner";
import { getDownloadUrl } from "../data/mockMovies";
import { useNavigate } from "react-router-dom";

interface DownloadSectionProps {
  downloadUrl: string;
  streamUrl: string;
  externalUrl: string;
  movieId: string;
  title?: string;
}

const DownloadSection = ({ externalUrl, movieId, title }: DownloadSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

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
          toast.success("Download complete!", {
            description: title || "File ready"
          });
        } else {
          setProgress(currentProgress);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isDownloading, downloadComplete, title]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);
    toast.info("Starting download...");
    
    try {
      // Get the download URL from backend
      const url = await getDownloadUrl(movieId);
      if (url) {
        // Create a temporary anchor to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = title || 'movie';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error getting download URL:", error);
      toast.error("Failed to get download URL");
    }
  };

  // const handleDirectDownload = async () => {
  //   try {
  //     const url = await getDownloadUrl(movieId);
  //     if (url) {
  //       window.open(url, '_blank');
  //       toast.success("Direct download started!", {
  //         description: title || "File downloading..."
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error getting download URL:", error);
  //     toast.error("Failed to get download URL");
  //   }
  // };


  // const handleDirectDownload = async () => {
  //   try {
  //     const downloadUrl = `/api/movie/direct/download?url=${encodeURIComponent(movieId)}`;
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.setAttribute("download", "movie.mp4");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     toast.success("Direct download started!");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to start download");
  //   }
  // };
  


  const navigate = useNavigate();

  // const handleWatchNow = () => {
  //   navigate(`/watch/${movieId}`);
  // };

  // const handleWatchNow = async () => {
  //   try {
  //     const url = await getStreamUrl(movieId);
  //     if (url) {
  //       window.open(url, '_blank');
  //       toast.info("Opening streaming player...");
  //     }
  //   } catch (error) {
  //     console.error("Error getting stream URL:", error);
  //     toast.error("Failed to get stream URL");
  //   }
  // };


  const handleCancel = () => {
    setIsDownloading(false);
    setProgress(0);
    setDownloadComplete(false);
    toast.info("Download cancelled");
  };

  const handleReturnHome = () => {
    window.location.href = externalUrl;
  };
  

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
          disabled={isDownloading}
        >
          <Download className="w-5 h-5 mr-2" />
          {isDownloading ? "Downloading..." : downloadComplete ? "Download Again" : "Download Now"}
        </Button>
        
        {/* <Button 
          variant="default" 
          size="lg" 
          className="flex-1 min-h-8"
          onClick={handleWatchNow}
          disabled={isDownloading}
        >
          <Play className="w-5 h-5 mr-2" />
          Watch Now
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
        
        <Button 
          variant="secondary" 
          size="lg" 
          className="flex-1 sm:flex-none sm:w-auto min-h-8 cursor-pointer"
          onClick={handleReturnHome}
        >
          <Home className="w-5 h-5 mr-2" />
          Return Home
        </Button>
      </div>

      {/* Alternative Download Options */}
      <div className="glass-card-subtle rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-3">Having trouble downloading? Try these options:</p>
        <div className="flex flex-wrap gap-3">
          {/* <Button 
            variant="default" 
            size="sm"
            onClick={handleDirectDownload}
          >
            Direct Download
          </Button> */}
          {/* <Button 
            variant="outline" 
            size="sm"
            onClick={handleWatchNow}
          >
            <Play className="w-4 h-4 mr-2" />
            Stream Now
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button> */}
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('https://wa.me/+250788484589')}
            disabled={isDownloading}
            className="bg-primary hover:bg-primary/90"
          >
            <Zap className="w-4 h-4 mr-2" />
            Assisted Download
          </Button>
        </div>
        <p className="text-xs text-amber-500 mt-3 flex items-center gap-1">
          <span>⚠</span> Your browser may have issues with large downloads. Use "Assisted Download" for best results.
        </p>
      </div>
    </div>
  );
};

export default DownloadSection;
