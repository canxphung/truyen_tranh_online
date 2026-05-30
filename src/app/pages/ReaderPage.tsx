import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  Home,
  Settings,
  Award,
  BookmarkCheck,
  Bell,
  Type,
  Coins,
  Lock,
  Crown,
  CalendarClock,
  ExternalLink,
  FileWarning,
  RefreshCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
// import { defaultDemoPanels, demoChapterPanels, demoPanelFallbackUrl, mockComics, mockChapters, mockPremiumSubscription } from '../data/mockData';
const defaultDemoPanels: string[] = [];
const demoChapterPanels: Record<string, string[]> = {};
const demoPanelFallbackUrl = 'https://placehold.co/1200x1600?text=Loading';
const mockComics: any[] = [];
const mockChapters: any[] = [];
const mockPremiumSubscription: any = {
  planName: '',
  remainingReads: 0,
  usedThisMonth: 0,
  monthlyReadLimit: 1,
  resetAt: '',
};
import { chapterApi, paymentApi, ApiError } from '../lib/api';

type PdfLoadState = 'idle' | 'loading' | 'ready' | 'needsAction' | 'failed';

const getPdfUrlProblem = (url: string) => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (parsedUrl.hostname === 'example.com') {
      return 'File đọc của chương này chưa sẵn sàng. Vui lòng quay lại sau ít phút.';
    }
  } catch {
    return 'File đọc của chương này chưa sẵn sàng. Vui lòng quay lại sau ít phút.';
  }

  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    return 'File đọc của chương này chưa sẵn sàng. Vui lòng quay lại sau ít phút.';
  }

  return '';
};

const toPdfViewerUrl = (url: string) => `${url}#toolbar=1&navpanes=0&view=FitH`;

