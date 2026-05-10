import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Award, BarChart3, Clock3, Flame, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { ComicCard } from '../components/comic/ComicCard';
import { categories, mockComics } from '../data/mockData';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const updateTrendingUrl = (category: string, period: string) => {
  const params = new URLSearchParams();
  if (category !== 'Tất cả') params.set('category', category);
  if (period !== '7d') params.set('period', period);
  const query = params.toString();
  window.history.replaceState(null, '', query ? `/trending?${query}` : '/trending');
};

const periodOptions = [
  { id: '24h', label: '24 giờ' },
  { id: '7d', label: '7 ngày' },
  { id: '30d', label: '30 ngày' }
];

const getTrendingScore = (comic: (typeof mockComics)[number], period: string) => {
  const statusBoost = comic.status === 'hot' ? 1.25 : comic.status === 'premium' ? 1.15 : comic.status === 'new' ? 1.1 : 1;
  const periodBoost = period === '24h' ? (comic.status === 'new' ? 1.35 : 0.92) : period === '30d' ? 1.08 : 1;
  const viewScore = comic.views / 10000;
  const ratingScore = comic.rating * 22;
  const followerScore = comic.followers / 3500;
  const chapterScore = comic.chapters * 0.8;
  return Math.round((viewScore + ratingScore + followerScore + chapterScore) * statusBoost * periodBoost);
};

export function TrendingPage() {
  const initialParams = new URLSearchParams(window.location.search);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.get('category') || 'Tất cả');
  const [period, setPeriod] = useState(initialParams.get('period') || '7d');

  const rankedComics = useMemo(() => {
    const normalizedCategory = normalizeText(selectedCategory);
    return mockComics
      .filter((comic) => selectedCategory === 'Tất cả' || comic.genres.some((genre) => normalizeText(genre) === normalizedCategory))
      .map((comic) => ({ ...comic, trendingScore: getTrendingScore(comic, period) }))
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }, [selectedCategory, period]);

  const topComic = rankedComics[0];

  const applyCategory = (category: string) => {
    setSelectedCategory(category);
    updateTrendingUrl(category, period);
  };

  const applyPeriod = (value: string) => {
    setPeriod(value);
    updateTrendingUrl(selectedCategory, value);
  };

  return (
    <div className="min-h-screen pb-16">
      <section className="border-b border-border bg-gradient-to-br from-warning/15 via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Badge variant="hot" className="mb-4 inline-flex">
            <Flame className="w-3 h-3 mr-1" /> THỊNH HÀNH
          </Badge>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bảng xếp hạng truyện đang hot</h1>
              <p className="text-muted-foreground max-w-3xl">
                Thịnh hành dùng để xem truyện đang có sức hút cao theo lượt xem, đánh giá, follower và trạng thái hot/new/premium.
                Khác với Khám phá, trang này ưu tiên thứ hạng và tín hiệu tăng trưởng.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Công thức demo</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/30 p-3"><BarChart3 className="w-4 h-4 text-primary mb-1" /> Views</div>
                <div className="rounded-xl bg-muted/30 p-3"><Star className="w-4 h-4 text-warning mb-1" /> Rating</div>
                <div className="rounded-xl bg-muted/30 p-3"><Users className="w-4 h-4 text-secondary mb-1" /> Followers</div>
                <div className="rounded-xl bg-muted/30 p-3"><Clock3 className="w-4 h-4 text-primary mb-1" /> Recency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          <aside className="bg-card border border-border rounded-2xl p-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-warning" />
                <h2 className="font-bold text-xl">Bộ lọc bảng xếp hạng</h2>
              </div>
              <p className="text-sm text-muted-foreground">Click bộ lọc chỉ cập nhật dữ liệu client-side, không reload trang.</p>
            </div>

            <div>
              <h3 className="font-bold mb-3">Khoảng thời gian</h3>
              <div className="grid grid-cols-3 gap-2">
                {periodOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => applyPeriod(option.id)}
                    className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                      period === option.id
                        ? 'bg-warning text-black border-warning'
                        : 'bg-muted/20 border-border hover:border-warning/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Danh mục</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => applyCategory(category)}
                    className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/20 border-border hover:border-primary/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-muted/30 border border-border p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Thịnh hành khác Khám phá ở đâu?</p>
              <p>Khám phá là công cụ tìm truyện. Thịnh hành là bảng xếp hạng truyện hot nhất theo tín hiệu tương tác.</p>
            </div>
          </aside>

          <main className="space-y-6">
            {topComic && (
              <Link to={`/comic/${topComic.id}`} className="block bg-card border border-warning/40 rounded-3xl p-5 hover:shadow-2xl hover:shadow-warning/10 transition-all">
                <div className="grid md:grid-cols-[180px_1fr] gap-5 items-center">
                  <div className="relative">
                    <img src={topComic.cover} alt={topComic.title} className="w-full aspect-[3/4] object-cover rounded-2xl bg-muted" />
                    <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-warning text-black font-black flex items-center justify-center shadow-lg">#1</div>
                  </div>
                  <div>
                    <Badge variant="hot" className="mb-3"><Award className="w-3 h-3 mr-1" /> Top thịnh hành</Badge>
                    <h2 className="text-3xl font-bold mb-2">{topComic.title}</h2>
                    <p className="text-muted-foreground mb-4">{topComic.description}</p>
                    <div className="grid sm:grid-cols-4 gap-3 text-sm">
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Điểm hot</p><p className="font-bold text-xl">{topComic.trendingScore}</p></div>
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Views</p><p className="font-bold">{topComic.views.toLocaleString()}</p></div>
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Rating</p><p className="font-bold">{topComic.rating}</p></div>
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Followers</p><p className="font-bold">{topComic.followers.toLocaleString()}</p></div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bảng xếp hạng · {periodOptions.find((item) => item.id === period)?.label}</p>
                <h2 className="text-2xl font-bold">{rankedComics.length} truyện đang thịnh hành{selectedCategory !== 'Tất cả' ? ` · ${selectedCategory}` : ''}</h2>
              </div>
              <Link to="/explore"><Button variant="outline">Sang Khám phá</Button></Link>
            </div>

            <div className="space-y-3">
              {rankedComics.map((comic, index) => (
                <Link key={comic.id} to={`/comic/${comic.id}`} className="bg-card border border-border rounded-2xl p-4 hover:border-warning/50 transition-all grid md:grid-cols-[70px_110px_1fr_auto] gap-4 items-center">
                  <div className="text-3xl font-black text-warning">#{index + 1}</div>
                  <img src={comic.cover} alt={comic.title} className="w-full aspect-[3/4] object-cover rounded-xl bg-muted hidden md:block" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-lg">{comic.title}</h3>
                      {comic.status === 'premium' && <Badge variant="premium">Premium</Badge>}
                      {comic.status === 'hot' && <Badge variant="hot">Hot</Badge>}
                      {comic.status === 'new' && <Badge variant="new">Mới</Badge>}
                      {comic.status === 'free' && <Badge variant="free">Free</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{comic.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {comic.genres.map((genre) => <span key={genre} className="px-2 py-1 rounded-full bg-muted/40">{genre}</span>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm md:text-right">
                    <p><span className="text-muted-foreground">Hot score</span><br /><span className="font-bold text-warning">{comic.trendingScore}</span></p>
                    <p><span className="text-muted-foreground">Views</span><br /><span className="font-semibold">{comic.views.toLocaleString()}</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
