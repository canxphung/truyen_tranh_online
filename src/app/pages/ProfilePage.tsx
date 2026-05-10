import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { BookOpen, Coins, LogOut, Shield, User, CheckCircle, Clock, Bell, BookmarkCheck, Crown, ReceiptText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { demoAccounts, mockCoinPurchaseAuditTrail, mockFollowedComics, mockPremiumSubscription, mockReadingProgress, mockUnlockedChapters } from '../data/mockData';
import { clearMockSession, getMockSession, quickLogin, roleHome, roleLabel, type MockSession } from '../lib/mockAuth';

const routeByRole = {
  reader: '/',
  author: '/creator',
  admin: '/admin'
} as const;

export function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setSession(getMockSession());
  }, []);

  const logout = () => {
    clearMockSession();
    setSession(null);
    navigate('/login');
  };

  const switchRole = (role: 'reader' | 'author' | 'admin') => {
    const nextSession = quickLogin(role);
    setSession(nextSession);
  };

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Card>
          <User className="w-14 h-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Chưa đăng nhập mock</h1>
          <p className="text-muted-foreground mb-6">Hãy đăng nhập demo để kiểm tra dữ liệu theo từng vai trò.</p>
          <Link to="/login"><Button>Đăng nhập demo</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img src={session.avatar} alt={session.name} className="w-20 h-20 rounded-2xl bg-muted" />
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold">{session.name}</h1>
                  <Badge variant="primary">{roleLabel(session.role)}</Badge>
                  {session.premium && <Badge variant="premium">Premium</Badge>}
                </div>
                <p className="text-muted-foreground">{session.email}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{session.bio}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={roleHome(session.role)}><Button>Vào khu vực chức năng</Button></Link>
              <Button variant="ghost" onClick={logout}><LogOut className="w-5 h-5 mr-2" />Đăng xuất</Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <Coins className="w-6 h-6 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Coin khả dụng</p>
            <p className="text-3xl font-bold">{session.coins}</p>
          </Card>
          <Card>
            <Shield className="w-6 h-6 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Vai trò hiện tại</p>
            <p className="text-3xl font-bold">{roleLabel(session.role)}</p>
          </Card>
          <Card>
            <CheckCircle className="w-6 h-6 text-success mb-3" />
            <p className="text-sm text-muted-foreground">Quyền test</p>
            <p className="text-3xl font-bold">{session.permissions.length}</p>
          </Card>
          <Card>
            <Crown className="w-6 h-6 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Lượt Premium còn lại</p>
            <p className="text-3xl font-bold">{mockPremiumSubscription.remainingReads}</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Chuyển nhanh vai trò</h2>
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => switchRole(account.role)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${session.role === account.role ? 'border-primary bg-primary/10' : 'border-border bg-muted/20 hover:border-primary/40'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.email}</p>
                    </div>
                    <Badge variant={session.role === account.role ? 'primary' : 'default'}>{roleLabel(account.role)}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Checklist quyền của session hiện tại</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {session.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <Card className="bg-gradient-to-br from-warning/10 to-primary/10 border-warning/30">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-warning" /> Quota Premium Reader</h2>
                <p className="text-sm text-muted-foreground mt-1">Hiển thị rõ số lượt đọc còn lại khi gói Premium bị giới hạn lượt xem.</p>
              </div>
              <Badge variant="premium">{mockPremiumSubscription.planName}</Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Còn lại</p>
                <p className="text-2xl font-bold text-primary">{mockPremiumSubscription.remainingReads}</p>
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Đã dùng</p>
                <p className="text-2xl font-bold">{mockPremiumSubscription.usedThisMonth}</p>
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Giới hạn</p>
                <p className="text-2xl font-bold">{mockPremiumSubscription.monthlyReadLimit}</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-background/60 overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-primary to-warning" style={{ width: `${Math.round((mockPremiumSubscription.usedThisMonth / mockPremiumSubscription.monthlyReadLimit) * 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Reset vào {mockPremiumSubscription.resetAt}. Lần đọc Premium gần nhất: {mockPremiumSubscription.lastPremiumRead.comicTitle} chương {mockPremiumSubscription.lastPremiumRead.chapterNumber}.</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><ReceiptText className="w-5 h-5 text-primary" /> Truy vết mua Coin</h2>
                <p className="text-sm text-muted-foreground mt-1">Thông tin phục vụ đối soát giao dịch và hỗ trợ người dùng.</p>
              </div>
              <Link to="/wallet"><Button size="sm" variant="secondary">Xem ví</Button></Link>
            </div>
            <div className="space-y-3">
              {mockCoinPurchaseAuditTrail.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-xl bg-muted/30 border border-border p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-semibold text-sm">{item.orderCode}</p>
                    <Badge variant={item.status === 'success' ? 'success' : 'warning'}>{item.status === 'success' ? 'Thành công' : 'Chờ xử lý'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.paymentMethod} · {item.totalCoins} Coin · {item.amountVnd.toLocaleString()}đ</p>
                  <p className="text-xs text-muted-foreground">Số dư {item.balanceBefore} → {item.balanceAfter} · Ref: {item.providerTransactionId}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4"><BookmarkCheck className="w-5 h-5 text-primary" /><h2 className="font-bold">Tiến độ đọc mock</h2></div>
            <div className="space-y-3">
              {mockReadingProgress.map((item) => (
                <Link key={`${item.comicId}-${item.chapterId}`} to={`/read/${item.comicId}/${item.chapterId}`} className="block p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40">
                  <p className="font-semibold text-sm">{item.comicTitle}</p>
                  <p className="text-xs text-muted-foreground">Chương {item.chapterNumber} · {item.percent}%</p>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-warning" /><h2 className="font-bold">Theo dõi & thông báo</h2></div>
            <div className="space-y-3">
              {mockFollowedComics.map((item) => (
                <Link key={item.comicId} to={`/comic/${item.comicId}`} className="block p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <Badge variant={item.notify ? 'success' : 'default'}>{item.notify ? 'Bật' : 'Tắt'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.unreadChapters} chương chưa đọc</p>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-secondary" /><h2 className="font-bold">Chương đã mở khóa</h2></div>
            <div className="space-y-3">
              {mockUnlockedChapters.map((item) => (
                <Link key={`${item.comicId}-${item.chapterId}`} to={`/read/${item.comicId}/${item.chapterId}`} className="block p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.paidCoin} Coin · {item.unlockedAt}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">Đi nhanh đến luồng kiểm thử</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={routeByRole[session.role]}><Button>Trang chính của vai trò</Button></Link>
            <Link to="/wallet"><Button variant="ghost">Wallet / Coin</Button></Link>
            <Link to="/premium"><Button variant="ghost">Premium</Button></Link>
            <Link to="/demo-test"><Button variant="ghost"><Clock className="w-5 h-5 mr-2" />Checklist test</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
