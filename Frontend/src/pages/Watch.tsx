import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStreamUrl } from "../data/mockMovies";
import { Loader2, ArrowLeft } from "lucide-react";
import logo from '../../public/logo.png'

interface movieProp {
  id: string
}

const Watch = ({ id }: movieProp) => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const url = await getStreamUrl(id as string);

        if (!url) {
          setError("Stream is not available.");
          return;
        }

        setStreamUrl(url);
      } catch (err) {
        setError("Unable to load video stream.");
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">

      {/* Header */}
      {/*  */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-14 h-14 animate-spin text-primary mb-4" />
            <p className="text-gray-300">Loading your movie…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center">
            <p className="text-red-400 text-lg mb-3">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Video Player */}
        {streamUrl && (
          <div className="w-full max-w-5xl mt-4 animate-fade-in">
            <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
              <iframe
                src={streamUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-4 text-center text-gray-400">
              <p className="text-sm opacity-70">
                If the video doesn’t load, refresh the page or try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
