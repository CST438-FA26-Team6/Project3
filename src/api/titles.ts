import { apiRequest } from './client';
import type { MediaType, TitleSearchResult } from '../types/title';

export type TitleTypeFilter = 'ALL' | MediaType;

export function buildTitleSearchPath(
  query: string,
  type: TitleTypeFilter = 'ALL'
): string {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    throw new Error('Enter a title to search for.');
  }

  const queryParameter = encodeURIComponent(trimmedQuery);
  const typeParameter = type === 'ALL' ? '' : `&type=${type}`;

  return `/api/titles?query=${queryParameter}${typeParameter}`;
}

export function searchTitles(
  query: string,
  type: TitleTypeFilter = 'ALL'
): Promise<TitleSearchResult[]> {
  return apiRequest<TitleSearchResult[]>(buildTitleSearchPath(query, type));
}
