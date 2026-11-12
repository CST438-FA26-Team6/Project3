
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LibraryEntryCard from '../components/LibraryEntryCard';
import type { LibraryEntry, LibraryStatus } from '../types/library';

// Information passed into the Home Screen.
interface Props {
  entries?: LibraryEntry[];
  loading?: boolean;
  error?: string | null;
  onSearch?: () => void;

  // TEMPORARY: Remove this after connecting the real API.
  isPreview?: boolean;
}

// Each option has a visible label and a library status.
// "ALL" is only used by the filter, not by the backend.
type StatusFilter = 'ALL' | LibraryStatus;

const statusFilters: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Watching', value: 'WATCHING' },
  { label: 'Reading', value: 'READING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Dropped', value: 'DROPPED' },
  { label: 'Plan to Watch', value: 'PLAN_TO_WATCH' },
  { label: 'Plan to Read', value: 'PLAN_TO_READ' },
];

// Displays the user's personal anime and manga library.
export default function HomeScreen({
  entries = [],
  loading = false,
  error = null,
  onSearch,
  isPreview = false,
}: Props) {
  // Keep track of which status the user selected.
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>('ALL');

  // Show all entries or only entries matching the selected status.
  const filteredEntries =
    selectedStatus === 'ALL'
      ? entries
      : entries.filter(
          (entry) => entry.status === selectedStatus
        );

  // Get the label to display when a filter has no results.
  const selectedLabel =
    statusFilters.find(
      (filter) => filter.value === selectedStatus
    )?.label ?? 'Selected';

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

        {/* Keep the existing Search Screen navigation. */}
        {onSearch && (
          <Pressable
            accessibilityRole="button"
            onPress={onSearch}
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.searchButtonText}>
              Search Titles
            </Text>
          </Pressable>
        )}

        {/* TEMPORARY: Preview notice for sample data only. */}
        {isPreview && (
          <Text style={styles.previewNotice}>
            Preview: displaying sample library entries.
          </Text>
        )}

        {/* Allow users to filter library entries by status. */}
        {!loading && !error && (
          <View style={styles.filterSection}>
            <Text style={styles.filterHeading}>
              Filter by Status
            </Text>

            <Text style={styles.filterDescription}>
              Select a status to filter your library.
            </Text>

            {/* Horizontal scrolling supports smaller phone screens. */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            >
              {statusFilters.map((filter) => {
                const isSelected =
                  selectedStatus === filter.value;

                return (
                  <Pressable
                    key={filter.value}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter: ${filter.label}`}
                    accessibilityState={{
                      selected: isSelected,
                    }}
                    onPress={() =>
                      setSelectedStatus(filter.value)
                    }
                    style={({ pressed }) => [
                      styles.filterButton,
                      isSelected && styles.selectedFilterButton,
                      pressed && styles.pressedButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        isSelected &&
                          styles.selectedFilterButtonText,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Show loading, error, empty, or filtered library. */}
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
            <Text style={styles.messageTitle}>
              Your library is empty
            </Text>

            <Text style={styles.messageDescription}>
              Add anime or manga to your library to start
              tracking your progress, status, and ratings.
            </Text>
          </View>
        ) : filteredEntries.length === 0 ? (
          // Show this message if the chosen filter has no matches.
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>
              No matching titles
            </Text>

            <Text style={styles.messageDescription}>
              Your library has no titles with the status
              "{selectedLabel}".
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedStatus('ALL')}
              style={({ pressed }) => [
                styles.showAllButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.showAllButtonText}>
                Show All Titles
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.libraryList}>
            {/* Show how many entries match the selected status. */}
            <Text style={styles.entryCount}>
              {filteredEntries.length}{' '}
              {filteredEntries.length === 1
                ? 'title'
                : 'titles'}
            </Text>

            {/* Display only the matching library cards. */}
            {filteredEntries.map((entry) => (
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
  searchButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#51427e',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  pressedButton: {
    opacity: 0.85,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewNotice: {
    color: '#775c28',
    backgroundColor: '#fff3d6',
    padding: 12,
    borderRadius: 8,
    marginTop: 18,
    fontSize: 13,
  },

  // Library status filtering styles.
  filterSection: {
    marginTop: 24,
  },
  filterHeading: {
    color: '#242038',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterDescription: {
    color: '#666477',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  filterList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderColor: '#d8d3e6',
    borderWidth: 1,
  },
  selectedFilterButton: {
    backgroundColor: '#51427e',
    borderColor: '#51427e',
  },
  filterButtonText: {
    color: '#51427e',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedFilterButtonText: {
    color: '#ffffff',
  },
  showAllButton: {
    marginTop: 20,
    backgroundColor: '#51427e',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  showAllButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Existing library display styles.
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
