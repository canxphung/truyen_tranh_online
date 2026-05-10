import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  Info,
  Send,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const STORAGE_KEY = 'inkverse.creator.chapterUploads';

const demoComics = [
  { id: '1', title: 'Học Viện Ánh Trăng', nextChapter: 46, price: 15 },
  { id: '2', title: 'Người Gác Cổng Linh Giới', nextChapter: 39, price: 15 },
  { id: '3', title: 'Vùng Đất Quên Lãng', nextChapter: 6, price: 20 }
];

type UploadForm = {
  comic: string;
  chapterNumber: string;
  chapterTitle: string;
  price: string;
  releaseTime: string;
  rating: string;
  note: string;
  pdfFileName: string;
  copyrightOwner: string;
  copyrightSource: string;
  proofLink: string;
  copyrightConfirmed: boolean;
  originalityConfirmed: boolean;
  scanConsent: boolean;
};

const initialForm: UploadForm = {
  comic: demoComics[0].title,
  chapterNumber: String(demoComics[0].nextChapter),
  chapterTitle: '',
  price: String(demoComics[0].price),
  releaseTime: '',
  rating: '13+',
  note: '',
  pdfFileName: '',
  copyrightOwner: '',
  copyrightSource: '',
  proofLink: '',
  copyrightConfirmed: false,
  originalityConfirmed: false,
  scanConsent: false
};

function saveUploadToStorage(item: Record<string, unknown>) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...current].slice(0, 20)));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]));
  }
}

