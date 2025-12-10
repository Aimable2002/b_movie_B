import { Film, HardDrive } from "lucide-react";

interface MovieInfoProps {
  title: string;
  fileSize?: string;
}

const MovieInfo = ({ title, fileSize = "Unknown" }: MovieInfoProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Film className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Now Ready</p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
      
      <div className="glass-card-subtle rounded-xl p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <HardDrive className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wide">File Size</span>
        </div>
        <p className="text-lg font-semibold text-foreground">{fileSize}</p>
      </div>
    </div>
  );
};

export default MovieInfo;
