import React from 'react';
import { Platform } from 'react-native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import LoginScreen from '../src/screens/LoginScreen';

const mockGitHubSignIn = jest.fn();
const mockGoogleWebSignIn = jest.fn();
const mockGoogleAndroidSignIn = jest.fn();
const mockReset = jest.fn();

jest.mock('../src/auth/useGitHubLogin', () => ({
  useGitHubLogin: jest.fn(() => ({
    ready: true,
    signIn: mockGitHubSignIn,
    error: null,
  })),
}));

jest.mock('../src/auth/useGoogleWebLogin', () => ({
  useGoogleWebLogin: jest.fn(() => ({
    ready: true,
    signIn: mockGoogleWebSignIn,
    error: null,
  })),
}));

jest.mock('../src/auth/googleAndroid', () => ({
  signInWithGoogleAndroid: () => mockGoogleAndroidSignIn(),
}));

const navigation = {
  reset: mockReset,
} as any;

describe('Login screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGitHubSignIn.mockResolvedValue(undefined);
    mockGoogleWebSignIn.mockResolvedValue(undefined);
    mockGoogleAndroidSignIn.mockResolvedValue(undefined);

    Object.defineProperty(Platform, 'OS', {
      value: 'web',
      configurable: true,
    });
  });

  test('renders GitHub and Google login buttons', async () => {
    await render(<LoginScreen navigation={navigation} route={{} as any} />);

    expect(screen.getByRole('button', { name: 'GitHub' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Google' })).toBeTruthy();
    expect(screen.getByText('Anime & Manga Tracker')).toBeTruthy();
    expect(screen.getByText('Sign in')).toBeTruthy();
  });

  test('starts GitHub login when GitHub button is pressed', async () => {
    await render(<LoginScreen navigation={navigation} route={{} as any} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: 'GitHub',
      })
    );

    await waitFor(() => {
      expect(mockGitHubSignIn).toHaveBeenCalledTimes(1);
    });
  });

  test('uses Google web login on web', async () => {
    await render(<LoginScreen navigation={navigation} route={{} as any} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: 'Google',
      })
    );

    await waitFor(() => {
      expect(mockGoogleWebSignIn).toHaveBeenCalledTimes(1);
    });

    expect(mockGoogleAndroidSignIn).not.toHaveBeenCalled();
  });

  test('uses native Google login on Android and navigates home', async () => {
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      configurable: true,
    });

    await render(<LoginScreen navigation={navigation} route={{} as any} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: 'Google',
      })
    );

    await waitFor(() => {
      expect(mockGoogleAndroidSignIn).toHaveBeenCalledTimes(1);
    });

    expect(mockGoogleWebSignIn).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  });
});