export function CreatorUploadChapterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UploadForm>(initialForm);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3600);
  };

  const updateForm = (patch: Partial<UploadForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleComicChange = (comicTitle: string) => {
    const selectedComic = demoComics.find((comic) => comic.title === comicTitle);
    updateForm({
      comic: comicTitle,
      chapterNumber: selectedComic ? String(selectedComic.nextChapter) : form.chapterNumber,
      price: selectedComic ? String(selectedComic.price) : form.price
    });
  };

  const handleChapterPdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      updateForm({ pdfFileName: '' });
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');

    if (!isPdf) {
      event.target.value = '';
      updateForm({ pdfFileName: '' });
      showNotice('Chỉ hỗ trợ upload file PDF. Không nhận ZIP, JPG, PNG, WEBP hoặc file ảnh rời.');
      return;
    }

    updateForm({ pdfFileName: file.name });
  };

  const submitUpload = () => {
    if (!form.chapterTitle.trim()) {
      showNotice('Vui lòng nhập tên chương trước khi gửi duyệt.');
      return;
    }

    if (!form.pdfFileName) {
      showNotice('Vui lòng chọn file PDF của chương. Hệ thống không nhận ZIP hoặc ảnh rời.');
      return;
    }

    if (!form.copyrightOwner.trim()) {
      showNotice('Vui lòng nhập chủ sở hữu bản quyền / bút danh.');
      return;
    }

    if (!form.copyrightConfirmed || !form.originalityConfirmed || !form.scanConsent) {
      showNotice('Vui lòng hoàn tất 3 xác nhận bản quyền trước khi gửi duyệt.');
      return;
    }

    saveUploadToStorage({
      title: `Chương ${form.chapterNumber}: ${form.chapterTitle.trim()}`,
      comic: form.comic,
      status: 'Đang duyệt',
      updated: 'Vừa xong',
      fileName: form.pdfFileName,
      copyright: 'Đang kiểm tra bản quyền',
      price: Number.parseInt(form.price, 10) || 0,
      submittedAt: new Date().toISOString()
    });

    setSubmitted(true);
    showNotice('Đã gửi chương mới vào hàng chờ duyệt nội dung và bản quyền.');
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/creator" className="mb-3 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về Creator Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Upload chương mới</h1>
            <p className="mt-2 text-muted-foreground">
              Chỉ nhận file PDF, kèm thông tin kiểm tra bản quyền trước khi gửi Admin duyệt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">PDF only</Badge>
            <Badge variant="warning">Kiểm tra bản quyền</Badge>
            <Badge variant="default">Admin review</Badge>
          </div>
        </div>

        <Card className="border-warning/30 bg-warning/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
            <div>
              <p className="font-semibold text-foreground">Luồng upload đã chuyển sang page riêng</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Form này nhiều thông tin nên không còn nằm trong modal. Tác giả có đủ không gian để nhập metadata, upload PDF và xác nhận bản quyền.
              </p>
            </div>
          </div>
        </Card>

        {submitted ? (
          <Card className="border-success/30 bg-success/10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Đã gửi chương vào hàng chờ duyệt</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Chương mới sẽ được Admin kiểm tra file PDF, thông tin bản quyền, watermark và dấu hiệu trùng lặp trước khi xuất bản.
            </p>
            <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card/70 p-4 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Truyện</p>
                <p className="font-semibold">{form.comic}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chương</p>
                <p className="font-semibold">Chương {form.chapterNumber}: {form.chapterTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">File PDF</p>
                <p className="font-semibold">{form.pdfFileName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <Badge variant="warning" className="mt-1">Đang duyệt</Badge>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={resetForm}>Upload chương khác</Button>
              <Button onClick={() => navigate('/creator')}>Về Dashboard</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <Card>
                <div className="mb-5 flex items-start gap-3">
                  <FileText className="mt-0.5 h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">1. Thông tin chương</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Khai báo metadata để Admin duyệt đúng truyện, đúng chương và đúng lịch phát hành.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Bộ truyện</span>
                    <select value={form.comic} onChange={(e) => handleComicChange(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3">
                      {demoComics.map((comic) => <option key={comic.id} value={comic.title}>{comic.title}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Số chương</span>
                    <input value={form.chapterNumber} onChange={(e) => updateForm({ chapterNumber: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="46" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Giá mở khóa / Coin</span>
                    <input value={form.price} onChange={(e) => updateForm({ price: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="15" />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Tên chương</span>
                    <input value={form.chapterTitle} onChange={(e) => updateForm({ chapterTitle: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Ví dụ: Cánh cửa bạc" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Lịch phát hành</span>
                    <input value={form.releaseTime} onChange={(e) => updateForm({ releaseTime: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="VD: 20:00, 15/05/2026" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Rating nội dung</span>
                    <select value={form.rating} onChange={(e) => updateForm({ rating: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3">
                      <option>Phù hợp mọi lứa tuổi</option>
                      <option>13+</option>
                      <option>16+</option>
                      <option>18+</option>
                    </select>
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Ghi chú cho Admin</span>
                    <textarea value={form.note} onChange={(e) => updateForm({ note: e.target.value })} className="min-h-28 w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Cảnh báo nội dung, lịch phát hành, ghi chú kiểm duyệt..." />
                  </label>
                </div>
              </Card>

              <Card>
                <div className="mb-5 flex items-start gap-3">
                  <Upload className="mt-0.5 h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">2. Upload file PDF</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Không nhận ZIP, JPG, PNG, WEBP hoặc ảnh rời.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleChapterPdfChange}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                  />
                  {form.pdfFileName ? (
                    <div className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
                      Đã chọn PDF: {form.pdfFileName}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">Chưa chọn file. File hợp lệ phải có định dạng <strong>.pdf</strong>.</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="mb-5 flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-6 w-6 text-warning" />
                  <div>
                    <h2 className="text-xl font-bold">3. Kiểm tra bản quyền</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Thông tin này giúp Admin truy vết quyền sở hữu và giảm rủi ro reup/sao chép.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Chủ sở hữu bản quyền / bút danh</span>
                    <input value={form.copyrightOwner} onChange={(e) => updateForm({ copyrightOwner: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="VD: Tác giả Luna Studio" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Nguồn quyền sở hữu</span>
                    <input value={form.copyrightSource} onChange={(e) => updateForm({ copyrightSource: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Tự sáng tác / hợp đồng / giấy phép" />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Link bằng chứng / hợp đồng / ghi chú</span>
                    <input value={form.proofLink} onChange={(e) => updateForm({ proofLink: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Có thể để trống trong demo" />
                  </label>
                </div>

                <div className="mt-5 space-y-3">
                  <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
                    <input type="checkbox" checked={form.copyrightConfirmed} onChange={(e) => updateForm({ copyrightConfirmed: e.target.checked })} className="mt-1" />
                    <span>Tôi xác nhận mình có quyền đăng tải và khai thác thương mại chương này.</span>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
                    <input type="checkbox" checked={form.originalityConfirmed} onChange={(e) => updateForm({ originalityConfirmed: e.target.checked })} className="mt-1" />
                    <span>Nội dung không phải bản reup, không sao chép trái phép từ tác phẩm khác.</span>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
                    <input type="checkbox" checked={form.scanConsent} onChange={(e) => updateForm({ scanConsent: e.target.checked })} className="mt-1" />
                    <span>Tôi đồng ý để hệ thống/Admin kiểm tra bản quyền, watermark và dấu hiệu trùng lặp trước khi duyệt.</span>
                  </label>
                </div>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-24">
                <div className="mb-5 flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-bold">Tóm tắt gửi duyệt</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Kiểm tra nhanh trước khi gửi Admin.</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Truyện</p>
                    <p className="font-semibold">{form.comic}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Chương</p>
                    <p className="font-semibold">Chương {form.chapterNumber || '-'} {form.chapterTitle ? `· ${form.chapterTitle}` : ''}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">File</p>
                    <p className="font-semibold">{form.pdfFileName || 'Chưa chọn PDF'}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Bản quyền</p>
                    <p className="font-semibold">{form.copyrightOwner || 'Chưa khai báo'}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                  <p>Checklist cần đủ:</p>
                  <p>• Có tên chương</p>
                  <p>• Có file PDF</p>
                  <p>• Có chủ sở hữu bản quyền</p>
                  <p>• Đủ 3 xác nhận bản quyền</p>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Button onClick={submitUpload}>
                    <Send className="h-4 w-4" />
                    Gửi duyệt chương
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/creator')}>Hủy và về Dashboard</Button>
                </div>
              </Card>
            </aside>
          </div>
        )}
      </div>

      {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold shadow-2xl shadow-primary/20">
          {notice}
        </div>
      )}
    </div>
  );
}
