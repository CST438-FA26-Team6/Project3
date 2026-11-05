
 // TEMPORARY: These status values must be confirmed with the backend API.
export type LibraryStatus =
  | 'WATCHING'
  | 'READING'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'DROPPED'
  | 'PLAN_TO_WATCH'
  | 'PLAN_TO_READ';

// Identifies whether a title is anime or manga.
export type MediaType = 'ANIME' | 'MANGA';

// TEMPORARY: This interface must match the actual GET /api/library response.
export interface LibraryEntry {
  id: number;
  title: string;
  mediaType: MediaType;
  status: LibraryStatus;
  progress: number;
  total: number | null;
  rating: number | null;
}
