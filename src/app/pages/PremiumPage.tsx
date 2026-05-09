import { Check, Crown, Zap, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

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
      features: [
        'Đọc 30 chương Premium/tháng',
        'Giảm 10% khi mua chương',
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
      features: [
        'Đọc không giới hạn tất cả truyện',
        'Giảm 20% khi mua chương',
        'Không quảng cáo',
        'Tải chương offline',
        'Đọc trước 3 ngày cho chương mới',
        'Badge Premium độc quyền',
        'Ưu tiên hỗ trợ cao cấp'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      icon: Zap,
      price: { monthly: 199000, yearly: 1990000 },
      color: 'warning',
      features: [
        'Tất cả tính năng Pro',
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
    { icon: TrendingUp, title: 'Ủng hộ tác giả', description: 'Một phần phí Premium sẽ được chia sẻ trực tiếp cho tác giả' },
    { icon: Crown, title: 'Trải nghiệm cao cấp', description: 'Không quảng cáo, đọc offline và nhiều tính năng đặc biệt' },
    { icon: Star, title: 'Cộng đồng VIP', description: 'Tham gia nhóm thành viên Premium với các đặc quyền riêng' }
  ];

  const savings = billingCycle === 'yearly' ? 20 : 0;

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
              Trải nghiệm đọc truyện{' '}
              <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                không giới hạn
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Đọc tất cả truyện Premium, không quảng cáo, và nhận nhiều đặc quyền độc quyền
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
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
              { q: 'Tôi có thể hủy gói Premium bất cứ lúc nào không?', a: 'Có, bạn có thể hủy bất cứ lúc nào. Gói Premium sẽ còn hiệu lực đến hết chu kỳ thanh toán.' },
              { q: 'Premium có tự động gia hạn không?', a: 'Có, gói Premium sẽ tự động gia hạn. Bạn có thể tắt tự động gia hạn trong cài đặt tài khoản.' },
              { q: 'Nếu nâng cấp từ Basic lên Pro thì sao?', a: 'Bạn sẽ được hoàn lại tiền còn lại của gói Basic và chỉ cần trả phần chênh lệch cho gói Pro.' },
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
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedPlan(null)}>
          <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Xác nhận đăng ký Premium</h3>
            <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gói:</span>
                <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chu kỳ:</span>
                <span className="font-semibold">{billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-border">
                <span className="text-muted-foreground">Tổng thanh toán:</span>
                <span className="font-bold text-primary">
                  {plans.find(p => p.id === selectedPlan)?.price[billingCycle].toLocaleString()}đ
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedPlan(null)}>
                Hủy
              </Button>
              <Button className="flex-1">
                Thanh toán
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
