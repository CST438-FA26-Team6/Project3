import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { searchTitles, type TitleTypeFilter } from '../api/titles';
import TitleResultCard from '../components/TitleResultCard';
import type { TitleSearchResult } from '../types/title';

const filters: Array<{ label: string; value: TitleTypeFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Anime', value: 'ANIME' },
  { label: 'Manga', value: 'MANGA' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TitleTypeFilter>('ALL');
  const [results, setResults] = useState<TitleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) {
      setError('Enter a title to search for.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      setResults(await searchTitles(query, filter));
    } catch (requestError) {
      setResults([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to search for titles.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appName}>Anime & Manga Tracker</Text>
        <Text style={styles.subtitle}>Find your next title to track.</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Search Titles</Text>
        <Text style={styles.description}>
          Search the catalog and filter results by media type.
        </Text>

        <TextInput
          accessibilityLabel="Title search"
          autoCapitalize="none"
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          placeholder="Enter an anime or manga title"
          returnKeyType="search"
          style={styles.input}
          value={query}
        />

        <Text style={styles.filterLabel}>Media type</Text>
        <View style={styles.filterRow}>
          {filters.map((option) => {
            const selected = filter === option.value;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={option.value}
                onPress={() => setFilter(option.value)}
                style={[styles.filterButton, selected && styles.selectedFilter]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selected && styles.selectedFilterText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={runSearch}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.pressedButton,
            loading && styles.disabledButton,
          ]}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator
            color="#51427e"
            size="large"
            style={styles.loading}
          />
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Search unavailable</Text>
            <Text style={styles.messageDescription}>{error}</Text>
          </View>
        ) : hasSearched && results.length === 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>No matching titles</Text>
            <Text style={styles.messageDescription}>
              Try another title or select a different media type.
            </Text>
          </View>
        ) : results.length > 0 ? (
          <View style={styles.results}>
            <Text style={styles.resultCount}>
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </Text>
            {results.map((title) => (
              <TitleResultCard key={title.id} title={title} />
            ))}
          </View>
        ) : (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Find anime and manga</Text>
            <Text style={styles.messageDescription}>
              Enter a title above to search the catalog.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f6fa',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#292445',
    paddingBottom: 30,
    paddingHorizontal: 24,
    paddingTop: 42,
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
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d9d6e4',
    borderRadius: 12,
    borderWidth: 1,
    color: '#242038',
    fontSize: 16,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  filterLabel: {
    color: '#444052',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderColor: '#d9d6e4',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  selectedFilter: {
    backgroundColor: '#51427e',
    borderColor: '#51427e',
  },
  filterButtonText: {
    color: '#514d5d',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedFilterText: {
    color: '#ffffff',
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#51427e',
    borderRadius: 12,
    marginTop: 20,
    padding: 14,
  },
  pressedButton: {
    opacity: 0.85,
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 36,
  },
  results: {
    marginTop: 28,
  },
  resultCount: {
    color: '#666477',
    fontSize: 14,
    marginBottom: 12,
  },
  messageBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e5ef',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 28,
    padding: 28,
  },
  messageTitle: {
    color: '#242038',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageDescription: {
    color: '#777487',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
});
