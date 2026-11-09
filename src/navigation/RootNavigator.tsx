import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import type { LibraryEntry } from '../types/library';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

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

function HomeRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <HomeScreen
      entries={sampleLibrary}
      isPreview
      onSearch={() => navigation.navigate('SearchTitles')}
    />
  );
}

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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={HomeRoute}
        />
        <Stack.Screen
          name="SearchTitles"
          component={SearchTitlesRoute}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
