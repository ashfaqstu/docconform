import { Review, ExtractedTerm, Issue, AuditEvent } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || error.error || 'Request failed');
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Reviews
  async getReviews(): Promise<PaginatedResponse<Review>> {
    return this.request<PaginatedResponse<Review>>('/reviews/');
  }

  async getReview(id: string): Promise<Review> {
    return this.request<Review>(`/reviews/${id}/`);
  }

  async createReview(executedFile: File, termSheetFile?: File): Promise<Review> {
    const formData = new FormData();
    formData.append('executedFile', executedFile);
    if (termSheetFile) {
      formData.append('termSheetFile', termSheetFile);
    }

    return this.request<Review>('/reviews/', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteReview(id: string): Promise<void> {
    return this.request<void>(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  async processReview(id: string): Promise<Review> {
    return this.request<Review>(`/reviews/${id}/process/`, {
      method: 'POST',
    });
  }

  async exportReview(id: string, format: string = 'json'): Promise<{ format: string; data: Review; exportedAt: string }> {
    return this.request<{ format: string; data: Review; exportedAt: string }>(`/reviews/${id}/export/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    });
  }

  async getReviewIssues(id: string): Promise<Issue[]> {
    return this.request<Issue[]>(`/reviews/${id}/issues/`);
  }

  async getReviewTerms(id: string): Promise<ExtractedTerm[]> {
    return this.request<ExtractedTerm[]>(`/reviews/${id}/terms/`);
  }

  async getReviewAuditLog(id: string): Promise<AuditEvent[]> {
    return this.request<AuditEvent[]>(`/reviews/${id}/audit_log/`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
