
import { apiRequest } from '../src/api/client';
import { updateLibraryEntry } from '../src/api/library';

// Replace the real API client with a mock during tests.
jest.mock('../src/api/client', () => ({
  apiRequest: jest.fn(),
}));

const mockApiRequest = apiRequest as jest.Mock;

describe('Library Entry Update API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends status, progress, and rating changes', async () => {
    const savedEntry = {
      id: 1,
      title: 'Sample Anime',
      mediaType: 'ANIME',
      status: 'COMPLETED',
      progress: 12,
      total: 12,
      rating: 9,
    };

    mockApiRequest.mockResolvedValue(savedEntry);

    const result = await updateLibraryEntry(1, {
      status: 'COMPLETED',
      progress: 12,
      rating: 9,
    });

    // Check that the API receives the correct update request.
    expect(mockApiRequest).toHaveBeenCalledWith(
      '/api/library/1',
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'COMPLETED',
          progress: 12,
          rating: 9,
        }),
      }
    );

    // The saved information must come from the backend response.
    expect(result).toEqual(savedEntry);
  });

  test('reports an error when the backend rejects the update', async () => {
    mockApiRequest.mockRejectedValue(
      new Error('API request failed with status 400')
    );

    // A failed request must not be treated as a successful save.
    await expect(
      updateLibraryEntry(1, {
        status: 'WATCHING',
        progress: 13,
        rating: 8,
      })
    ).rejects.toThrow('API request failed with status 400');
  });
});
