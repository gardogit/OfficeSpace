// TypeScript interfaces for Corporate Intranet Dashboard

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  role: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string; // ISO date string for JSON compatibility
  imageUrl?: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string for JSON compatibility
  endDate: string; // ISO date string for JSON compatibility
  location: string;
  organizer: string;
  attendees?: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string; // ISO date string for JSON compatibility
  avatar?: string;
  bio?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: string;
  icon?: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  lastActivity: string; // ISO date string for JSON compatibility
}

export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

// Main data structure for mock data
export interface MockData {
  currentUser: UserProfile;
  news: NewsArticle[];
  events: Event[];
  newHires: Employee[];
  quickLinks: QuickLink[];
  spaces: Space[];
  applications: Application[];
}