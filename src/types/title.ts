export type MediaType = 'ANIME' | 'MANGA';

export interface TitleSearchResult {
  id: number;
  title: string;
  mediaType: MediaType;
}
