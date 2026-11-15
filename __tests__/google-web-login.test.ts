import { act, renderHook, waitFor } from '@testing-library/react-native';

const mockPromptAsync = jest.fn();
const mockUseAuthRequest = jest.fn();
const mockUseAutoDiscovery = jest.fn();
const mockLoginWithGoogleWeb = jest.fn();
const mockSetToken = jest.fn();
const mockOnSuccess = jest.fn();

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'animemangatracker://auth'),
  useAuthRequest: (...args: unknown[]) => mockUseAuthRequest(...args),
  useAutoDiscovery: (...args: unknown[]) =>
    mockUseAutoDiscovery(...args),
}));

jest.mock('../src/api/auth', () => ({
  loginWithGoogleWeb: (...args: unknown[]) =>
    mockLoginWithGoogleWeb(...args),
}));

jest.mock('../src/auth/tokenStore', () => ({
  setToken: (...args: unknown[]) => mockSetToken(...args),
}));

describe('Google web login hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID =
      'google-web-client-id';

    mockUseAutoDiscovery.mockReturnValue({
      authorizationEndpoint:
        'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    });

    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'google-verifier',
      },
      null,
      mockPromptAsync,
    ]);
  });

  test('configures Google OAuth with PKCE and required scopes', async () => {
    const { useGoogleWebLogin } = require(
      '../src/auth/useGoogleWebLogin'
    );

    const { result } = await renderHook(() =>
      useGoogleWebLogin(mockOnSuccess)
    );

    expect(result.current.ready).toBe(true);

    expect(mockUseAutoDiscovery).toHaveBeenCalledWith(
      'https://accounts.google.com'
    );

    expect(mockUseAuthRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'google-web-client-id',
        scopes: ['openid', 'email', 'profile'],
        redirectUri: 'animemangatracker://auth',
        usePKCE: true,
      }),
      expect.anything()
    );
  });

  test('starts Google sign in when signIn is called', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'opened' });

    const { useGoogleWebLogin } = require(
      '../src/auth/useGoogleWebLogin'
    );

    const { result } = await renderHook(() =>
      useGoogleWebLogin(mockOnSuccess)
    );

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockPromptAsync).toHaveBeenCalledTimes(1);
  });

  test('exchanges successful Google response and stores app JWT', async () => {
    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'google-verifier',
      },
      {
        type: 'success',
        params: {
          code: 'google-code',
        },
      },
      mockPromptAsync,
    ]);

    mockLoginWithGoogleWeb.mockResolvedValue({
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    });

    mockSetToken.mockResolvedValue(undefined);

    const { useGoogleWebLogin } = require(
      '../src/auth/useGoogleWebLogin'
    );

    await renderHook(() =>
      useGoogleWebLogin(mockOnSuccess)
    );

    await waitFor(() => {
      expect(mockLoginWithGoogleWeb).toHaveBeenCalledWith(
        'google-code',
        'google-verifier',
        'animemangatracker://auth'
      );
    });

    expect(mockSetToken).toHaveBeenCalledWith('app-jwt');
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  test('reports an error when Google login fails', async () => {
    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'google-verifier',
      },
      {
        type: 'success',
        params: {
          code: 'google-code',
        },
      },
      mockPromptAsync,
    ]);

    mockLoginWithGoogleWeb.mockRejectedValue(
      new Error('Google failed')
    );

    const { useGoogleWebLogin } = require(
      '../src/auth/useGoogleWebLogin'
    );

    const { result } = await renderHook(() =>
      useGoogleWebLogin(mockOnSuccess)
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Google login failed.');
    });

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});