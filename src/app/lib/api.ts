// API client cho backend ComicFlow (Spring Boot).
// Mọi response của backend đều bọc trong ApiResponse: { success, message, data, timestamp }.

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080';

const TOKEN_KEY = 'comicflow_token';

// ---- Token storage ----------------------------------------------------------
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

// ---- Kiểu dữ liệu khớp backend ----------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export type ComicStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS';
export type ApiRole = 'READER' | 'AUTHOR' | 'ADMIN';

export interface AuthResponse {
  accessToken: string;
}

export interface ComicResponse {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  status: ComicStatus;
  authorName: string | null;
  releaseDate: string | null;
}

export interface ChapterResponse {
  id: string;
  title: string;
  chapterNumber: number;
  price: number;
  url: string | null;
  comicId: string;
  createdAt: string | null;
}

export interface UploadResponse {
  fileName: string;
  coverImageUrl: string;
}

export interface UploadChapterResponse {
  url: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ---- Lõi fetch --------------------------------------------------------------
interface RequestOptions {
  method?: string;
  body?: unknown; // object -> JSON; FormData -> gửi nguyên
  auth?: boolean; // có gắn Bearer token không
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = {};

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError('Không kết nối được tới máy chủ. Kiểm tra backend đã chạy chưa.', 0);
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    // body rỗng / không phải JSON
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message = payload?.message || `Yêu cầu thất bại (HTTP ${res.status})`;
    throw new ApiError(message, res.status);
  }

  return (payload ? payload.data : (undefined as unknown)) as T;
}

// ---- Auth -------------------------------------------------------------------
export const authApi = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
  },
  register(input: { email: string; username: string; password: string; role: ApiRole }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      auth: false,
      body: input,
    });
  },
};

// ---- Comics -----------------------------------------------------------------
export const comicApi = {
  list() {
    return request<ComicResponse[]>('/comics', { auth: false });
  },
  get(comicId: string) {
    return request<ComicResponse>(`/comics/${comicId}`, { auth: false });
  },
  // Yêu cầu role AUTHOR/ADMIN
  listMine() {
    return request<ComicResponse[]>('/author/comics');
  },
  create(input: { title: string; description?: string; status: ComicStatus }) {
    return request<ComicResponse>('/author/comics', { method: 'POST', body: input });
  },
  update(comicId: string, input: { title?: string; description?: string; status?: ComicStatus }) {
    return request<ComicResponse>(`/author/comics/${comicId}`, { method: 'PUT', body: input });
  },
  remove(comicId: string) {
    return request<void>(`/author/comics/${comicId}`, { method: 'DELETE' });
  },
  // Lưu ý: backend dùng PATCH cho cover nhưng CORS hiện chưa cho phép PATCH.
  updateCover(comicId: string, coverImageUrl: string) {
    return request<ComicResponse>(`/author/comics/${comicId}/cover`, {
      method: 'PATCH',
      body: { coverImageUrl },
    });
  },
};

// ---- Chapters ---------------------------------------------------------------
export const chapterApi = {
  listByComic(comicId: string) {
    return request<ChapterResponse[]>(`/comics/${comicId}/chapters`, { auth: false });
  },
  get(chapterId: string) {
    return request<ChapterResponse>(`/chapters/${chapterId}`, { auth: false });
  },
  // multipart/form-data: AUTHOR tạo chương kèm file PDF
  create(input: {
    chapterNumber: number;
    title: string;
    price: number;
    comicId: string;
    isFree: boolean;
    file: File;
  }) {
    const form = new FormData();
    form.append('chapterNumber', String(input.chapterNumber));
    form.append('title', input.title);
    form.append('price', String(input.price));
    form.append('comicId', input.comicId);
    form.append('isFree', String(input.isFree));
    form.append('file', input.file);
    return request<ChapterResponse>('/author/chapters', { method: 'POST', body: form });
  },
};

// ---- Storage ----------------------------------------------------------------
export const storageApi = {
  uploadCover(comicId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('comicId', comicId);
    return request<UploadResponse>('/storage/upload', { method: 'POST', body: form });
  },
  uploadChapterPdf(comicId: string, chapterId: string, file: File, isFree: boolean) {
    const form = new FormData();
    form.append('file', file);
    form.append('comicId', comicId);
    form.append('chapterId', chapterId);
    form.append('isFree', String(isFree));
    return request<UploadChapterResponse>('/storage/upload/pdf', { method: 'POST', body: form });
  },
};

// ---- Mappers: ComicFlow -> shape mà UI mock đang dùng -----------------------
const FALLBACK_COVER = 'https://placehold.co/400x600/1b1730/f8f5ff?text=ComicFlow';

export interface UiComic {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: number;
  pricePerChapter: number;
  genres: string[];
  status?: 'free' | 'premium' | 'hot' | 'new';
  description: string;
  followers: number;
  chapters: number;
  apiStatus?: ComicStatus;
}

export function mapComic(c: ComicResponse): UiComic {
  return {
    id: c.id,
    title: c.title,
    author: c.authorName ?? 'Không rõ',
    cover: c.coverImageUrl || FALLBACK_COVER,
    rating: 0,
    views: 0,
    pricePerChapter: 0,
    genres: [],
    status: undefined,
    description: c.description ?? '',
    followers: 0,
    chapters: 0,
    apiStatus: c.status,
  };
}

export interface UiChapter {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  date: string;
  views: number;
  status: 'free' | 'owned' | 'locked' | 'premium';
  price?: number;
  url?: string;
}

export function mapChapter(c: ChapterResponse): UiChapter {
  const isPaid = (c.price ?? 0) > 0;
  return {
    id: c.id,
    chapterId: c.id,
    number: c.chapterNumber,
    title: c.title,
    date: c.createdAt ? c.createdAt.slice(0, 10) : '',
    views: 0,
    status: isPaid ? 'locked' : 'free',
    price: isPaid ? c.price : undefined,
    url: c.url ?? undefined,
  };
}
