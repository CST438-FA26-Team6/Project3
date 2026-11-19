
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  LibraryEntry,
  LibraryStatus,
} from '../types/library';

interface Props {
  entry: LibraryEntry;

  // Optional callback to open the Edit Library Screen.
  onEdit?: (entryId: number) => void;
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

// Displays a single anime or manga entry in the library.
export default function LibraryEntryCard({
  entry,
  onEdit,
}: Props) {
  const progressUnit =
    entry.mediaType === 'ANIME' ? 'episodes' : 'chapters';

  const progressText =
    entry.total === null
      ? `${entry.progress} ${progressUnit}`
      : `${entry.progress} / ${entry.total} ${progressUnit}`;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>
          {entry.title}
        </Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {statusLabels[entry.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.mediaType}>
        {entry.mediaType === 'ANIME' ? 'Anime' : 'Manga'}
      </Text>

      <Text style={styles.detail}>
        Progress: {progressText}
      </Text>

      {/* TEMPORARY: Rating scale assumed to be 0-10. */}
      <Text style={styles.detail}>
        Rating: {entry.rating === null
          ? 'Not rated'
          : `${entry.rating} / 10`}
      </Text>

      {/* Display the Edit button when navigation is available. */}
      {onEdit && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${entry.title}`}
          onPress={() => onEdit(entry.id)}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.editButtonText}>
            Edit Entry
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e7e5ef',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    color: '#242038',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: '#e9e5f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: '#51427e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mediaType: {
    color: '#746b94',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 10,
  },
  detail: {
    color: '#666477',
    fontSize: 14,
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#51427e',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 18,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressedButton: {
    opacity: 0.85,
  },
});
