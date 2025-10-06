/* eslint-disable @typescript-eslint/no-explicit-any */
// Program Types
export interface Program {
  id: string;
  name: string;
  host: string;
  day: string;
  startTime: string;
  endTime: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramDTO {
  name: string;
  host: string;
  day: string;
  startTime: string;
  endTime: string;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  active?: boolean;
}

export interface UpdateProgramDTO extends Partial<CreateProgramDTO> {
  id: string;
}

// Podcast Types
export interface Podcast {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  audioUrl?: string;
  duration?: string;
  episodeNumber?: number;
  season?: number;
  featured: boolean;
  published: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePodcastDTO {
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  audioUrl?: string;
  duration?: string;
  episodeNumber?: number;
  season?: number;
  featured?: boolean;
  published?: boolean;
  publishDate?: string;
}

export interface UpdatePodcastDTO extends Partial<CreatePodcastDTO> {
  id: string;
}

export interface PodcastsResponse {
  podcasts: Podcast[];
  total: number;
  hasMore: boolean;
}

// News Types
export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category?: string;
  author?: string;
  featured: boolean;
  published: boolean;
  publishDate: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDTO {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category?: string;
  author?: string;
  featured?: boolean;
  published?: boolean;
  publishDate?: string;
}

export interface UpdateNewsDTO extends Partial<CreateNewsDTO> {
  id: string;
}

export interface NewsResponse {
  news: News[];
  total: number;
  hasMore: boolean;
}

// Common Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface FilterParams {
  featured?: boolean;
  category?: string;
  day?: string;
  published?: boolean;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "responded";
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDTO {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  metadata?: any;
}

export interface UpdateContactDTO {
  id: string;
  status?: "unread" | "read" | "responded";
  metadata?: any;
}

// Paystack Types
export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    domain: string;
    gateway_response: string;
    message?: string;
    channel?: string;
    customer: {
      email: string;
      customer_code?: string;
    };
  };
}

export interface Team {
  id: string;
  name: string;
  role: string;
  roleYoruba?: string;
  imageUrl: string;
  description: string;
  email?: string;
  phone?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  featured: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamMemberData {
  name: string;
  role: string;
  roleYoruba?: string;
  imageUrl: string;
  description: string;
  email?: string;
  phone?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  featured?: boolean;
  active?: boolean;
  displayOrder?: number;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {
  id: string;
}
