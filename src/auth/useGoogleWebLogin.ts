import { useEffect, useState } from 'react';
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';

import { loginWithGoogleWeb } from '../api/auth';
import { setToken } from './tokenStore';

const redirectUri = makeRedirectUri({
  scheme: 'animemangatracker',
  path: 'auth',
});

export function useGoogleWebLogin(onSuccess: () => void) {
  const [error, setError] = useState<string | null>(null);

  const discovery = useAutoDiscovery('https://accounts.google.com');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      scopes: ['openid', 'email', 'profile'],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type !== 'success' || !request) {
      return;
    }

    const code = response.params.code;

    if (!code || !request.codeVerifier) {
      setError('Google login failed.');
      return;
    }

    async function finishLogin() {
      try {
        setError(null);

        const auth = await loginWithGoogleWeb(
          code,
          request!.codeVerifier!,
          redirectUri
        );

        await setToken(auth.token);
        onSuccess();
      } catch {
        setError('Google login failed.');
      }
    }

    finishLogin();
  }, [response, request, onSuccess]);

  async function signIn() {
    setError(null);
    await promptAsync();
  }

  return {
    signIn,
    ready: request !== null,
    error,
  };
}