import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { Compass, Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { ComicCard } from '../components/comic/ComicCard';
import { categories, mockComics } from '../data/mockData';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const updateExploreUrl = (category: string, keyword: string, sortBy: string, statusFilter: string) => {
  const params = new URLSearchParams();
  const trimmedKeyword = keyword.trim();

  if (trimmedKeyword) params.set('q', trimmedKeyword);
  if (category !== 'Tất cả') params.set('category', category);
  if (sortBy !== 'relevant') params.set('sort', sortBy);
  if (statusFilter !== 'all') params.set('status', statusFilter);

  const query = params.toString();
  const nextUrl = query ? `/explore?${query}` : '/explore';
  window.history.replaceState(null, '', nextUrl);
};

const sortOptions = [
  { id: 'relevant', label: 'Phù hợp nhất' },
  { id: 'views', label: 'Lượt xem cao' },
  { id: 'rating', label: 'Đánh giá cao' },
  { id: 'chapters', label: 'Nhiều chương' },
  { id: 'new', label: 'Mới cập nhật' }
];

const statusOptions = [
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'free', label: 'Miễn phí' },
  { id: 'premium', label: 'Premium' },
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'Mới' }
];

export function ExplorePage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryFromRoute = params.categoryName ? decodeURIComponent(params.categoryName) : '';
  const initialCategory = categoryFromRoute || searchParams.get('category') || 'Tất cả';
  const initialSearch = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'relevant';
  const initialStatus = searchParams.get('status') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSearchTerm(initialSearch);
    setSortBy(initialSort);
    setStatusFilter(initialStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, params.categoryName]);

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = category === 'Tất cả'
        ? mockComics.length
        : mockComics.filter((comic) => comic.genres.some((genre) => normalizeText(genre) === normalizeText(category))).length;
      return acc;
    }, {});
  }, []);

  const filteredComics = useMemo(() => {
    const normalizedCategory = normalizeText(selectedCategory);
    const keyword = normalizeText(searchTerm);

    const result = mockComics.filter((comic) => {
      const matchCategory = selectedCategory === 'Tất cả' || comic.genres.some((genre) => normalizeText(genre) === normalizedCategory);
      const searchableText = normalizeText([
        comic.title,
        comic.author,
        comic.description,
        ...comic.genres
      ].join(' '));
      const matchSearch = !keyword || searchableText.includes(keyword);
      const matchStatus = statusFilter === 'all' || comic.status === statusFilter;
      return matchCategory && matchSearch && matchStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'chapters') return b.chapters - a.chapters;
      if (sortBy === 'new') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [selectedCategory, searchTerm, sortBy, statusFilter]);

  const applyCategory = (category: string) => {
    setSelectedCategory(category);
    updateExploreUrl(category, searchTerm, sortBy, statusFilter);
  };

  const applySearch = (value: string) => {
    setSearchTerm(value);
    updateExploreUrl(selectedCategory, value, sortBy, statusFilter);
  };

  const applySort = (value: string) => {
    setSortBy(value);
    updateExploreUrl(selectedCategory, searchTerm, value, statusFilter);
  };

  const applyStatus = (value: string) => {
    setStatusFilter(value);
    updateExploreUrl(selectedCategory, searchTerm, sortBy, value);
  };

  const clearFilters = () => {
    setSelectedCategory('Tất cả');
    setSearchTerm('');
    setSortBy('relevant');
    setStatusFilter('all');
    window.history.replaceState(null, '', '/explore');
  };

  return (
    <div className="min-h-screen pb-16">
      <section className="border-b border-border bg-gradient-to-br from-primary/15 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Badge variant="primary" className="mb-4 inline-flex">
            <Compass className="w-3 h-3 mr-1" /> KHÁM PHÁ
          </Badge>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám phá toàn bộ kho truyện</h1>
              <p className="text-muted-foreground max-w-3xl">
                Khám phá dùng để tìm, lọc và sắp xếp toàn bộ thư viện truyện theo danh mục, trạng thái, lượt xem hoặc đánh giá.
                Khác với Thịnh hành, trang này ưu tiên khả năng tìm đúng truyện theo nhu cầu của độc giả.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-2">Khác nhau nhanh</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="text-foreground font-semibold">Khám phá:</span> tìm/lọc toàn bộ kho truyện.</p>
                <p><span className="text-foreground font-semibold">Thịnh hành:</span> bảng xếp hạng truyện đang hot.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <aside className="bg-card rounded-2xl border border-border p-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Bộ lọc tìm kiếm</h2>
              </div>
              <SearchBar value={searchTerm} onSearch={applySearch} placeholder="Tìm truyện, tác giả, thể loại..." />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Danh mục</h3>
              </div>
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
                    {category} <span className="opacity-70">({categoryCounts[category] || 0})</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Click danh mục chỉ lọc dữ liệu trên client, không tải lại trang.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Trạng thái</h3>
              </div>
              <div className="grid gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => applyStatus(option.id)}
                    className={`px-3 py-2 rounded-xl border text-sm text-left transition-all ${
                      statusFilter === option.id
                        ? 'bg-secondary text-secondary-foreground border-secondary'
                        : 'bg-muted/20 border-border hover:border-secondary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kết quả khám phá</p>
                <h2 className="text-2xl font-bold">
                  {filteredComics.length} truyện phù hợp
                  {selectedCategory !== 'Tất cả' ? ` · ${selectedCategory}` : ''}
                </h2>
                {(searchTerm || selectedCategory !== 'Tất cả' || statusFilter !== 'all' || sortBy !== 'relevant') && (
                  <button type="button" onClick={clearFilters} className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1">
                    <X className="w-4 h-4" /> Xóa toàn bộ bộ lọc
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={sortBy === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applySort(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredComics.map((comic) => (
                <ComicCard key={comic.id} {...comic} />
              ))}
            </div>

            {filteredComics.length === 0 && (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <h3 className="font-bold text-lg mb-2">Không tìm thấy truyện phù hợp</h3>
                <p className="text-muted-foreground mb-4">Hãy thử bỏ bớt bộ lọc hoặc dùng từ khóa rộng hơn.</p>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}
          </main>
        </section>

        <section className="bg-muted/20 border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">Muốn xem bảng xếp hạng?</h3>
            <p className="text-sm text-muted-foreground">Chuyển sang Thịnh hành để xem truyện đang tăng trưởng tốt nhất.</p>
          </div>
          <Link to="/trending"><Button>Đi tới Thịnh hành</Button></Link>
        </section>
      </div>
    </div>
  );
}
