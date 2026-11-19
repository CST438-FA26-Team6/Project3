
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getToken } from '../auth/tokenStore';
import { updateLibraryEntry } from '../api/library';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import EditLibraryScreen from '../screens/EditLibraryScreen';
import type { LibraryEntry } from '../types/library';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TEMPORARY: Sample entries until the real library API is available.
const sampleLibrary: LibraryEntry[] = [
  {
    id: 1,
    title: 'Sample Anime',
    mediaType: 'ANIME',
    status: 'WATCHING',
    progress: 8,
    total: 12,
    rating: 8,
  },
  {
    id: 2,
    title: 'Sample Manga',
    mediaType: 'MANGA',
    status: 'READING',
    progress: 15,
    total: 40,
    rating: 9,
  },
  {
    id: 3,
    title: 'Completed Anime Example',
    mediaType: 'ANIME',
    status: 'COMPLETED',
    progress: 24,
    total: 24,
    rating: 10,
  },
];

function SearchTitlesRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SearchTitles'>) {
  const returnToLibrary = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return <SearchScreen onBack={returnToLibrary} />;
}

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<
    'Login' | 'Home' | null
  >(null);

  // TEMPORARY: Display sample data until library loading is added.
  const [entries, setEntries] =
    useState<LibraryEntry[]>(sampleLibrary);

  useEffect(() => {
    async function restoreSession() {
      const token = await getToken();

      setInitialRoute(token ? 'Home' : 'Login');
    }

    restoreSession();
  }, []);

  // Save changes through the shared frontend API client.
  async function saveLibraryEntry(
    updatedEntry: LibraryEntry
  ): Promise<void> {
    const savedEntry = await updateLibraryEntry(
      updatedEntry.id,
      {
        status: updatedEntry.status,
        progress: updatedEntry.progress,
        rating: updatedEntry.rating,
      }
    );

    // Only update the screen after the backend confirms the save.
    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === savedEntry.id ? savedEntry : entry
      )
    );
  }

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Keep the existing login screen. */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Display the library and allow users to edit entries. */}
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              entries={entries}
              isPreview
              onSearch={() =>
                navigation.navigate('SearchTitles')
              }
              onEdit={(entryId) =>
                navigation.navigate('EditLibrary', {
                  entryId,
                })
              }
            />
          )}
        </Stack.Screen>

        {/* Keep the existing search screen. */}
        <Stack.Screen
          name="SearchTitles"
          component={SearchTitlesRoute}
        />

        {/* Open the selected library entry for editing. */}
        <Stack.Screen name="EditLibrary">
          {({ route, navigation }) => {
            const selectedEntry = entries.find(
              (entry) => entry.id === route.params.entryId
            );

            return (
              <EditLibraryScreen
                entry={selectedEntry}
                onBack={() => navigation.goBack()}
                onSave={async (updatedEntry) => {
                  // Stay on this screen if the API request fails.
                  await saveLibraryEntry(updatedEntry);

                  // Return to the library after a successful save.
                  navigation.goBack();
                }}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
