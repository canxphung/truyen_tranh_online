import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { ComicDetailPage } from './pages/ComicDetailPage';
import { ReaderPage } from './pages/ReaderPage';
import { WalletPage } from './pages/WalletPage';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PremiumPage } from './pages/PremiumPage';
import { LibraryPage } from './pages/LibraryPage';
import { CreatorRegistrationPage } from './pages/CreatorRegistrationPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { DemoTestCenterPage } from './pages/DemoTestCenterPage';
import { ScrollToTop } from './components/layout/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground dark">
        <ScrollToTop />
        <Routes>
          <Route path="/read/:comicId/:chapterId" element={<ReaderPage />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/comic/:id" element={<ComicDetailPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/creator" element={<CreatorDashboard />} />
                  <Route path="/creator/register" element={<CreatorRegistrationPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/settings" element={<SystemSettingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/demo-test" element={<DemoTestCenterPage />} />
                  <Route path="/explore" element={<HomePage />} />
                  <Route path="/category/:categoryName" element={<HomePage />} />
                  <Route path="/trending" element={<HomePage />} />

                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}