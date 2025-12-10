interface AdBannerProps {
    type: 'horizontal' | 'square';
    className?: string;
  }
  
  const AdBanner = ({ type, className = '' }: AdBannerProps) => {
    const isHorizontal = type === 'horizontal';
    
    return (
      <div 
        className={`ad-placeholder ${className} ${
          isHorizontal 
            ? 'w-full h-24 md:h-28' 
            : 'w-full h-64 md:w-72 md:h-72'
        }`}
      >
        <div className="text-center">
          <p className="text-muted-foreground/60 text-sm font-medium">Advertisement</p>
          <p className="text-muted-foreground/40 text-xs mt-1">
            {isHorizontal ? '728 x 90' : '300 x 300'}
          </p>
        </div>
      </div>
    );
  };
  
  export default AdBanner;
  