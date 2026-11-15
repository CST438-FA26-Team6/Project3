import { apiRequest } from './client';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function loginWithGitHub(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/github', {
    method: 'POST',
    body: JSON.stringify({
      code,
      codeVerifier,
      redirectUri,
    }),
  });
}

export function loginWithGoogleWeb(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      code,
      codeVerifier,
      redirectUri,
    }),
  });
}

export function loginWithGoogleAndroid(
  idToken: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      idToken,
    }),
  });
}