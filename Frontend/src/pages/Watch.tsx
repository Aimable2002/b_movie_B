// // Watch.tsx
// import {  useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Loader2, AlertCircle, Play } from "lucide-react";
// import { useAdContext } from "@/contexts/AdContext";
// import FullScreenAdModal from "@/components/ads/FullScreenAdModal";
// import { Button } from "@/components/ui/button";

// interface movieProp {
//   url: string;
// }

// const Watch = ({ url }: movieProp) => {
//   const navigate = useNavigate();
//   const [streamUrl, setStreamUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [videoStarted, setVideoStarted] = useState(false);
  
//   const { 
//     showFullScreenAd, 
//     isShowingAd, 
//     currentAdType, 
//     onAdComplete, 
//   } = useAdContext();

//   const startVideo = async () => {
//     const adShown = await showFullScreenAd('video');
//     if (adShown) {
//       setVideoStarted(true);
//       setLoading(true);
//       try {
//         setStreamUrl(url);
//       } catch (err) {
//         setError("Unable to load video stream.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleAdCancel = () => {
//     navigate(-1);
//   };

//   const handleRetry = () => {
//     setVideoStarted(false);
//     setStreamUrl(null);
//     setError(null);
//   };

//   return (
//     <div className="min-h-[40%] bg-[#0d0d0d] text-white flex flex-col">
//       {/* Full Screen Ad Modal for video - ONLY shows when triggered */}
//       {isShowingAd && currentAdType === 'video' && (
//         <FullScreenAdModal
//           onComplete={onAdComplete}
//           onCancel={handleAdCancel}
//           adTitle="Watch Video Advertisement"
//           duration={10}
//           showCancel={false}
//         />
//       )}

//       {!videoStarted ? (
//         // SHOW VIDEO PREVIEW WITH "WATCH NOW" BUTTON
//         <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
//           <div className="text-center max-w-md">
//             <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 flex items-center justify-center">
//               <Play className="w-16 h-16 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-bold mb-4">Ready to Watch?</h3>
//             <p className="text-gray-400 mb-6">
//               Click "Watch Now" to view this video. One advertisement is required to support our free service.
//             </p>
//             <Button
//               onClick={startVideo}
//               className="px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
//               disabled={isShowingAd}
//               size="lg"
//             >
//               {isShowingAd ? "Loading Ad..." : "Watch Now (1 Ad Required)"}
//             </Button>
//             <div className="text-xs text-gray-500 mt-4">
//               The ad will play before the video starts
//             </div>
//           </div>
//         </div>
//       ) : (
//         // SHOW VIDEO AFTER AD IS COMPLETE
//         <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
//           {loading ? (
//             <div className="flex flex-col items-center">
//               <Loader2 className="w-14 h-14 animate-spin text-primary mb-4" />
//               <p className="text-gray-300">Loading your movie…</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 Niba video imaze iminota 2 itarafunguka. refreshinga page wongere utegereze
//               </p>
//             </div>
//           ) : error ? (
//             <div className="text-center">
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <p className="text-red-400 text-lg mb-3">{error}</p>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={() => navigate(-1)}
//                   variant="outline"
//                   className="px-4 py-2"
//                 >
//                   Go Back
//                 </Button>
//                 <Button
//                   onClick={handleRetry}
//                   className="px-4 py-2"
//                 >
//                   Retry (Watch Ad Again)
//                 </Button>
//               </div>
//             </div>
//           ) : streamUrl ? (
//             <div className="w-full max-w-5xl animate-fade-in">
//               <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
//                 <iframe
//                   src={streamUrl}
//                   className="w-full h-full"
//                   allow="autoplay; encrypted-media; fullscreen"
//                   allowFullScreen
//                   title="Movie Player"
//                 ></iframe>
//               </div>
              
//               {/* Message about ads */}
//               <div className="mt-6 text-center">
//                 <p className="text-gray-400 text-sm">
//                   Want to watch another video? You'll need to watch another advertisement first.
//                 </p>
//                 <Button
//                   onClick={handleRetry}
//                   variant="outline"
//                   className="mt-3"
//                 >
//                   Watch Another (Ad Required)
//                 </Button>
//               </div>
//             </div>
//           ) : null}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Watch;













// Watch.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface movieProp {
  url: string;
}

const Watch = ({ url }: movieProp) => {
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start loading the video immediately when component mounts
    const loadVideo = async () => {
      setLoading(true);
      try {
        setStreamUrl(url);
      } catch (err) {
        setError("Unable to load video stream.");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [url]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    try {
      setStreamUrl(url);
    } catch (err) {
      setError("Unable to load video stream.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[40%] bg-[#0d0d0d] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-14 h-14 animate-spin text-primary mb-4" />
            <p className="text-gray-300">Loading video…</p>
            <p className="text-sm text-gray-400 mt-2">
              If video takes more than 2 minutes, refresh the page and wait
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 text-lg mb-3">{error}</p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="px-4 py-2"
              >
                Go Back
              </Button>
              <Button
                onClick={handleRetry}
                className="px-4 py-2"
              >
                Retry
              </Button>
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
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Watch;