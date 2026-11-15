import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { loginWithGoogleAndroid } from '../api/auth';
import { setToken } from './tokenStore';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogleAndroid(): Promise<void> {
  await GoogleSignin.hasPlayServices();

  await GoogleSignin.signIn();

  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error('Google did not return an ID token.');
  }

  const auth = await loginWithGoogleAndroid(idToken);

  await setToken(auth.token);
}