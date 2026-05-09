import {
  DollarSign,
  Eye,
  ShoppingCart,
  Users,
  Upload,
  Plus,
  AlertCircle,
  BarChart3,
  BookOpen,
  FileText,
  MessageCircle,
  ShieldAlert,
  Wallet,
  PencilLine,
  Reply,
  Clock,
  CheckCircle,
  Send
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function CreatorDashboard() {
  const revenueData = [
    { date: '30/4', revenue: 450000, views: 82000 },
    { date: '1/5', revenue: 520000, views: 91000 },
    { date: '2/5', revenue: 380000, views: 76000 },
    { date: '3/5', revenue: 680000, views: 128000 },
    { date: '4/5', revenue: 590000, views: 110000 },
    { date: '5/5', revenue: 750000, views: 146000 },
    { date: '6/5', revenue: 820000, views: 158000 }
  ];

  const myComics = [
    { id: '1', title: 'Học Viện Ánh Trăng', status: 'published', chapters: 45, revenue: 12500000, views: 1250000, purchases: 8500, price: 15, pending: 0 },
    { id: '2', title: 'Người Gác Cổng Linh Giới', status: 'published', chapters: 38, revenue: 9800000, views: 1450000, purchases: 6200, price: 15, pending: 1 },
    { id: '3', title: 'Vùng Đất Quên Lãng', status: 'pending', chapters: 5, revenue: 0, views: 0, purchases: 0, price: 20, pending: 5 }
  ];

  const chapterPerformance = [
    { chapter: 'Chương 45', views: 125000, purchases: 850, revenue: 12750000, dropOff: '12%' },
    { chapter: 'Chương 44', views: 132000, purchases: 920, revenue: 13800000, dropOff: '10%' },
    { chapter: 'Chương 43', views: 145000, purchases: 1050, revenue: 15750000, dropOff: '8%' },
    { chapter: 'Chương 42', views: 138000, purchases: 980, revenue: 14700000, dropOff: '11%' }
  ];

  const drafts = [
    { title: 'Chương 46: Cánh cửa bạc', comic: 'Học Viện Ánh Trăng', status: 'Bản nháp', updated: '10 phút trước' },
    { title: 'Chương 6: Bản đồ cổ', comic: 'Vùng Đất Quên Lãng', status: 'Đang duyệt', updated: '2 giờ trước' }
  ];

  const blogPosts = [
    { title: 'Hậu trường tạo hình nhân vật Luna', status: 'Đã đăng', views: '12.4K', comments: 86 },
    { title: 'Nhật ký tác giả: Vì sao arc mới tối hơn?', status: 'Bản nháp', views: '-', comments: 0 }
  ];

  const commentInbox = [
    { reader: 'Minh Anh', comic: 'Học Viện Ánh Trăng', comment: 'Chương này có twist rất hay, tác giả ra chương mới nhanh nha!', time: '5 phút trước' },
    { reader: 'Hoàng Long', comic: 'Người Gác Cổng Linh Giới', comment: 'Mình muốn biết thêm về bối cảnh linh giới.', time: '1 giờ trước' },
    { reader: 'Thu Hà', comic: 'Học Viện Ánh Trăng', comment: 'Panel cuối đẹp quá!', time: '3 giờ trước' }
  ];

  const payoutHistory = [
    { period: 'Tháng 05/2026', gross: 22300000, platformFee: 6690000, net: 15610000, status: 'Sẵn sàng rút' },
    { period: 'Tháng 04/2026', gross: 18400000, platformFee: 5520000, net: 12880000, status: 'Đã thanh toán' }
  ];

  const copyrightReports = [
    { title: 'Website reup Chương 41', proof: '3 ảnh chụp + link nguồn', status: 'Đang xử lý' },
    { title: 'Tài khoản sao chép artwork', proof: 'So sánh panel', status: 'Cần bổ sung bằng chứng' }
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Quản lý tác phẩm, upload chương, tương tác độc giả và theo dõi doanh thu</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost">
              <PencilLine className="w-5 h-5 mr-2" />
              Viết blog
            </Button>
            <Button variant="secondary">
              <Upload className="w-5 h-5 mr-2" />
              Upload chương
            </Button>
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Đăng truyện mới
            </Button>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">1 chương đang chờ duyệt bản quyền</p>
            <p className="text-sm text-muted-foreground mt-1">
              Chương 5 của "Vùng Đất Quên Lãng" đang được kiểm tra. Thời gian duyệt dự kiến: 24-48 giờ.
            </p>
          </div>
        </div>

        {/* Feature Shortcuts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, title: 'Tạo & quản lý bộ truyện', desc: 'Thông tin truyện, giá chương, trạng thái xuất bản' },
            { icon: Upload, title: 'Upload chương mới', desc: 'Bản nháp, duyệt nội dung, lịch phát hành' },
            { icon: MessageCircle, title: 'Trả lời bình luận', desc: 'Inbox bình luận từ độc giả theo từng truyện' },
            { icon: ShieldAlert, title: 'Báo cáo bản quyền', desc: 'Gửi bằng chứng, theo dõi trạng thái xử lý' }
          ].map((item) => (
            <Card key={item.title} hover className="p-5">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng doanh thu" value="22.3M đ" icon={DollarSign} trend={{ value: 12.5, isPositive: true }} color="primary" />
          <StatCard title="Lượt đọc" value="2.7M" icon={Eye} trend={{ value: 8.2, isPositive: true }} color="secondary" />
          <StatCard title="Lượt mua" value="14.7K" icon={ShoppingCart} trend={{ value: 15.3, isPositive: true }} color="success" />
          <StatCard title="Người theo dõi" value="180K" icon={Users} trend={{ value: 5.1, isPositive: true }} color="warning" />
        </div>

        {/* Revenue + Analytics */}
        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Doanh thu 7 ngày gần nhất</h2>
                <p className="text-sm text-muted-foreground">Tổng: 4.19M đ</p>
              </div>
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 139, 250, 0.1)" />
                <XAxis dataKey="date" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a0f2e', border: '1px solid rgba(168, 139, 250, 0.3)', borderRadius: '12px', color: '#f5f3ff' }}
                  formatter={(value: number) => `${value.toLocaleString()}đ`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Analytics độc giả</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 139, 250, 0.1)" />
                <XAxis dataKey="date" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip contentStyle={{ backgroundColor: '#1a0f2e', border: '1px solid rgba(168, 139, 250, 0.3)', borderRadius: '12px', color: '#f5f3ff' }} />
                <Bar dataKey="views" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Create / Upload workflow */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Bản nháp & upload chương</h2>
              <Button size="sm"><Upload className="w-4 h-4 mr-2" /> Upload</Button>
            </div>
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.title} className="p-4 bg-muted/30 rounded-xl border border-border flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{draft.title}</h3>
                    <p className="text-sm text-muted-foreground">{draft.comic} · {draft.updated}</p>
                  </div>
                  <Badge variant={draft.status === 'Đang duyệt' ? 'warning' : 'default'}>{draft.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6">Tạo truyện mới</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="px-4 py-3 bg-input border border-border rounded-xl" placeholder="Tên bộ truyện" />
              <input className="px-4 py-3 bg-input border border-border rounded-xl" placeholder="Thể loại chính" />
              <input className="px-4 py-3 bg-input border border-border rounded-xl" placeholder="Giá mỗi chương / Coin" />
              <input className="px-4 py-3 bg-input border border-border rounded-xl" placeholder="Lịch phát hành" />
            </div>
            <textarea className="w-full mt-4 px-4 py-3 bg-input border border-border rounded-xl min-h-28" placeholder="Mô tả truyện, đối tượng độc giả, lưu ý bản quyền..." />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost">Lưu nháp</Button>
              <Button>Gửi duyệt</Button>
            </div>
          </Card>
        </div>

        {/* My Comics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Tác phẩm của tôi</h2>
          <div className="space-y-4">
            {myComics.map((comic) => (
              <Card key={comic.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{comic.title}</h3>
                      <Badge variant={comic.status === 'published' ? 'success' : 'warning'}>
                        {comic.status === 'published' ? 'Đã xuất bản' : 'Đang duyệt'}
                      </Badge>
                      {comic.pending > 0 && <Badge variant="warning">{comic.pending} chờ duyệt</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{comic.chapters} chương · {comic.price} Coin/chương</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{(comic.revenue / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">Doanh thu</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{(comic.views / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">Lượt đọc</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{(comic.purchases / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">Lượt mua</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Quản lý</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Chapter Performance */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Hiệu suất chương (Học Viện Ánh Trăng)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Chương</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Lượt đọc</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Lượt mua</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Doanh thu</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Drop-off</th>
                </tr>
              </thead>
              <tbody>
                {chapterPerformance.map((chapter, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4 font-semibold">{chapter.chapter}</td>
                    <td className="py-4 px-4 text-right">{chapter.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">{chapter.purchases.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-semibold text-primary">{(chapter.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-4 px-4 text-right"><Badge variant={parseInt(chapter.dropOff) > 10 ? 'warning' : 'success'}>{chapter.dropOff}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Revenue / Blog / Comments */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-6 h-6 text-success" />
              <h2 className="text-xl font-bold">Doanh thu & thanh toán</h2>
            </div>
            <div className="space-y-3">
              {payoutHistory.map((item) => (
                <div key={item.period} className="p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{item.period}</span>
                    <Badge variant={item.status === 'Sẵn sàng rút' ? 'success' : 'default'}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Gross: {item.gross.toLocaleString()}đ · Net: <span className="text-success font-semibold">{item.net.toLocaleString()}đ</span></p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4"><DollarSign className="w-5 h-5 mr-2" />Rút tiền</Button>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Blog / Nhật ký tác giả</h2>
              <Button size="sm" variant="ghost"><FileText className="w-4 h-4 mr-2" />Viết</Button>
            </div>
            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.title} className="p-4 bg-muted/30 rounded-xl border border-border">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={post.status === 'Đã đăng' ? 'success' : 'default'}>{post.status}</Badge>
                    <span>{post.views} lượt xem</span>
                    <span>{post.comments} bình luận</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Bình luận cần trả lời</h2>
              <Badge variant="warning">{commentInbox.length}</Badge>
            </div>
            <div className="space-y-3">
              {commentInbox.map((comment) => (
                <div key={`${comment.reader}-${comment.time}`} className="p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex justify-between gap-3 mb-2">
                    <span className="font-semibold">{comment.reader}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-xs text-primary mb-2">{comment.comic}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{comment.comment}</p>
                  <Button size="sm" variant="secondary"><Reply className="w-4 h-4 mr-2" />Trả lời</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Copyright reports */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-error" />
              <div>
                <h2 className="text-xl font-bold">Báo cáo vi phạm bản quyền</h2>
                <p className="text-sm text-muted-foreground">Creator có thể gửi bằng chứng, theo dõi trạng thái và phản hồi yêu cầu bổ sung</p>
              </div>
            </div>
            <Button variant="danger"><Send className="w-4 h-4 mr-2" />Tạo báo cáo</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {copyrightReports.map((report) => (
              <div key={report.title} className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <Badge variant={report.status === 'Đang xử lý' ? 'warning' : 'default'}>{report.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Bằng chứng: {report.proof}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
