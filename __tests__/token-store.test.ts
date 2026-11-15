const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: jest.fn((key: string) => storage[key] ?? null),
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete storage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('token store', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('stores a token on web', async () => {
    const { setToken } = require('../src/auth/tokenStore');

    await setToken('test-jwt');

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'app_jwt',
      'test-jwt'
    );
  });

  test('gets a stored token on web', async () => {
    storage.app_jwt = 'stored-jwt';

    const { getToken } = require('../src/auth/tokenStore');

    await expect(getToken()).resolves.toBe('stored-jwt');

    expect(localStorageMock.getItem).toHaveBeenCalledWith('app_jwt');
  });

  test('returns null when no token exists on web', async () => {
    const { getToken } = require('../src/auth/tokenStore');

    await expect(getToken()).resolves.toBeNull();
  });

  test('clears a stored token on web', async () => {
    storage.app_jwt = 'stored-jwt';

    const { clearToken } = require('../src/auth/tokenStore');

    await clearToken();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('app_jwt');
    expect(storage.app_jwt).toBeUndefined();
  });
});