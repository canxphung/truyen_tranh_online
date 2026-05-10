import { Check, Crown, Zap, Star, Sparkles, TrendingUp, CalendarClock, Eye, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';
import { mockPremiumSubscription } from '../data/mockData';

export function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Star,
      price: { monthly: 49000, yearly: 490000 },
      color: 'secondary',
      monthlyReadLimit: 30,
      features: [
        'Đọc 30 chương Premium/tháng',
        'Hiển thị số lượt đọc còn lại trong tài khoản',
        'Giảm 10% khi mua chương bằng Coin',
        'Không quảng cáo',
        'Bookmark không giới hạn',
        'Ưu tiên hỗ trợ'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: { monthly: 99000, yearly: 990000 },
      color: 'primary',
      popular: true,
      monthlyReadLimit: 120,
      features: [
        'Đọc 120 chương Premium/tháng',
        'Cảnh báo khi sắp hết lượt đọc',
        'Giảm 20% khi mua chương bằng Coin',
        'Không quảng cáo',
        'Tải chương offline',
        'Đọc trước 3 ngày cho chương mới',
        'Badge Premium độc quyền'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      icon: Zap,
      price: { monthly: 199000, yearly: 1990000 },
      color: 'warning',
      monthlyReadLimit: 300,
      features: [
        'Đọc 300 chương Premium/tháng',
        'Tặng 500 Coin mỗi tháng',
        'Đọc trước 7 ngày cho chương mới',
        'Tham gia nhóm Discord VIP',
        'Gặp gỡ tác giả (sự kiện)',
        'Tên xuất hiện trong Credits',
        'Hỗ trợ VIP 24/7'
      ]
    }
  ];

  const benefits = [
    { icon: Sparkles, title: 'Nội dung độc quyền', description: 'Truy cập hàng ngàn truyện Premium chỉ dành cho thành viên' },
    { icon: TrendingUp, title: 'Kiểm soát lượt đọc', description: 'Luôn biết gói hiện tại còn bao nhiêu lượt đọc Premium trong tháng' },
    { icon: Crown, title: 'Trải nghiệm cao cấp', description: 'Không quảng cáo, đọc offline và nhiều tính năng đặc biệt' },
    { icon: Star, title: 'Cộng đồng VIP', description: 'Tham gia nhóm thành viên Premium với các đặc quyền riêng' }
  ];

  const currentUsagePercent = Math.round((mockPremiumSubscription.usedThisMonth / mockPremiumSubscription.monthlyReadLimit) * 100);
  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-warning/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920')] opacity-5 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge variant="hot" className="inline-flex">
              <Crown className="w-3 h-3 mr-1" />
              Nâng cấp Premium
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Đọc Premium có kiểm soát{' '}
              <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                lượt đọc còn lại
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Người dùng luôn biết gói Premium đang dùng, đã đọc bao nhiêu chương và còn bao nhiêu lượt trước kỳ reset tiếp theo.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Current Premium Usage */}
        <Card className="bg-gradient-to-br from-warning/15 via-card to-primary/15 border-warning/30">
          <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-8 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="premium">Premium đang hoạt động</Badge>
                <Badge variant="success">Tự động gia hạn</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gói hiện tại</p>
                <h2 className="text-3xl font-bold">{mockPremiumSubscription.planName}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Reset lượt đọc vào {mockPremiumSubscription.resetAt}. Lượt Premium chỉ bị trừ khi đọc chương khóa bằng quyền Premium.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-background/60 border border-border p-4">
                  <Eye className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Còn lại</p>
                  <p className="text-2xl font-bold text-primary">{mockPremiumSubscription.remainingReads}</p>
                </div>
                <div className="rounded-xl bg-background/60 border border-border p-4">
                  <ShieldCheck className="w-5 h-5 text-success mb-2" />
                  <p className="text-xs text-muted-foreground">Đã dùng</p>
                  <p className="text-2xl font-bold">{mockPremiumSubscription.usedThisMonth}</p>
                </div>
                <div className="rounded-xl bg-background/60 border border-border p-4">
                  <CalendarClock className="w-5 h-5 text-warning mb-2" />
                  <p className="text-xs text-muted-foreground">Giới hạn tháng</p>
                  <p className="text-2xl font-bold">{mockPremiumSubscription.monthlyReadLimit}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/50 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">Theo dõi quota Premium</h3>
                  <p className="text-sm text-muted-foreground">Đã dùng {currentUsagePercent}% lượt đọc trong chu kỳ hiện tại</p>
                </div>
                <Badge variant={mockPremiumSubscription.remainingReads <= 5 ? 'warning' : 'success'}>
                  Còn {mockPremiumSubscription.remainingReads} lượt
                </Badge>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-warning" style={{ width: `${currentUsagePercent}%` }} />
              </div>
              <div className="space-y-3">
                {mockPremiumSubscription.usageHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/30 border border-border p-3">
                    <div>
                      <p className="font-semibold text-sm">{item.comicTitle} · Chương {item.chapterNumber}</p>
                      <p className="text-xs text-muted-foreground">{item.date} · {item.action}</p>
                    </div>
                    <Badge variant="default">Còn {item.remainingAfter}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 p-2 bg-card rounded-2xl border border-border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hàng năm
              <Badge variant="success" className="absolute -top-2 -right-2 text-xs">-20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
            const pricePerMonth = billingCycle === 'yearly' ? price / 12 : price;

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'border-primary/50 shadow-2xl shadow-primary/20 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="hot">PHỔ BIẾN NHẤT</Badge>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${plan.color}/10 rounded-xl mb-4`}>
                      <Icon className={`w-8 h-8 text-${plan.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary">
                        {pricePerMonth.toLocaleString()}đ
                      </p>
                      <p className="text-sm text-muted-foreground">/tháng</p>
                      {billingCycle === 'yearly' && (
                        <p className="text-xs text-success">
                          Tiết kiệm {((plan.price.monthly * 12 - plan.price.yearly) / 1000).toFixed(0)}K đ/năm
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/30 border border-border p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Quota đọc Premium</p>
                      <p className="text-xs text-muted-foreground">Reset mỗi chu kỳ thanh toán</p>
                    </div>
                    <Badge variant="premium">{plan.monthlyReadLimit} lượt/tháng</Badge>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    size="lg"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular ? 'Chọn gói này' : 'Bắt đầu ngay'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Benefits */}
        <section className="pt-12">
          <h2 className="text-3xl font-bold text-center mb-12">Tại sao nên nâng cấp Premium?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="pt-12">
          <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Lượt đọc Premium được tính như thế nào?', a: 'Mỗi lần mở một chương trả phí bằng quyền Premium sẽ trừ 1 lượt. Chương miễn phí hoặc chương đã mua vĩnh viễn bằng Coin không trừ lượt Premium.' },
              { q: 'Hết lượt Premium thì sao?', a: 'Bạn vẫn có thể mua từng chương bằng Coin hoặc nâng cấp gói cao hơn để có thêm lượt đọc trong tháng.' },
              { q: 'Premium có tự động gia hạn không?', a: 'Có, gói Premium sẽ tự động gia hạn. Bạn có thể tắt tự động gia hạn trong cài đặt tài khoản.' },
              { q: 'Coin thưởng của gói Ultimate có hết hạn không?', a: 'Coin thưởng không có thời hạn sử dụng và sẽ được cộng vào tài khoản mỗi tháng.' }
            ].map((faq, index) => (
              <Card key={index} hover>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Payment Modal */}
      {selectedPlan && selectedPlanData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedPlan(null)}>
          <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Xác nhận đăng ký Premium</h3>
            <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gói:</span>
                <span className="font-semibold">{selectedPlanData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quota đọc:</span>
                <span className="font-semibold text-primary">{selectedPlanData.monthlyReadLimit} lượt/tháng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chu kỳ:</span>
                <span className="font-semibold">{billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-border">
                <span className="text-muted-foreground">Tổng:</span>
                <span className="font-bold text-primary">
                  {selectedPlanData.price[billingCycle].toLocaleString()}đ
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <RefreshCcw className="w-4 h-4 text-warning mt-0.5" />
                <p>Sau khi thanh toán mock, hệ thống sẽ ghi nhận gói, số lượt đọc tối đa, số lượt đã dùng và ngày reset quota trong hồ sơ Reader.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedPlan(null)}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={() => setSelectedPlan(null)}>
                Thanh toán mock
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
