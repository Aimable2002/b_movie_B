import PromoBannerCarousel from './PromoBannerCarousel';
import SidePromoCard from './SidePromoCard';

interface AdBannerProps {
  type: 'horizontal' | 'square';
  className?: string;
}

const AdBanner = ({ type, className = '' }: AdBannerProps) => {
  if (type === 'horizontal') {
    return (
      <div className={className}>
        <PromoBannerCarousel />
      </div>
    );
  }

  return (
    <div className={className}>
      <SidePromoCard />
    </div>
  );
};

export default AdBanner;
  