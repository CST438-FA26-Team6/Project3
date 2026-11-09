describe('API client', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8080';

    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sends request to configured API URL', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { apiRequest } = require('../src/api/client');

    const result = await apiRequest('/api/test');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual({ success: true });
  });

  test('passes request options and headers', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { apiRequest } = require('../src/api/client');

    await apiRequest('/api/test', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({ title: 'Test' }),
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ title: 'Test' }),
      })
    );
  });

  test('throws an error when API request fails', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { apiRequest } = require('../src/api/client');

    await expect(apiRequest('/api/missing')).rejects.toThrow(
      'API request failed with status 404'
    );
  });
});