import { useEffect, useState } from 'react';
import { Coins, CreditCard, Smartphone, Building, ChevronRight, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { coinPackages, mockTransactions } from '../data/mockData';
import { getMockSession } from '../lib/mockAuth';

export function WalletPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userCoins, setUserCoins] = useState(550);

  useEffect(() => {
    const session = getMockSession();
    if (session) setUserCoins(session.coins);
  }, []);

  const paymentMethods = [
    { id: 'momo', name: 'MoMo', icon: Smartphone, color: 'text-[#D82D8B]' },
    { id: 'zalopay', name: 'ZaloPay', icon: Smartphone, color: 'text-[#0068FF]' },
    { id: 'vnpay', name: 'VNPay', icon: CreditCard, color: 'text-[#0D4490]' },
    { id: 'bank', name: 'Thẻ ngân hàng', icon: Building, color: 'text-success' }
  ];

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/20 via-card to-secondary/20 border-primary/30">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Số dư Coin hiện tại</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {userCoins}
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Coin dùng để mua chương, thuê truyện hoặc ủng hộ tác giả
            </p>
          </div>
        </Card>

        {/* Coin Packages */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Gói nạp Coin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coinPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative ${pkg.popular ? 'border-primary/50 shadow-xl shadow-primary/20' : ''}`}
                hover
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="hot">PHỔ BIẾN</Badge>
                  </div>
                )}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{pkg.coins}</p>
                    <p className="text-sm text-muted-foreground">Coin</p>
                    {pkg.bonus > 0 && (
                      <Badge variant="success" className="mt-2">
                        <Plus className="w-3 h-3 mr-1" />
                        {pkg.bonus} Bonus
                      </Badge>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-2xl font-bold text-primary mb-4">
                      {pkg.price.toLocaleString()}đ
                    </p>
                    <Button
                      variant={pkg.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handlePurchase(pkg.id)}
                    >
                      Nạp ngay
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Transaction History */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>
          <Card>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'purchase' ? 'bg-success/10' :
                      transaction.type === 'refund' ? 'bg-warning/10' :
                      'bg-muted/50'
                    }`}>
                      {transaction.type === 'purchase' ? (
                        <TrendingUp className="w-6 h-6 text-success" />
                      ) : transaction.type === 'refund' ? (
                        <TrendingUp className="w-6 h-6 text-warning" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-success' : 'text-foreground'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} Coin
                    </p>
                    <Badge variant="success" className="text-xs">
                      {transaction.status === 'success' ? 'Thành công' : 'Đang xử lý'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h3>

            {(() => {
              const pkg = coinPackages.find((p) => p.id === selectedPackage)!;
              return (
                <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gói Coin:</span>
                    <span className="font-semibold">{pkg.coins} Coin</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus:</span>
                      <span className="font-semibold text-success">+{pkg.bonus} Coin</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 border-t border-border">
                    <span className="text-muted-foreground">Tổng thanh toán:</span>
                    <span className="font-bold text-primary">{pkg.price.toLocaleString()}đ</span>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                    <span className="font-semibold">{method.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setShowPaymentModal(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
