import { demoAccounts, type DemoAccount, type DemoRole } from '../data/mockData';

const STORAGE_KEY = 'inkverse_mock_session';
export const AUTH_CHANGED_EVENT = 'inkverse_mock_auth_changed';

export type MockSession = Omit<DemoAccount, 'password'>;

function toSession(account: DemoAccount): MockSession {
  const { password: _password, ...session } = account;
  return session;
}

export function getDefaultAccount(role: DemoRole = 'reader') {
  return demoAccounts.find((account) => account.role === role) ?? demoAccounts[0];
}

export function getMockSession(): MockSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setMockSession(account: DemoAccount): MockSession {
  const session = toSession(account);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  return session;
}

export function clearMockSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function loginMock(email: string, password: string): MockSession | null {
  const account = demoAccounts.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  );

  if (!account) return null;
  return setMockSession(account);
}

export function quickLogin(role: DemoRole): MockSession {
  return setMockSession(getDefaultAccount(role));
}

export function roleLabel(role: DemoRole) {
  switch (role) {
    case 'reader':
      return 'Reader';
    case 'author':
      return 'Author';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
}

export function roleHome(role?: DemoRole) {
  switch (role) {
    case 'author':
      return '/creator';
    case 'admin':
      return '/admin';
    case 'reader':
    default:
      return '/';
  }
}
