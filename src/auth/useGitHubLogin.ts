import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';

import { loginWithGitHub } from '../api/auth';
import { setToken } from './tokenStore';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

const redirectUri = makeRedirectUri({
  scheme: 'animemangatracker',
  path: 'auth',
});

export function useGitHubLogin(onSuccess: () => void) {
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ['read:user', 'user:email'],
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
      setError('GitHub login failed.');
      return;
    }

    async function finishLogin() {
      try {
        setError(null);

        const auth = await loginWithGitHub(
          code,
          request!.codeVerifier!,
          redirectUri
        );

        await setToken(auth.token);
        onSuccess();
      } catch {
        setError('GitHub login failed.');
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