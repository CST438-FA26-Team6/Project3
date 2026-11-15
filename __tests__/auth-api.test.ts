jest.mock('../src/api/client', () => ({
  apiRequest: jest.fn(),
}));

describe('auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends GitHub authorization code to the backend', async () => {
    const { apiRequest } = require('../src/api/client');
    const { loginWithGitHub } = require('../src/api/auth');

    const authResponse = {
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    };

    apiRequest.mockResolvedValue(authResponse);

    await expect(
      loginWithGitHub(
        'github-code',
        'github-verifier',
        'http://localhost:8081/auth'
      )
    ).resolves.toEqual(authResponse);

    expect(apiRequest).toHaveBeenCalledWith('/auth/github', {
      method: 'POST',
      body: JSON.stringify({
        code: 'github-code',
        codeVerifier: 'github-verifier',
        redirectUri: 'http://localhost:8081/auth',
      }),
    });
  });

  test('sends Google web authorization code to the backend', async () => {
    const { apiRequest } = require('../src/api/client');
    const { loginWithGoogleWeb } = require('../src/api/auth');

    apiRequest.mockResolvedValue({
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    });

    await loginWithGoogleWeb(
      'google-code',
      'google-verifier',
      'http://localhost:8081/auth'
    );

    expect(apiRequest).toHaveBeenCalledWith('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        code: 'google-code',
        codeVerifier: 'google-verifier',
        redirectUri: 'http://localhost:8081/auth',
      }),
    });
  });

  test('sends Google Android ID token to the backend', async () => {
    const { apiRequest } = require('../src/api/client');
    const { loginWithGoogleAndroid } = require('../src/api/auth');

    apiRequest.mockResolvedValue({
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    });

    await loginWithGoogleAndroid('google-id-token');

    expect(apiRequest).toHaveBeenCalledWith('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        idToken: 'google-id-token',
      }),
    });
  });
});