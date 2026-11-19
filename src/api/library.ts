
import { apiRequest } from './client';
import type { LibraryEntry } from '../types/library';

// These are the fields a user can change on the Edit Library Screen.
export type UpdateLibraryEntryRequest = Pick<
  LibraryEntry,
  'status' | 'progress' | 'rating'
>;

// Send the edited information to the backend.
// The updated entry is returned only when the request succeeds.
export async function updateLibraryEntry(
  entryId: number,
  changes: UpdateLibraryEntryRequest
): Promise<LibraryEntry> {
  return apiRequest<LibraryEntry>(`/api/library/${entryId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}
