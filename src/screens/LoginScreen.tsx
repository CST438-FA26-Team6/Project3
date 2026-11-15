import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { signInWithGoogleAndroid } from '../auth/googleAndroid';
import { useGitHubLogin } from '../auth/useGitHubLogin';
import { useGoogleWebLogin } from '../auth/useGoogleWebLogin';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [loadingProvider, setLoadingProvider] = useState<
    'github' | 'google' | null
  >(null);

  const [screenError, setScreenError] = useState<string | null>(null);

  const handleSuccess = useCallback(() => {
    setLoadingProvider(null);
    setScreenError(null);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const github = useGitHubLogin(handleSuccess);
  const googleWeb = useGoogleWebLogin(handleSuccess);

  async function handleGitHubLogin() {
    try {
      setScreenError(null);
      setLoadingProvider('github');
      await github.signIn();
    } catch {
      setLoadingProvider(null);
      setScreenError('GitHub login failed.');
    }
  }

  async function handleGoogleLogin() {
    try {
      setScreenError(null);
      setLoadingProvider('google');

      if (Platform.OS === 'web') {
        await googleWeb.signIn();
        return;
      }

      await signInWithGoogleAndroid();
      handleSuccess();
    } catch {
      setLoadingProvider(null);
      setScreenError('Google login failed.');
    }
  }

  const error = screenError ?? github.error ?? googleWeb.error;
  const isLoading = loadingProvider !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Anime & Manga Tracker</Text>

          <Text style={styles.signIn}>Sign in</Text>

          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="GitHub"
              disabled={!github.ready || isLoading}
              onPress={handleGitHubLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressedButton,
                (!github.ready || isLoading) && styles.disabledButton,
              ]}
            >
              {loadingProvider === 'github' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Image
                    source={require('../../assets/github-icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>GitHub</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Google"
              disabled={
                isLoading ||
                (Platform.OS === 'web' && !googleWeb.ready)
              }
              onPress={handleGoogleLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressedButton,
                (isLoading ||
                  (Platform.OS === 'web' && !googleWeb.ready)) &&
                  styles.disabledButton,
              ]}
            >
              {loadingProvider === 'google' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Image
                    source={require('../../assets/google-icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Google</Text>
                </View>
              )}
            </Pressable>
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {error}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },

  card: {
    width: '100%',
    maxWidth: 400,
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#2f2f2f',
    borderRadius: 18,
    backgroundColor: '#121212',
  },

  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  signIn: {
    marginTop: 16,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  buttons: {
    marginTop: 28,
  },

  button: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    minHeight: 50,
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 10,
    backgroundColor: '#202020',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  pressedButton: {
    backgroundColor: '#2b2b2b',
  },

  disabledButton: {
    opacity: 0.5,
  },

  errorText: {
    marginTop: 8,
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
});