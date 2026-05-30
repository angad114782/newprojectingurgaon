const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export interface ApiAuthor {
  _id: string;
  name: string;
  slug: string;
  photo?: string;
  designation: string;
  experience?: string;
  specializations?: string[];
  credentials?: string;
  reraAgentId?: string;
  bio?: string;
  fullBio?: string;
  education?: string;
  languages?: string[];
  dealsCount?: string;
  awards?: string[];
  socialLinkedIn?: string;
  socialTwitter?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

async function apiFetch(path: string): Promise<any> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchAuthors(): Promise<ApiAuthor[]> {
  const data = await apiFetch('/authors');
  return data?.success ? data.data : [];
}

export async function fetchAuthorBySlug(slug: string): Promise<ApiAuthor | null> {
  const data = await apiFetch(`/authors/${slug}`);
  return data?.success ? data.data : null;
}
