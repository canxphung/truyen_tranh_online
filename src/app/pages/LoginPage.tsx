import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Crown, Shield, User, Zap, Eye, EyeOff, Coins } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { demoAccounts, type DemoAccount, type DemoRole } from '../data/mockData';
import {
  getMockSession,
  loginMock,
  quickLogin,
  roleHome,
  roleLabel,
  setRealSession,
  demoRoleToApiRole,
  type MockSession,
} from '../lib/mockAuth';
import { authApi, setToken, ApiError } from '../lib/api';

const roleIcon = {
  reader: User,
  author: Crown,
  admin: Shield
};

const roleVariant = {
  reader: 'primary',
  author: 'secondary',
  admin: 'warning'
} as const;

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<DemoRole>('reader');
  const [email, setEmail] = useState('reader@inkverse.demo');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [currentSession, setCurrentSession] = useState<MockSession | null>(null);

  const selectedAccount = useMemo(
    () => demoAccounts.find((account) => account.role === selectedRole) ?? demoAccounts[0],
    [selectedRole]
  );

  useEffect(() => {
    setCurrentSession(getMockSession());
  }, []);

  const selectAccount = (account: DemoAccount) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  // Đăng nhập thật qua backend ComicFlow; nếu lỗi mạng thì thử tài khoản demo.
  const submitLogin = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { accessToken } = await authApi.login(email.trim(), password);
      setToken(accessToken);
      const session = setRealSession({ email: email.trim(), role: selectedRole });
      navigate(roleHome(session.role));
    } catch (err) {
      // Backend chưa chạy/không kết nối được -> fallback dữ liệu demo
      if (err instanceof ApiError && err.status === 0) {
        const session = loginMock(email, password);
        if (session) {
          setInfo('Không gọi được backend, đã đăng nhập bằng dữ liệu demo.');
          navigate(roleHome(session.role));
          return;
        }
      }
      setError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký tài khoản thật theo role đang chọn.
  const submitRegister = async () => {
    setError('');
    setInfo('');
    if (!username.trim()) {
      setError('Nhập tên hiển thị (username) để đăng ký.');
      return;
    }
    setLoading(true);
    try {
      const { accessToken } = await authApi.register({
        email: email.trim(),
        username: username.trim(),
        password,
        role: demoRoleToApiRole(selectedRole),
      });
      setToken(accessToken);
      const session = setRealSession({ email: email.trim(), role: selectedRole, name: username.trim() });
      navigate(roleHome(session.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const loginByRole = (role: DemoRole) => {
    const session = quickLogin(role);
    navigate(roleHome(session.role));
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <Badge variant="primary" className="mb-4">MOCK LOGIN READY</Badge>
            <h1 className="text-4xl font-bold mb-3">Đăng nhập demo để kiểm tra toàn bộ chức năng</h1>
            <p className="text-muted-foreground max-w-3xl">
              Dữ liệu mock được gắn sẵn cho 3 vai trò Reader, Author và Admin. Bạn có thể đăng nhập nhanh để kiểm thử từng luồng mà không cần backend thật.
            </p>
          </div>
          <Link to="/demo-test">
            <Button variant="ghost">
              <CheckCircle className="w-5 h-5 mr-2" />
              Mở checklist kiểm thử
            </Button>
          </Link>
        </div>

        {currentSession && (
          <Card className="border-primary/30 bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={currentSession.avatar} alt={currentSession.name} className="w-14 h-14 rounded-2xl bg-muted" />
                <div>
                  <p className="text-sm text-muted-foreground">Đang có session mock</p>
                  <h2 className="text-xl font-bold">{currentSession.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentSession.email} · {roleLabel(currentSession.role)}</p>
                </div>
              </div>
              <Link to={roleHome(currentSession.role)}>
                <Button>Vào dashboard hiện tại</Button>
              </Link>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-[1.05fr_1.4fr] gap-8">
          <Card>
            <h2 className="text-2xl font-bold mb-2">Đăng nhập / Đăng ký</h2>
            <p className="text-sm text-muted-foreground mb-6">Kết nối backend ComicFlow. Vai trò chọn ở cột bên phải quyết định nơi điều hướng và role khi đăng ký.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="reader@inkverse.demo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tên hiển thị <span className="text-muted-foreground font-normal">(chỉ cần khi đăng ký)</span></label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
                <div className="relative">
                  <input
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-error">{error}</p>}
              {info && <p className="text-sm text-warning">{info}</p>}

              <div className="grid sm:grid-cols-2 gap-3">
                <Button className="w-full" size="lg" onClick={submitLogin} disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </Button>
                <Button className="w-full" size="lg" variant="secondary" onClick={submitRegister} disabled={loading}>
                  Đăng ký
                </Button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => loginByRole(account.role)}
                    className="px-4 py-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 text-left transition-all"
                  >
                    <span className="block text-sm font-semibold">Login {roleLabel(account.role)}</span>
                    <span className="block text-xs text-muted-foreground truncate">{account.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Tài khoản demo</h2>
            <div className="grid gap-4">
              {demoAccounts.map((account) => {
                const Icon = roleIcon[account.role];
                const isSelected = selectedRole === account.role;
                return (
                  <button
                    key={account.id}
                    onClick={() => selectAccount(account)}
                    className={`text-left rounded-2xl border p-5 transition-all ${isSelected ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-border bg-card hover:border-primary/40'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold">{account.name}</h3>
                            <Badge variant={roleVariant[account.role]}>{roleLabel(account.role)}</Badge>
                            {account.premium && <Badge variant="premium">Premium</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{account.email} / {account.password}</p>
                          <p className="text-sm text-muted-foreground">{account.bio}</p>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 md:items-end">
                        <Badge variant="owned"><Coins className="w-3 h-3 mr-1" /> {account.coins}</Badge>
                        <span className="text-xs text-muted-foreground">{account.permissions.length} quyền test</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Card className="bg-muted/20">
              <h3 className="font-bold mb-3">Tài khoản đang chọn</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-background/40 border border-border">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedAccount.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-background/40 border border-border">
                  <p className="text-muted-foreground">Password</p>
                  <p className="font-semibold">{selectedAccount.password}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
