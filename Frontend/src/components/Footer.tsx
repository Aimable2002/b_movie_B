import { Film, Mail, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Film className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground">AgasobanuyeTimes</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your #1 destination for movies, entertainment, and digital content downloads.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Movies</Link></li>
              <li><a href="https://agasobanuyetimes.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Main Website</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2">
              <li><a href="#web-dev" className="text-sm text-muted-foreground hover:text-primary transition-colors">Web Development</a></li>
              <li><a href="#mobile" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mobile Apps</a></li>
              <li><a href="#hosting" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cloud Hosting</a></li>
              <li><a href="#consulting" className="text-sm text-muted-foreground hover:text-primary transition-colors">IT Consulting</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@agasobanuyetimes.space" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> contact@agasobanuyetimes.space
                </a>
              </li>
              <li>
                <a href="https://agasobanuyetimes.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> agasobanuyetimes.space
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Live Chat Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgasobanuyeTimes.space. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 text-center sm:text-right max-w-md">
            Files hosted externally. We only provide redirection and do not host or store any files.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
