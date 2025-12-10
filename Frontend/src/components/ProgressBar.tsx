import { cn } from "@/lib/utils";

interface ProgressBarProps {
  isAnimating: boolean;
  progress: number;
  className?: string;
}

const ProgressBar = ({ isAnimating, progress, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">Download Progress</span>
        <span className="text-sm font-mono text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full gradient-primary rounded-full transition-all duration-100",
            isAnimating && "animate-pulse-glow"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
