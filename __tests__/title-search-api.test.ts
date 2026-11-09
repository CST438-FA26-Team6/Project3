describe('title search API', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8080';
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('builds a search path with an encoded query', () => {
    const { buildTitleSearchPath } = require('../src/api/titles');

    expect(buildTitleSearchPath('Fullmetal Alchemist')).toBe(
      '/api/titles?query=Fullmetal%20Alchemist'
    );
  });

  test('adds an optional media type filter', () => {
    const { buildTitleSearchPath } = require('../src/api/titles');

    expect(buildTitleSearchPath('Berserk', 'MANGA')).toBe(
      '/api/titles?query=Berserk&type=MANGA'
    );
  });

  test('rejects an empty search query', () => {
    const { buildTitleSearchPath } = require('../src/api/titles');

    expect(() => buildTitleSearchPath('   ')).toThrow(
      'Enter a title to search for.'
    );
  });

  test('returns title results from the backend', async () => {
    const titles = [
      { id: 1, title: 'Cowboy Bebop', mediaType: 'ANIME' },
    ];
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(titles),
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { searchTitles } = require('../src/api/titles');

    await expect(searchTitles('Cowboy Bebop', 'ANIME')).resolves.toEqual(
      titles
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/titles?query=Cowboy%20Bebop&type=ANIME',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });
});
