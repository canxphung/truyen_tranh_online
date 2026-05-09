import { useParams, Link } from 'react-router';
import { Star, Eye, Heart, Share2, BookOpen, Users, ChevronLeft, Bell, Bookmark, Coins } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { ChapterRow } from '../components/comic/ChapterRow';
import { ComicCard } from '../components/comic/ComicCard';
import { EnhancedComments } from '../components/comic/EnhancedComments';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { mockComics, mockChapters } from '../data/mockData';
import { getMockSession } from '../lib/mockAuth';
import { useEffect, useState } from 'react';

export function ComicDetailPage() {
  const { id } = useParams();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifyNewChapter, setNotifyNewChapter] = useState(true);
  const [coinBalance, setCoinBalance] = useState(550);

  useEffect(() => {
    const session = getMockSession();
    if (session) setCoinBalance(session.coins);
  }, []);
  const savedProgress = { chapter: 4, percent: 62, updatedAt: '2 giờ trước' };

  const comic = mockComics.find((c) => c.id === id) || mockComics[0];
  const similarComics = mockComics.filter((c) => c.id !== id).slice(0, 4);

  const handleChapterClick = (chapter: any) => {
    if (chapter.status === 'locked' || chapter.status === 'premium') {
      setSelectedChapter(chapter);
      setShowPurchaseModal(true);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Comic Info */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <ImageWithFallback src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
              {comic.status && (
                <div className="absolute top-4 right-4">
                  <Badge variant={comic.status}>{comic.status.toUpperCase()}</Badge>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{comic.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{comic.author}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {comic.genres.map((genre) => (
                  <Badge key={genre} variant="default">{genre}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{comic.rating}</span>
                  <span className="text-muted-foreground">(12.5K đánh giá)</span>
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{(comic.views / 1000000).toFixed(1)}M</span>
                  <span className="text-muted-foreground">lượt đọc</span>
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{(comic.followers / 1000).toFixed(0)}K</span>
                  <span className="text-muted-foreground">theo dõi</span>
                </span>
              </div>
            </div>

            <p className="text-foreground leading-relaxed">{comic.description}</p>

            <div className="flex flex-wrap gap-4">
              <Link to={`/read/${comic.id}/1`}>
                <Button size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Đọc chương đầu
                </Button>
              </Link>
              <Button variant={isFollowing ? 'secondary' : 'ghost'} size="lg" onClick={() => setIsFollowing(!isFollowing)}>
                <Heart className={`w-5 h-5 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Chia sẻ
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Bookmark className="w-4 h-4 text-primary" /> Tiến độ đọc đã lưu</h3>
                    <p className="text-sm text-muted-foreground mt-1">Đọc tiếp từ chương {savedProgress.chapter} · {savedProgress.updatedAt}</p>
                  </div>
                  <Badge variant="owned">{savedProgress.percent}%</Badge>
                </div>
                <div className="h-2 bg-background/60 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${savedProgress.percent}%` }} />
                </div>
                <Link to={`/read/${comic.id}/${savedProgress.chapter}`}>
                  <Button variant="secondary" size="sm">Đọc tiếp</Button>
                </Link>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h3 className="font-semibold flex items-center gap-2 mb-3"><Bell className="w-4 h-4 text-warning" /> Theo dõi & thông báo</h3>
                <p className="text-sm text-muted-foreground mb-4">Nhận thông báo khi có chương mới, phản hồi bình luận hoặc ưu đãi mua chương.</p>
                <button
                  onClick={() => setNotifyNewChapter(!notifyNewChapter)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-left ${notifyNewChapter ? 'border-primary/40 bg-primary/10' : 'border-border bg-background/40'}`}
                >
                  <span className="font-semibold">{notifyNewChapter ? 'Đang bật thông báo chương mới' : 'Thông báo chương mới đang tắt'}</span>
                  <span className="block text-xs text-muted-foreground mt-1">Có thể kết nối với email, push notification hoặc in-app notification.</span>
                </button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-2">Thông tin</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng chương:</span>
                  <span className="font-semibold">{comic.chapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá mỗi chương:</span>
                  <span className="font-semibold text-primary">{comic.pricePerChapter} Coin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant="success">Đang cập nhật</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh sách chương</h2>
            <span className="text-sm text-muted-foreground">{mockChapters.length} chương</span>
          </div>
          <div className="space-y-3">
            {mockChapters.map((chapter) => (
              <div key={chapter.id} onClick={() => handleChapterClick(chapter)}>
                <ChapterRow {...chapter} comicId={comic.id} />
              </div>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="mb-12">
          <EnhancedComments comicId={comic.id} />
        </section>

        {/* Similar Comics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Truyện tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarComics.map((comic) => (
              <ComicCard key={comic.id} {...comic} />
            ))}
          </div>
        </section>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedChapter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPurchaseModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Mua chương</h3>
              <Badge variant="primary"><Coins className="w-3 h-3 mr-1" /> {coinBalance} Coin</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Bạn cần mua chương này để đọc. Sau khi mua, bạn có thể đọc chương này vĩnh viễn.
            </p>
            <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span>Chương {selectedChapter.number}</span>
                <span className="font-semibold">{selectedChapter.title}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Giá:</span>
                <span className="font-bold text-primary">{selectedChapter.price} Coin</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowPurchaseModal(false)}>
                Hủy
              </Button>
              <Link to={`/read/${comic.id}/${selectedChapter.id}`} className="flex-1">
                <Button className="w-full">
                  Xác nhận mua bằng Coin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
