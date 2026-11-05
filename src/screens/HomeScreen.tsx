
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LibraryEntryCard from '../components/LibraryEntryCard';
import type { LibraryEntry } from '../types/library';

// Information passed into the Home Screen.
interface Props {
  entries: LibraryEntry[];
  loading?: boolean;
  error?: string | null;

  // TEMPORARY: Remove the preview flag after connecting the real API.
  isPreview?: boolean;
}

// Displays the user's personal anime and manga library.
export default function HomeScreen({
  entries,
  loading = false,
  error = null,
  isPreview = false,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* App title and description. */}
      <View style={styles.header}>
        <Text style={styles.appName}>
          Anime & Manga Tracker
        </Text>
        <Text style={styles.subtitle}>
          Keep track of what you watch and read.
        </Text>
      </View>

      {/* Scrollable library content. */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>My Library</Text>

        <Text style={styles.description}>
          Track your anime and manga collection.
        </Text>

        {/* TEMPORARY: Preview notice for sample data only. */}
        {isPreview && (
          <Text style={styles.previewNotice}>
            Preview: displaying sample library entries.
          </Text>
        )}

        {/* Show loading, error, empty, or populated library. */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#51427e"
            style={styles.loading}
          />
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>
              Unable to load your library
            </Text>
            <Text style={styles.messageDescription}>
              {error}
            </Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.messageTitle}>
              Your library is empty
            </Text>
            <Text style={styles.messageDescription}>
              Add anime or manga to your library to start
              tracking your progress, status, and ratings.
            </Text>
          </View>
        ) : (
          <View style={styles.libraryList}>
            {/* Display how many titles are in the library. */}
            <Text style={styles.entryCount}>
              {entries.length}{' '}
              {entries.length === 1 ? 'title' : 'titles'}
            </Text>

            {/* Create a card for each library entry. */}
            {entries.map((entry) => (
              <LibraryEntryCard
                key={entry.id}
                entry={entry}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the Home Screen.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#292445',
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 30,
    alignItems: 'center',
  },
  appName: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#d6d1ee',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  heading: {
    color: '#242038',
    fontSize: 25,
    fontWeight: 'bold',
  },
  description: {
    color: '#666477',
    fontSize: 15,
    marginTop: 8,
  },
  previewNotice: {
    color: '#775c28',
    backgroundColor: '#fff3d6',
    padding: 12,
    borderRadius: 8,
    marginTop: 18,
    fontSize: 13,
  },
  libraryList: {
    marginTop: 22,
  },
  entryCount: {
    color: '#666477',
    fontSize: 14,
    marginBottom: 12,
  },
  loading: {
    marginTop: 40,
  },
  messageBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#e7e5ef',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  messageTitle: {
    color: '#242038',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageDescription: {
    color: '#777487',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  },
});
