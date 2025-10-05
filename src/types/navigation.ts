export interface NavigationEntry {
  id: number;
  documentId: string;
  label: string;
  link: string;
  order: number;
  publishedAt?: string;
}

export interface NavigationCategory {
  id: number;
  documentId: string;
  name: string;
  order: number;
  publishedAt?: string;
  navigation_entries?: NavigationEntry[];
}

export interface NavigationData {
  categories: NavigationCategory[];
}