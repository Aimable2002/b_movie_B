import { useState, useEffect } from 'react';
import { Film, Tv, Search, Loader2, RefreshCw } from 'lucide-react';
import { getMovies, getSeries, type Movie, type Series } from '../data/mockMovies';
import PromoBannerCarousel from '../components/PromoBannerCarousel';
import Footer from '../components/Footer';

type ContentItem =
  | (Movie & { contentType: 'Movie' })
  | (Series & { contentType: 'Series' });

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moviesData, seriesData] = await Promise.all([
        getMovies(),
        getSeries(),
      ]);

      // Sort by createdAt descending, take top 20
      const sortByDate = <T extends { createdAt?: string }>(items: T[]) =>
        [...items]
          .sort((a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          )
          .slice(0, 20);

      setMovies(sortByDate(moviesData));
      setSeries(sortByDate(seriesData));
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Merge and filter by search
  const allItems: ContentItem[] = [
    ...movies.map((m) => ({ ...m, contentType: 'Movie' as const })),
    ...series.map((s) => ({ ...s, contentType: 'Series' as const })),
  ];

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSeries = series.filter((s) =>
    (s.seriesTitle ?? s.title).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredMovies.length > 0 || filteredSeries.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Ad */}
        <div className="w-full px-4 pt-4">
          <div className="max-w-5xl mx-auto">
            <PromoBannerCarousel />
          </div>
        </div>

        {/* Header */}
        <header className="container mx-auto px-4 max-w-5xl pt-8 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Film className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl md:text-2xl text-foreground">
                  Latest Updates
                </h1>
                <p className="text-xs text-muted-foreground">
                  Top 20 newest movies &amp; series
                </p>
              </div>
            </div>

            <button
              onClick={fetchContent}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="container mx-auto px-4 max-w-5xl py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-4 max-w-5xl pb-10 flex-1">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/60" />
              <p className="text-sm">Loading latest content…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-sm text-destructive mb-3">{error}</p>
              <button
                onClick={fetchContent}
                className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition-all"
              >
                Try again
              </button>
            </div>
          )}

          {/* No results from search */}
          {!loading && !error && !hasResults && searchQuery && (
            <div className="text-center py-12 text-muted-foreground">
              <Film className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">

              {/* ── Movies ── */}
              {filteredMovies.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                      Latest Movies
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      ({filteredMovies.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredMovies.map((movie, idx) => (
                      <a
                        key={movie._id}
                        href={movie.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card flex items-center gap-3 rounded-xl border border-border/50 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        {/* Rank */}
                        <span className="shrink-0 w-6 text-center text-xs font-bold text-muted-foreground/40 group-hover:text-primary/50 transition-colors">
                          {idx + 1}
                        </span>

                        {/* Badge */}
                        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-primary/15 text-primary border-primary/20 text-xs font-medium">
                          <Film className="w-3.5 h-3.5" />
                          Movie
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug truncate">
                            {movie.title}
                          </h3>
                          {movie.fileSize && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {movie.fileSize}
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        {movie.createdAt && (
                          <span className="shrink-0 text-xs text-muted-foreground/60 hidden md:block">
                            {new Date(movie.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Series ── */}
              {filteredSeries.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Tv className="w-4 h-4 text-secondary" />
                    <h2 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                      Latest Series
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      ({filteredSeries.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredSeries.map((s, idx) => {
                      const displayTitle = s.seriesTitle ?? s.title;
                      const subtitle = [s.seasonName, s.episodeName]
                        .filter(Boolean)
                        .join(' · ');

                      return (
                        <a
                          key={s._id}
                          href={s.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card flex items-center gap-3 rounded-xl border border-border/50 p-4 hover:border-secondary/40 hover:bg-secondary/5 transition-all group"
                        >
                          {/* Rank */}
                          <span className="shrink-0 w-6 text-center text-xs font-bold text-muted-foreground/40 group-hover:text-secondary/50 transition-colors">
                            {idx + 1}
                          </span>

                          {/* Badge */}
                          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-secondary/15 text-secondary border-secondary/20 text-xs font-medium">
                            <Tv className="w-3.5 h-3.5" />
                            Series
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug truncate">
                              {displayTitle}
                            </h3>
                            {subtitle && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {subtitle}
                              </p>
                            )}
                          </div>

                          {/* Date */}
                          {s.createdAt && (
                            <span className="shrink-0 text-xs text-muted-foreground/60 hidden md:block">
                              {new Date(s.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;