
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
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

import type { LibraryEntry, LibraryStatus } from '../types/library';

interface Props {
  entry?: LibraryEntry;
  onBack: () => void;

  // The parent screen handles saving to the backend.
  onSave: (updatedEntry: LibraryEntry) => void | Promise<void>;
}

const statusLabels: Record<LibraryStatus, string> = {
  WATCHING: 'Watching',
  READING: 'Reading',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
  PLAN_TO_WATCH: 'Plan to Watch',
  PLAN_TO_READ: 'Plan to Read',
};

// Show only the tracking statuses that fit this title.
function getStatusOptions(
  mediaType: LibraryEntry['mediaType']
): LibraryStatus[] {
  if (mediaType === 'ANIME') {
    return [
      'WATCHING',
      'COMPLETED',
      'ON_HOLD',
      'DROPPED',
      'PLAN_TO_WATCH',
    ];
  }

  return [
    'READING',
    'COMPLETED',
    'ON_HOLD',
    'DROPPED',
    'PLAN_TO_READ',
  ];
}

export default function EditLibraryScreen({
  entry,
  onBack,
  onSave,
}: Props) {
  const [status, setStatus] = useState<LibraryStatus>(
    entry?.status ?? 'WATCHING'
  );

  const [progress, setProgress] = useState(
    String(entry?.progress ?? 0)
  );

  const [rating, setRating] = useState(
    entry?.rating == null ? '' : String(entry.rating)
  );

  const [error, setError] = useState<string | null>(null);

  // Prevent the user from submitting the same update twice.
  const [isSaving, setIsSaving] = useState(false);

  const progressUnit =
    entry?.mediaType === 'MANGA' ? 'Chapters' : 'Episodes';

  const availableStatuses = entry
    ? getStatusOptions(entry.mediaType)
    : [];

  async function handleSave() {
    if (!entry || isSaving) {
      return;
    }

    setError(null);

    const progressText = progress.trim();
    const ratingText = rating.trim();

    // Progress must be a whole number of zero or greater.
    if (!/^\d+$/.test(progressText)) {
      setError('Progress must be a whole number of 0 or greater.');
      return;
    }

    const newProgress = Number(progressText);

    if (!Number.isSafeInteger(newProgress)) {
      setError('Enter a valid progress number.');
      return;
    }

    // Do not allow progress beyond the title's total.
    if (entry.total !== null && newProgress > entry.total) {
      setError(
        `Progress cannot exceed ${entry.total} ${progressUnit.toLowerCase()}.`
      );
      return;
    }

    // An empty rating means the user has not rated the title.
    let newRating: number | null = null;

    if (ratingText !== '') {
      if (!/^\d+$/.test(ratingText)) {
        setError('Rating must be a whole number from 0 to 10.');
        return;
      }

      newRating = Number(ratingText);

      // TEMPORARY: Confirm the rating scale with the backend.
      if (!Number.isSafeInteger(newRating) || newRating > 10) {
        setError('Rating must be a whole number from 0 to 10.');
        return;
      }
    }

    if (!availableStatuses.includes(status)) {
      setError('Select a valid tracking status.');
      return;
    }

    // Wait for the save request before showing saved changes.
    setIsSaving(true);

    try {
      await onSave({
        ...entry,
        status,
        progress: newProgress,
        rating: newRating,
      });
    } catch (saveError) {
      // Keep the user on this screen when saving fails.
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save changes. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>
            Library entry not found
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              Back to Library
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appName}>
          Anime &amp; Manga Tracker
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Back to Library
          </Text>
        </Pressable>

        <Text style={styles.heading}>
          Edit Library Entry
        </Text>

        <Text style={styles.description}>
          Update your tracking status, progress, and rating.
        </Text>

        <View style={styles.form}>
          <Text style={styles.title}>{entry.title}</Text>

          <Text style={styles.mediaType}>
            {entry.mediaType === 'ANIME' ? 'Anime' : 'Manga'}
          </Text>

          {/* This notice stays until the backend is connected. */}
          <Text style={styles.previewNotice}>
            Backend saving is being integrated.
            The update endpoint is not available yet.
          </Text>

          <Text style={styles.sectionHeading}>
            Tracking Status
          </Text>

          <View style={styles.statusList}>
            {availableStatuses.map((option) => {
              const isSelected = status === option;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Set status to ${statusLabels[option]}`}
                  accessibilityState={{
                    selected: isSelected,
                    disabled: isSaving,
                  }}
                  disabled={isSaving}
                  onPress={() => {
                    setStatus(option);
                    setError(null);
                  }}
                  style={({ pressed }) => [
                    styles.statusButton,
                    isSelected && styles.selectedStatusButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      isSelected &&
                        styles.selectedStatusButtonText,
                    ]}
                  >
                    {statusLabels[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionHeading}>
            {progressUnit} Progress
          </Text>

          <Text style={styles.fieldDescription}>
            {entry.total === null
              ? `Enter how many ${progressUnit.toLowerCase()} you have completed.`
              : `Enter a number from 0 to ${entry.total}.`}
          </Text>

          <TextInput
            accessibilityLabel={`${progressUnit} progress`}
            value={progress}
            editable={!isSaving}
            onChangeText={(value) => {
              setProgress(value);
              setError(null);
            }}
            keyboardType="number-pad"
            placeholder="0"
            style={styles.input}
          />

          <Text style={styles.sectionHeading}>
            Rating
          </Text>

          <Text style={styles.fieldDescription}>
            TEMPORARY: Enter a whole number from 0 to 10,
            or leave blank for Not rated.
          </Text>

          <TextInput
            accessibilityLabel="Rating"
            value={rating}
            editable={!isSaving}
            onChangeText={(value) => {
              setRating(value);
              setError(null);
            }}
            keyboardType="number-pad"
            placeholder="Not rated"
            style={styles.input}
          />

          {/* Show validation or backend errors here. */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving }}
            disabled={isSaving}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton,
              isSaving && styles.disabledButton,
            ]}
          >
            {isSaving ? (
              <View style={styles.savingRow}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.primaryButtonText}>
                  Saving...
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>
                Save Changes (Preview)
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={onBack}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 22,
  },
  backButtonText: {
    color: '#51427e',
    fontSize: 15,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5ef',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
  },
  title: {
    color: '#242038',
    fontSize: 21,
    fontWeight: 'bold',
  },
  mediaType: {
    color: '#746b94',
    fontSize: 14,
    marginTop: 8,
  },
  previewNotice: {
    color: '#775c28',
    backgroundColor: '#fff3d6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeading: {
    color: '#242038',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },
  fieldDescription: {
    color: '#666477',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  statusList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d3e6',
  },
  selectedStatusButton: {
    backgroundColor: '#51427e',
    borderColor: '#51427e',
  },
  statusButtonText: {
    color: '#51427e',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedStatusButtonText: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d8d3e6',
    borderWidth: 1,
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: '#242038',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 22,
  },
  errorText: {
    color: '#a32323',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#51427e',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#51427e',
    fontSize: 15,
    fontWeight: 'bold',
  },
  pressedButton: {
    opacity: 0.85,
  },
});
