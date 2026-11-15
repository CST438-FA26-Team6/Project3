jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    getTokens: jest.fn(),
  },
}));

jest.mock('../src/api/auth', () => ({
  loginWithGoogleAndroid: jest.fn(),
}));

jest.mock('../src/auth/tokenStore', () => ({
  setToken: jest.fn(),
}));

describe('Google Android authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID =
      'test-web-client-id';
  });

  test('configures Google Sign-In with the web client ID', () => {
    const { GoogleSignin } = require(
      '@react-native-google-signin/google-signin'
    );

    require('../src/auth/googleAndroid');

    expect(GoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: 'test-web-client-id',
    });
  });

  test('signs in with Google and stores the app JWT', async () => {
    const { GoogleSignin } = require(
      '@react-native-google-signin/google-signin'
    );
    const {
      loginWithGoogleAndroid,
    } = require('../src/api/auth');
    const { setToken } = require('../src/auth/tokenStore');

    GoogleSignin.hasPlayServices.mockResolvedValue(true);
    GoogleSignin.signIn.mockResolvedValue({});
    GoogleSignin.getTokens.mockResolvedValue({
      idToken: 'google-id-token',
    });

    loginWithGoogleAndroid.mockResolvedValue({
      token: 'app-jwt',
      user: {
        id: 'user-1',
        username: 'test-user',
        email: 'test@example.com',
        role: 'USER',
      },
    });

    const {
      signInWithGoogleAndroid,
    } = require('../src/auth/googleAndroid');

    await signInWithGoogleAndroid();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(GoogleSignin.signIn).toHaveBeenCalled();
    expect(GoogleSignin.getTokens).toHaveBeenCalled();

    expect(loginWithGoogleAndroid).toHaveBeenCalledWith(
      'google-id-token'
    );

    expect(setToken).toHaveBeenCalledWith('app-jwt');
  });

  test('throws when Google does not return an ID token', async () => {
    const { GoogleSignin } = require(
      '@react-native-google-signin/google-signin'
    );

    GoogleSignin.hasPlayServices.mockResolvedValue(true);
    GoogleSignin.signIn.mockResolvedValue({});
    GoogleSignin.getTokens.mockResolvedValue({
      idToken: null,
    });

    const {
      signInWithGoogleAndroid,
    } = require('../src/auth/googleAndroid');

    await expect(signInWithGoogleAndroid()).rejects.toThrow(
      'Google did not return an ID token.'
    );
  });
});