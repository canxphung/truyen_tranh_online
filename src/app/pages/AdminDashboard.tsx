import {
  Users,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Settings,
  CreditCard,
  Star,
  BarChart3,
  SlidersHorizontal,
  UserCog,
  TrendingUp,
  Eye,
  Wallet,
  Flag
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AdminDashboard() {
  const pendingContent = [
    { id: '1', type: 'comic', title: 'Vùng Đất Quên Lãng', creator: 'An Nhiên Studio', submittedAt: '2026-05-06 08:30', chapters: 1, risk: 'Bản quyền artwork' },
    { id: '2', type: 'chapter', title: 'Long Hồn Ký - Chương 68', creator: 'Lam Comics', submittedAt: '2026-05-06 10:15', chapters: 1, risk: 'Bình thường' },
    { id: '3', type: 'comic', title: 'Ma Cảnh Kinh Thành', creator: 'Kira Nguyễn', submittedAt: '2026-05-05 22:45', chapters: 3, risk: 'Giới hạn độ tuổi' }
  ];

  const reports = [
    { id: '1', type: 'copyright', title: 'Học Viện Ánh Trăng - Chương 42', reporter: 'user_8429', reason: 'Nghi vấn vi phạm bản quyền artwork', status: 'pending', date: '2026-05-06 09:20' },
    { id: '2', type: 'content', title: 'Căn Phòng Số 17 - Chương 15', reporter: 'user_1247', reason: 'Nội dung không phù hợp độ tuổi', status: 'investigating', date: '2026-05-06 07:15' },
    { id: '3', type: 'copyright', title: 'Thành Phố Sau Cơn Mưa - Chương 8', reporter: 'user_9631', reason: 'Copy từ tác phẩm khác', status: 'resolved', date: '2026-05-05 18:30' }
  ];

  const recentTransactions = [
    { id: '1', user: 'Minh Anh', type: 'purchase', amount: 50000, coins: 550, method: 'MoMo', status: 'success', date: '2026-05-06 11:25' },
    { id: '2', user: 'Hoàng Long', type: 'spend', description: 'Mua chương', amount: 15, status: 'success', date: '2026-05-06 11:18' },
    { id: '3', user: 'Thu Hà', type: 'purchase', amount: 100000, coins: 1150, method: 'VNPay', status: 'success', date: '2026-05-06 10:55' },
    { id: '4', user: 'Đức Anh', type: 'refund', description: 'Hoàn Coin', amount: 30, status: 'pending', date: '2026-05-06 10:30' }
  ];

  const users = [
    { id: '1', name: 'Minh Anh', email: 'minh***@gmail.com', role: 'reader', joined: '2026-01-15', spent: 2500000, status: 'active' },
    { id: '2', name: 'An Nhiên Studio', email: 'an***@studio.com', role: 'creator', joined: '2025-08-20', earned: 22300000, status: 'active' },
    { id: '3', name: 'Hoàng Long', email: 'hoang***@gmail.com', role: 'reader', joined: '2026-03-10', spent: 850000, status: 'active' },
    { id: '4', name: 'Mộc Miên Team', email: 'team***@comic.vn', role: 'creator', joined: '2025-12-02', earned: 5200000, status: 'review' }
  ];

  const featuredComics = [
    { slot: 'Hero', title: 'Long Hồn Ký', reason: 'Premium conversion cao', status: 'Đang featured', until: '2026-05-12' },
    { slot: 'Trending', title: 'Học Viện Ánh Trăng', reason: 'Retention 78%', status: 'Đang featured', until: '2026-05-10' },
    { slot: 'New Creator', title: 'Vùng Đất Quên Lãng', reason: 'Chờ duyệt', status: 'Nháp', until: '-' }
  ];

  const payoutQueue = [
    { creator: 'An Nhiên Studio', amount: 15610000, method: 'Bank Transfer', status: 'Sẵn sàng duyệt' },
    { creator: 'Lam Comics', amount: 8410000, method: 'Bank Transfer', status: 'Chờ đối soát' },
    { creator: 'Kira Nguyễn', amount: 3920000, method: 'MoMo Business', status: 'Đã thanh toán' }
  ];

  const analyticsData = [
    { date: '30/4', users: 12000, revenue: 6200000 },
    { date: '1/5', users: 13200, revenue: 7100000 },
    { date: '2/5', users: 12800, revenue: 6900000 },
    { date: '3/5', users: 15600, revenue: 8800000 },
    { date: '4/5', users: 14900, revenue: 8200000 },
    { date: '5/5', users: 17100, revenue: 9400000 },
    { date: '6/5', users: 18400, revenue: 10200000 }
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-error to-warning rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Quản trị nội dung, người dùng, doanh thu và cấu hình nền tảng InkVerse</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost"><BarChart3 className="w-5 h-5 mr-2" />Xuất báo cáo</Button>
            <Link to="/admin/settings">
              <Button variant="secondary"><Settings className="w-5 h-5 mr-2" />Cấu hình hệ thống</Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Người dùng" value="125.4K" icon={Users} trend={{ value: 8.3, isPositive: true }} color="primary" />
          <StatCard title="Creator" value="2.8K" icon={BookOpen} trend={{ value: 12.1, isPositive: true }} color="secondary" />
          <StatCard title="Nội dung đang duyệt" value="15" icon={Clock} color="warning" />
          <StatCard title="Giao dịch hôm nay" value="845" icon={DollarSign} trend={{ value: 5.2, isPositive: true }} color="success" />
        </div>

        {/* Admin quick modules */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: UserCog, title: 'Quản lý người dùng', desc: 'Khóa/mở, đổi vai trò, kiểm tra lịch sử' },
            { icon: Flag, title: 'Xử lý báo cáo', desc: 'Vi phạm bản quyền, nội dung, bình luận' },
            { icon: CreditCard, title: 'Doanh thu & thanh toán', desc: 'Nạp coin, hoàn tiền, payout creator' },
            { icon: Star, title: 'Quản lý Featured', desc: 'Hero, trending, creator nổi bật' }
          ].map((item) => (
            <Card key={item.title} hover className="p-5">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Dashboard reports */}
        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Báo cáo doanh thu nền tảng</h2>
                <p className="text-sm text-muted-foreground">Theo dõi doanh thu nạp coin, premium và mua chương</p>
              </div>
              <Badge variant="success">+12.8%</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 139, 250, 0.1)" />
                <XAxis dataKey="date" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip contentStyle={{ backgroundColor: '#1a0f2e', border: '1px solid rgba(168, 139, 250, 0.3)', borderRadius: '12px', color: '#f5f3ff' }} formatter={(value: number) => value.toLocaleString()} />
                <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Thống kê người dùng hoạt động</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 139, 250, 0.1)" />
                <XAxis dataKey="date" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip contentStyle={{ backgroundColor: '#1a0f2e', border: '1px solid rgba(168, 139, 250, 0.3)', borderRadius: '12px', color: '#f5f3ff' }} />
                <Bar dataKey="users" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pending Content Review */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-warning" />
              <h2 className="text-xl font-bold">Duyệt nội dung mới</h2>
            </div>
            <Badge variant="warning">{pendingContent.length} đang chờ</Badge>
          </div>
          <div className="space-y-3">
            {pendingContent.map((item) => (
              <div key={item.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:border-warning/50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={item.type === 'comic' ? 'primary' : 'secondary'}>{item.type === 'comic' ? 'TRUYỆN MỚI' : 'CHƯƠNG MỚI'}</Badge>
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.risk === 'Bình thường' ? 'success' : 'warning'}>{item.risk}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Tác giả: {item.creator} | Gửi lúc: {item.submittedAt} | {item.chapters} chương</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="ghost" size="sm"><XCircle className="w-4 h-4 mr-2" />Từ chối</Button>
                  <Button variant="secondary" size="sm"><Eye className="w-4 h-4 mr-2" />Xem chi tiết</Button>
                  <Button size="sm"><CheckCircle className="w-4 h-4 mr-2" />Duyệt</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Copyright Reports */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-error" />
              <h2 className="text-xl font-bold">Xử lý báo cáo vi phạm</h2>
            </div>
            <Badge variant="hot">{reports.filter(r => r.status !== 'resolved').length} chưa xử lý</Badge>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{report.title}</h3>
                    <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'investigating' ? 'hot' : 'success'}>
                      {report.status === 'pending' ? 'Chờ xử lý' : report.status === 'investigating' ? 'Đang kiểm tra' : 'Đã xử lý'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Lý do:</strong> {report.reason}</p>
                  <p className="text-xs text-muted-foreground">Báo cáo bởi: {report.reporter} | {report.date}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {report.status === 'pending' && (
                    <>
                      <Button variant="secondary" size="sm">Yêu cầu bổ sung</Button>
                      <Button variant="danger" size="sm">Khóa nội dung</Button>
                      <Button size="sm">Kiểm tra</Button>
                    </>
                  )}
                  {report.status === 'investigating' && (
                    <>
                      <Button variant="danger" size="sm">Vi phạm - Xóa</Button>
                      <Button size="sm">Hợp lệ - Giữ lại</Button>
                    </>
                  )}
                  {report.status === 'resolved' && <Button variant="ghost" size="sm" disabled><CheckCircle className="w-4 h-4 mr-2" />Đã xử lý</Button>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue and payout management */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-6 h-6 text-success" />
              <h2 className="text-xl font-bold">Quản lý doanh thu & thanh toán</h2>
            </div>
            <div className="space-y-3">
              {payoutQueue.map((payout) => (
                <div key={payout.creator} className="p-4 bg-muted/30 rounded-xl border border-border flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{payout.creator}</h3>
                    <p className="text-sm text-muted-foreground">{payout.method} · {payout.amount.toLocaleString()}đ</p>
                  </div>
                  <Badge variant={payout.status === 'Đã thanh toán' ? 'success' : payout.status === 'Chờ đối soát' ? 'warning' : 'primary'}>{payout.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6">Giao dịch gần đây</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Người dùng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Loại</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Số tiền</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-4 font-semibold">{tx.user}</td>
                      <td className="py-4 px-4"><Badge variant={tx.type === 'purchase' ? 'success' : tx.type === 'refund' ? 'warning' : 'default'}>{tx.type === 'purchase' ? 'Nạp Coin' : tx.type === 'refund' ? 'Hoàn tiền' : 'Chi tiêu'}</Badge></td>
                      <td className="py-4 px-4 text-right font-semibold">{tx.type === 'purchase' ? `${tx.amount.toLocaleString()}đ` : `${tx.amount} Coin`}</td>
                      <td className="py-4 px-4 text-right"><Badge variant={tx.status === 'success' ? 'success' : 'warning'}>{tx.status === 'success' ? 'Thành công' : 'Đang xử lý'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Quản lý người dùng</h2>
            <div className="flex gap-2 flex-wrap">
              <Button variant="ghost" size="sm"><SlidersHorizontal className="w-4 h-4 mr-2" />Bộ lọc</Button>
              <Button variant="secondary" size="sm">Tạo tài khoản</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Tên</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Vai trò</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Hoạt động</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Trạng thái</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4 font-semibold">{user.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-4 px-4"><Badge variant={user.role === 'creator' ? 'primary' : 'default'}>{user.role === 'creator' ? 'Tác giả' : 'Độc giả'}</Badge></td>
                    <td className="py-4 px-4 text-right font-semibold">{user.role === 'creator' ? `+${((user as any).earned / 1000000).toFixed(1)}M đ` : `${((user as any).spent / 1000).toFixed(0)}K đ`}</td>
                    <td className="py-4 px-4 text-right"><Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status === 'active' ? 'Hoạt động' : 'Cần kiểm tra'}</Badge></td>
                    <td className="py-4 px-4 text-right"><Button size="sm" variant="ghost">Chi tiết</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Featured Management */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-warning" />
              <h2 className="text-xl font-bold">Quản lý truyện Featured</h2>
            </div>
            <Button size="sm"><TrendingUp className="w-4 h-4 mr-2" />Thêm featured</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredComics.map((comic) => (
              <div key={comic.slot} className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="premium">{comic.slot}</Badge>
                  <Badge variant={comic.status === 'Đang featured' ? 'success' : 'default'}>{comic.status}</Badge>
                </div>
                <h3 className="font-bold mb-1">{comic.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{comic.reason}</p>
                <p className="text-xs text-muted-foreground">Hiển thị đến: {comic.until}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
