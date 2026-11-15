jest.mock('../src/auth/tokenStore', () => ({
  getToken: jest.fn().mockResolvedValue(null),
  clearToken: jest.fn().mockResolvedValue(undefined),
}));

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
        headers: expect.any(Headers),
      })
    );

    const [, options] = (globalThis.fetch as jest.Mock).mock.calls[0];

    expect(options.headers.get('Content-Type')).toBe('application/json');

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

    const [, options] = (globalThis.fetch as jest.Mock).mock.calls[0];

    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ title: 'Test' }));
    expect(options.headers.get('Content-Type')).toBe('application/json');
    expect(options.headers.get('Authorization')).toBe(
      'Bearer test-token'
    );
  });

  test('adds stored JWT to authorization header', async () => {
    const { getToken } = require('../src/auth/tokenStore');

    getToken.mockResolvedValue('stored-app-jwt');

    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { apiRequest } = require('../src/api/client');

    await apiRequest('/api/test');

    const [, options] = (globalThis.fetch as jest.Mock).mock.calls[0];

    expect(options.headers.get('Authorization')).toBe(
      'Bearer stored-app-jwt'
    );
  });

  test('clears stored token when API returns 401', async () => {
    const { clearToken } = require('../src/auth/tokenStore');

    const mockResponse = {
      ok: false,
      status: 401,
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { apiRequest } = require('../src/api/client');

    await expect(apiRequest('/api/protected')).rejects.toThrow(
      'API request failed with status 401'
    );

    expect(clearToken).toHaveBeenCalledTimes(1);
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