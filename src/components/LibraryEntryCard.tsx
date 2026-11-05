
import { StyleSheet, Text, View } from 'react-native';
import type { LibraryEntry, LibraryStatus } from '../types/library';

// Information passed into the library entry card.
interface Props {
  entry: LibraryEntry;
}

// TEMPORARY: Confirm these labels with the backend status values.
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
export default function LibraryEntryCard({ entry }: Props) {
  // Use episodes for anime and chapters for manga.
  const progressUnit =
    entry.mediaType === 'ANIME' ? 'episodes' : 'chapters';

  // Show the total when it is available.
  const progressText =
    entry.total === null
      ? `${entry.progress} ${progressUnit}`
      : `${entry.progress} / ${entry.total} ${progressUnit}`;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Title of the anime or manga. */}
        <Text style={styles.title}>{entry.title}</Text>

        {/* Current tracking status. */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {statusLabels[entry.status]}
          </Text>
        </View>
      </View>

      {/* Type of media. */}
      <Text style={styles.mediaType}>
        {entry.mediaType === 'ANIME' ? 'Anime' : 'Manga'}
      </Text>

      {/* Episodes watched or chapters read. */}
      <Text style={styles.detail}>
        Progress: {progressText}
      </Text>

      {/* TEMPORARY: Confirm the rating scale with the backend. */}
      <Text style={styles.detail}>
        Rating: {entry.rating === null ? 'Not rated' : `${entry.rating} / 10`}
      </Text>
    </View>
  );
}

// Styles for the library card.
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
});
