import { StyleSheet, Text, View } from 'react-native';

import type { TitleSearchResult } from '../types/title';

interface Props {
  title: TitleSearchResult;
}

export default function TitleResultCard({ title }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title.title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {title.mediaType === 'ANIME' ? 'Anime' : 'Manga'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e5ef',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 18,
  },
  title: {
    color: '#242038',
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#e9e5f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#51427e',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