export function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const [showUI, setShowUI] = useState(true);
  const [progress, setProgress] = useState(15);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  // Nội dung chương thật từ backend (PDF url + tiêu đề/số chương).
  const [apiChapter, setApiChapter] = useState<{ url: string | null; title: string; number: number } | null>(null);
  // Paywall khi BE từ chối chapter paid (chưa mua + chưa có sub / hết quota sub).
  const [paywall, setPaywall] = useState<{ message: string } | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [pdfLoadState, setPdfLoadState] = useState<PdfLoadState>('idle');
  const [pdfViewerKey, setPdfViewerKey] = useState(0);

  const comic: any = mockComics.find((c) => c.id === comicId) || mockComics[0] || { id: comicId ?? '', title: '', author: '', cover: '', genres: [], chapters: 0 };
  const currentChapter: any = mockChapters.find((c) => c.id === chapterId) || mockChapters[0] || { id: chapterId ?? '', title: '', number: 0, status: 'free' };
  const currentIndex = mockChapters.findIndex((c) => c.id === currentChapter.id);
  const nextChapter = mockChapters[currentIndex + 1];
  const prevChapter = currentIndex > 0 ? mockChapters[currentIndex - 1] : null;
  const isNextLocked = nextChapter?.status === 'locked' || nextChapter?.status === 'premium';
  const panelImages = demoChapterPanels[currentChapter.id] ?? defaultDemoPanels;
  const premiumRemainingAfterRead = Math.max(mockPremiumSubscription.remainingReads - 1, 0);

  useEffect(() => {
    setProgress(0);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [comicId, chapterId]);

  // Tải chương thật theo chapterId (UUID). Lỗi 400 nghĩa là chương paid và user chưa
  // có quyền (chưa mua + chưa có sub / hết quota) -> hiện paywall thay vì fallback demo.
  useEffect(() => {
    if (!chapterId) return;
    let active = true;
    setApiChapter(null);
    setPaywall(null);
    setPayError('');
    chapterApi
      .get(chapterId)
      .then((c) => {
        if (active) setApiChapter({ url: c.url, title: c.title, number: c.chapterNumber });
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 400) {
          setPaywall({ message: err.message });
        }
        // Lỗi khác (mất mạng, 401, 404...) -> giữ fallback panel demo cũ.
      });
    return () => {
      active = false;
    };
  }, [chapterId]);

  useEffect(() => {
    const pdfUrl = apiChapter?.url?.trim();
    if (!pdfUrl) {
      setPdfLoadState('idle');
      return;
    }

    const problem = getPdfUrlProblem(pdfUrl);
    if (problem) {
      setPdfLoadState('failed');
      return;
    }

    setPdfLoadState('loading');
    const timer = window.setTimeout(() => {
      setPdfLoadState((current) => (current === 'loading' ? 'needsAction' : current));
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [apiChapter?.url, pdfViewerKey]);

  const handleBuyChapter = async () => {
    if (!chapterId) return;
    setPayError('');
    setPayLoading(true);
    try {
      const { payUrl } = await paymentApi.createChapterPayment(chapterId);
      window.location.href = payUrl;
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : 'Tạo thanh toán thất bại.');
    } finally {
      setPayLoading(false);
    }
  };

  const chapterTitle = apiChapter?.title ?? currentChapter.title;
  const chapterNumber = apiChapter?.number ?? currentChapter.number;
  const pdfUrl = apiChapter?.url?.trim() || '';
  const pdfUrlProblem = pdfUrl ? getPdfUrlProblem(pdfUrl) : '';
  const pdfViewerUrl = pdfUrl && !pdfUrlProblem ? toPdfViewerUrl(pdfUrl) : '';
  const hasReadableChapter = Boolean(apiChapter || currentChapter.number > 0);
  const hasPremiumQuotaInfo = mockPremiumSubscription.resetAt || mockPremiumSubscription.remainingReads > 0;

  const mockComments = [
    { id: '1', user: 'Minh Anh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', text: 'Chương này hay quá! 🔥', likes: 23, time: '5 phút trước' },
    { id: '2', user: 'Hoàng Long', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', text: 'Plot twist cực đỉnh, không ngờ được!', likes: 18, time: '12 phút trước' },
    { id: '3', user: 'Thu Hà', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', text: 'Chờ chương sau mỏi mòn 😭', likes: 31, time: '1 giờ trước' }
  ];

  return (
    <div className="min-h-screen bg-background relative" onClick={() => setShowUI(!showUI)}>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/comic/${comicId}`} onClick={(e) => e.stopPropagation()}>
            <button className="flex items-center gap-2 text-white hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
          </Link>

          <div className="text-center">
            <h1 className="text-white font-semibold text-sm sm:text-base">{comic.title}</h1>
            <p className="text-white/60 text-xs sm:text-sm">Chương {chapterNumber}: {chapterTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setAutoSave(!autoSave); }}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${autoSave ? 'bg-success/20 border-success/40 text-success' : 'bg-white/10 border-white/20 text-white/70'}`}
            >
              <BookmarkCheck className="w-4 h-4" />
              {autoSave ? 'Đã bật lưu tiến độ' : 'Tắt lưu tiến độ'}
            </button>
            <Link to="/" onClick={(e) => e.stopPropagation()}>
              <button className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Auto-save + Premium quota status */}
      {showUI && hasReadableChapter && (
        <div className="fixed left-1/2 -translate-x-1/2 top-20 z-40 w-[min(92vw,560px)] rounded-full bg-card/90 border border-border backdrop-blur-xl text-xs text-muted-foreground shadow-lg px-4 py-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-success font-semibold">●</span> Lưu tiến độ: chương {chapterNumber || '-'}, {Math.round(progress)}%
            </div>
            {hasPremiumQuotaInfo && (
              <div className="flex flex-wrap items-center gap-2">
                {mockPremiumSubscription.remainingReads > 0 && (
                  <Badge variant="premium">Còn {mockPremiumSubscription.remainingReads} lượt Premium</Badge>
                )}
                {mockPremiumSubscription.resetAt && (
                  <span className="inline-flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Reset {mockPremiumSubscription.resetAt.split(' ')[0]}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comic Panels */}
      <div className="max-w-4xl mx-auto pt-24 pb-32">
        {/* <div className="mx-4 mb-4 rounded-2xl border border-border bg-card/90 p-4 text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">Ảnh panel demo đã được thay bằng link public ổn định</p>
              <p className="text-xs">Có thể mở trực tiếp các link dưới đây để kiểm tra ảnh.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {panelImages.slice(0, 4).map((src, index) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all text-xs"
                >
                  Panel {index + 1}
                </a>
              ))}
            </div>
          </div>
        </div> */}

        {paywall ? (
          <div className="mx-4 my-8 rounded-2xl border border-primary/30 bg-card/95 p-8 text-center space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Chương này cần mở khoá</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {paywall.message || 'Bạn chưa mua chương này hoặc gói Premium đã hết quota.'}
              </p>
            </div>
            {payError && <p className="text-sm text-error">{payError}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={handleBuyChapter} disabled={payLoading} size="lg">
                <Coins className="w-5 h-5 mr-2" />
                {payLoading ? 'Đang tạo đơn...' : 'Mua chương lẻ'}
              </Button>
              <Link to="/premium" onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" size="lg" className="w-full">
                  <Crown className="w-5 h-5 mr-2" />
                  Mua gói Premium
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-0" onClick={(e) => e.stopPropagation()}>
            {apiChapter?.url ? (
              // Nội dung chương thật là file PDF trên MinIO.
              <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
                <div className="flex flex-col gap-3 border-b border-border bg-card/95 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Chương {chapterNumber}: {chapterTitle}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {pdfLoadState === 'failed'
                        ? 'PDF chưa thể mở từ URL hiện tại.'
                        : pdfLoadState === 'ready'
                          ? 'PDF đã tải trong trình đọc.'
                          : 'Đang chuẩn bị trình đọc PDF.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!pdfUrlProblem && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setPdfViewerKey((key) => key + 1);
                          setPdfLoadState('loading');
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Tải lại
                      </Button>
                    )}
                    <a href={pdfUrl} target="_blank" rel="noreferrer">
                      <Button size="sm">
                        <ExternalLink className="w-4 h-4" />
                        Mở tab mới
                      </Button>
                    </a>
                  </div>
                </div>

                {pdfUrlProblem ? (
                  <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 bg-muted/20 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
                      <FileWarning className="h-8 w-8 text-warning" />
                    </div>
                    <div className="max-w-xl">
                      <h2 className="text-xl font-bold">Chưa mở được chương</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{pdfUrlProblem}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setPdfViewerKey((key) => key + 1);
                          setPdfLoadState('loading');
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Thử lại
                      </Button>
                      <Link to={`/comic/${comicId}`} onClick={(e) => e.stopPropagation()}>
                        <Button>Về trang truyện</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="relative min-h-[85vh] bg-muted">
                    {pdfLoadState === 'loading' && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center shadow-xl">
                          <RefreshCcw className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
                          <p className="font-semibold">Đang tải PDF...</p>
                          <p className="mt-1 text-xs text-muted-foreground">Nếu file lớn, trình đọc có thể cần vài giây.</p>
                        </div>
                      </div>
                    )}
                    {pdfLoadState === 'needsAction' && (
                      <div className="absolute left-4 right-4 top-4 z-10 rounded-xl border border-warning/30 bg-card/95 p-4 text-sm shadow-lg">
                        <p className="font-semibold text-foreground">PDF tải hơi lâu hoặc trình duyệt không hỗ trợ nhúng.</p>
                        <p className="mt-1 text-muted-foreground">Bạn vẫn có thể mở chương trong tab mới, hoặc thử tải lại khung đọc.</p>
                      </div>
                    )}
                    <object
                      key={pdfViewerKey}
                      data={pdfViewerUrl}
                      type="application/pdf"
                      className="h-[85vh] w-full bg-muted"
                      onLoad={() => setPdfLoadState('ready')}
                      onError={() => setPdfLoadState('needsAction')}
                    >
                      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
                        <FileWarning className="h-10 w-10 text-warning" />
                        <div>
                          <p className="font-semibold text-foreground">Trình duyệt không hiển thị được PDF trực tiếp.</p>
                          <p className="mt-1 text-sm">Hãy mở chương trong tab mới để đọc bằng PDF viewer của trình duyệt.</p>
                        </div>
                      </div>
                    </object>
                  </div>
                )}
              </div>
            ) : (
              panelImages.map((src, index) => (
                <div key={src} className="w-full">
                  <img
                    src={src}
                    alt={`Panel ${index + 1}`}
                    loading="lazy"
                    className="w-full h-auto bg-muted border-x border-border"
                    onLoad={() => setProgress(((index + 1) / panelImages.length) * 100)}
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.src !== demoPanelFallbackUrl) {
                        image.src = demoPanelFallbackUrl;
                      }
                    }}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* End of Chapter */}
        <div className="px-4 py-16 text-center space-y-6">
          <h2 className="text-2xl font-bold">Hết chương {currentChapter.number}</h2>
          <p className="text-muted-foreground">Bạn thích chương này? Hãy cho tác giả biết!</p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              variant={liked ? 'secondary' : 'ghost'}
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            >
              <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Đã thích' : 'Thả tim'}
            </Button>
            <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Bình luận
            </Button>
            <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
              <Share2 className="w-5 h-5 mr-2" />
              Chia sẻ
            </Button>
          </div>

          {/* Gamification Mission */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-primary/30 p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Nhiệm vụ hôm nay</h3>
                <p className="text-sm text-muted-foreground">Đọc 3 chương</p>
              </div>
              <Badge variant="success">1/3</Badge>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: '33%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Hoàn thành để nhận 10 Coin thưởng</p>
          </div>

          {nextChapter && (
            <div className="pt-8 space-y-3">
              {isNextLocked ? (
                <div className="max-w-md mx-auto bg-card border border-primary/30 rounded-2xl p-6 text-left">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Chương kế tiếp cần mở khóa</h3>
                      <p className="text-sm text-muted-foreground">Chương {nextChapter.number}: {nextChapter.title}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 mb-4">
                    <div className="flex items-center justify-between bg-muted/30 rounded-xl p-3">
                      <span className="text-sm text-muted-foreground">Mua vĩnh viễn bằng Coin</span>
                      <span className="font-bold text-primary flex items-center gap-1"><Coins className="w-4 h-4" /> {nextChapter.price ?? comic.pricePerChapter} Coin</span>
                    </div>
                    <div className="flex items-center justify-between bg-warning/10 border border-warning/30 rounded-xl p-3">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Crown className="w-4 h-4 text-warning" /> Đọc bằng Premium</span>
                      <span className="font-bold text-warning">Còn {mockPremiumSubscription.remainingReads} → {premiumRemainingAfterRead} lượt</span>
                    </div>
                  </div>
                  <Link to={`/comic/${comicId}`} onClick={(e) => e.stopPropagation()}>
                    <Button className="w-full">Chọn Coin hoặc Premium</Button>
                  </Link>
                </div>
              ) : (
                <Link to={`/read/${comicId}/${nextChapter.id}`} onClick={(e) => e.stopPropagation()}>
                  <Button size="lg">
                    Chương tiếp theo
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${showUI ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {prevChapter ? (
            <Link to={`/read/${comicId}/${prevChapter.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Chương trước
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <button className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
            <Settings className="w-5 h-5" />
          </button>

          {nextChapter && !isNextLocked ? (
            <Link to={`/read/${comicId}/${nextChapter.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost">
                Chương sau
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Reader Settings */}
      {showSettings && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 w-[min(92vw,520px)] bg-card border border-border rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold">Cài đặt đọc</h3>
            <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <button className="p-4 rounded-xl border border-border bg-muted/30 text-left hover:border-primary/40">
              <Type className="w-5 h-5 text-primary mb-2" />
              <p className="font-semibold text-sm">Cỡ chữ</p>
              <p className="text-xs text-muted-foreground">Chuẩn</p>
            </button>
            <button className="p-4 rounded-xl border border-border bg-muted/30 text-left hover:border-primary/40">
              <Bell className="w-5 h-5 text-warning mb-2" />
              <p className="font-semibold text-sm">Thông báo</p>
              <p className="text-xs text-muted-foreground">Chương mới</p>
            </button>
            <button className="p-4 rounded-xl border border-border bg-muted/30 text-left hover:border-primary/40" onClick={() => setAutoSave(!autoSave)}>
              <BookmarkCheck className="w-5 h-5 text-success mb-2" />
              <p className="font-semibold text-sm">Lưu tiến độ</p>
              <p className="text-xs text-muted-foreground">{autoSave ? 'Đang bật' : 'Đang tắt'}</p>
            </button>
          </div>
        </div>
      )}

      {/* Comments Sidebar */}
      {showComments && (
        <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border z-50 overflow-y-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Bình luận</h3>
              <button onClick={() => setShowComments(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{comment.text}</p>
                    <button className="text-xs text-muted-foreground hover:text-primary">
                      ♥ {comment.likes} thích
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 bg-card/95 backdrop-blur-xl p-4 sm:p-6 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="flex-1 px-4 py-2 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm">Gửi</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
