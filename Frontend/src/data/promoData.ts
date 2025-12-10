export interface PromoItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    category: 'it-service' | 'platform' | 'tech-service';
    badge: string;
    icon: string;
    gradient: string;
  }
  
  export const promoItems: PromoItem[] = [
    {
      id: '1',
      title: 'Web Development',
      subtitle: 'Custom Solutions',
      description: 'Professional websites & web apps built with modern technologies. Fast, secure, and scalable.',
      ctaText: 'Get a Quote',
      ctaUrl: '#web-dev',
      category: 'it-service',
      badge: 'IT Service',
      icon: 'code',
      gradient: 'from-cyan-500/20 to-blue-600/20',
    },
    {
      id: '2',
      title: 'Cloud Hosting',
      subtitle: '99.9% Uptime',
      description: 'Enterprise-grade hosting solutions with automatic scaling and 24/7 support.',
      ctaText: 'Start Free',
      ctaUrl: '#hosting',
      category: 'tech-service',
      badge: 'Tech Service',
      icon: 'cloud',
      gradient: 'from-violet-500/20 to-purple-600/20',
    },
    {
      id: '3',
      title: 'AgasobanuyeTimes',
      subtitle: 'Entertainment Hub',
      description: 'Your #1 destination for movies, TV shows, and entertainment news.',
      ctaText: 'Visit Now',
      ctaUrl: 'https://agasobanuyetimes.space',
      category: 'platform',
      badge: 'Platform',
      icon: 'film',
      gradient: 'from-pink-500/20 to-rose-600/20',
    },
    {
      id: '4',
      title: 'Mobile App Dev',
      subtitle: 'iOS & Android',
      description: 'Native and cross-platform mobile applications for your business needs.',
      ctaText: 'Learn More',
      ctaUrl: '#mobile',
      category: 'it-service',
      badge: 'IT Service',
      icon: 'smartphone',
      gradient: 'from-cyan-500/20 to-teal-600/20',
    },
    {
      id: '5',
      title: 'IT Consulting',
      subtitle: 'Expert Guidance',
      description: 'Strategic technology consulting to transform your business operations.',
      ctaText: 'Book Call',
      ctaUrl: '#consulting',
      category: 'tech-service',
      badge: 'Tech Service',
      icon: 'briefcase',
      gradient: 'from-amber-500/20 to-orange-600/20',
    },
    {
      id: '6',
      title: 'Cybersecurity',
      subtitle: 'Stay Protected',
      description: 'Comprehensive security audits, penetration testing, and protection solutions.',
      ctaText: 'Secure Now',
      ctaUrl: '#security',
      category: 'tech-service',
      badge: 'Tech Service',
      icon: 'shield',
      gradient: 'from-emerald-500/20 to-green-600/20',
    },
  ];
  
  export const sidePromos: PromoItem[] = [
    {
      id: 's1',
      title: 'Need a Website?',
      subtitle: 'Starting at $299',
      description: 'Professional web design & development',
      ctaText: 'Contact Us',
      ctaUrl: '#contact',
      category: 'it-service',
      badge: 'Special Offer',
      icon: 'globe',
      gradient: 'from-cyan-500/30 to-blue-600/30',
    },
    {
      id: 's2',
      title: 'Tech Support',
      subtitle: '24/7 Available',
      description: 'Remote & on-site IT support services',
      ctaText: 'Get Help',
      ctaUrl: '#support',
      category: 'tech-service',
      badge: 'Support',
      icon: 'headphones',
      gradient: 'from-violet-500/30 to-purple-600/30',
    },
  ];
  