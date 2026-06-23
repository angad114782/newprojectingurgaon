const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export interface BlogAuthor {
  name: string;
  bio?: string;
  credentials?: string;
  avatar?: string;
}

export interface BlogSection {
  heading: string;
  content: string;
  link?: string;
  linkText?: string;
}

export interface BlogRelatedLink {
  label: string;
  href: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: string;
  category: string;
  status: 'draft' | 'published';
  author: BlogAuthor;
  date: string;
  dateModified?: string;
  readTime?: string;
  keywords?: string[];
  intro?: string;
  sections?: BlogSection[];
  relatedLinks?: BlogRelatedLink[];
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function fetchAllBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/blogs/slugs`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function fetchAllBlogsAdmin(token: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blogs/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function createBlog(blog: Partial<BlogPost>, token: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(blog),
    });
    const data = await res.json();
    return data?.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function updateBlog(id: string, blog: Partial<BlogPost>, token: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(blog),
    });
    const data = await res.json();
    return data?.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function deleteBlog(id: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}
