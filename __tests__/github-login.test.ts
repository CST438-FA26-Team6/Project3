import { act, renderHook, waitFor } from '@testing-library/react-native';

const mockPromptAsync = jest.fn();
const mockUseAuthRequest = jest.fn();
const mockLoginWithGitHub = jest.fn();
const mockSetToken = jest.fn();
const mockOnSuccess = jest.fn();

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'animemangatracker://auth'),
  useAuthRequest: (...args: unknown[]) => mockUseAuthRequest(...args),
}));

jest.mock('../src/api/auth', () => ({
  loginWithGitHub: (...args: unknown[]) => mockLoginWithGitHub(...args),
}));

jest.mock('../src/auth/tokenStore', () => ({
  setToken: (...args: unknown[]) => mockSetToken(...args),
}));

describe('GitHub login hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID = 'github-client-id';

    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'github-verifier',
      },
      null,
      mockPromptAsync,
    ]);
  });

  test('configures GitHub OAuth with PKCE and required scopes', async () => {
    const { useGitHubLogin } = require('../src/auth/useGitHubLogin');

    const { result } = await renderHook(() =>
      useGitHubLogin(mockOnSuccess)
    );

    expect(result.current.ready).toBe(true);

    expect(mockUseAuthRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'github-client-id',
        scopes: ['read:user', 'user:email'],
        redirectUri: 'animemangatracker://auth',
        usePKCE: true,
      }),
      expect.objectContaining({
        authorizationEndpoint:
          'https://github.com/login/oauth/authorize',
        tokenEndpoint:
          'https://github.com/login/oauth/access_token',
      })
    );
  });

  test('starts GitHub sign in when signIn is called', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'opened' });

    const { useGitHubLogin } = require('../src/auth/useGitHubLogin');

    const { result } = await renderHook(() =>
      useGitHubLogin(mockOnSuccess)
    );

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockPromptAsync).toHaveBeenCalledTimes(1);
  });

  test('exchanges successful GitHub response and stores app JWT', async () => {
    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'github-verifier',
      },
      {
        type: 'success',
        params: {
          code: 'github-code',
        },
      },
      mockPromptAsync,
    ]);

    mockLoginWithGitHub.mockResolvedValue({
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    });

    mockSetToken.mockResolvedValue(undefined);

    const { useGitHubLogin } = require('../src/auth/useGitHubLogin');

    await renderHook(() =>
      useGitHubLogin(mockOnSuccess)
    );

    await waitFor(() => {
      expect(mockLoginWithGitHub).toHaveBeenCalledWith(
        'github-code',
        'github-verifier',
        'animemangatracker://auth'
      );
    });

    expect(mockSetToken).toHaveBeenCalledWith('app-jwt');

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  test('reports an error when GitHub login fails', async () => {
    mockUseAuthRequest.mockReturnValue([
      {
        codeVerifier: 'github-verifier',
      },
      {
        type: 'success',
        params: {
          code: 'github-code',
        },
      },
      mockPromptAsync,
    ]);

    mockLoginWithGitHub.mockRejectedValue(
      new Error('GitHub failed')
    );

    const { useGitHubLogin } = require('../src/auth/useGitHubLogin');

    const { result } = await renderHook(() =>
      useGitHubLogin(mockOnSuccess)
    );

    await waitFor(() => {
      expect(result.current.error).toBe('GitHub login failed.');
    });

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});