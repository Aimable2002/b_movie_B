// context/AdContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdContextType {
  adCount: number;
  incrementAdCount: () => void;
  resetAdCount: () => void;
  showFullScreenAd: (type: 'button' | 'video') => Promise<boolean>;
  isShowingAd: boolean;
  currentAdType: 'button' | 'video' | null;
  onAdComplete: () => void;
  onAdCancel: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within AdProvider');
  }
  return context;
};

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider = ({ children }: AdProviderProps) => {
  const [adCount, setAdCount] = useState(0);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [currentAdType, setCurrentAdType] = useState<'button' | 'video' | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const incrementAdCount = () => setAdCount(prev => prev + 1);
  const resetAdCount = () => setAdCount(0);

  const showFullScreenAd = (type: 'button' | 'video'): Promise<boolean> => {
    return new Promise((resolve) => {
      setCurrentAdType(type);
      setIsShowingAd(true);
      setResolvePromise(() => resolve);
    });
  };

  const onAdComplete = () => {
    setIsShowingAd(false);
    if (resolvePromise) {
      resolvePromise(true);
    }
    incrementAdCount();
    setCurrentAdType(null);
    setResolvePromise(null);
  };

  const onAdCancel = () => {
    setIsShowingAd(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
    setCurrentAdType(null);
    setResolvePromise(null);
  };

  return (
    <AdContext.Provider value={{
      adCount,
      incrementAdCount,
      resetAdCount,
      showFullScreenAd,
      isShowingAd,
      currentAdType,
      onAdComplete,
      onAdCancel
    }}>
      {children}
    </AdContext.Provider>
  );
};