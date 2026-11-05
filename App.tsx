
import HomeScreen from './src/screens/HomeScreen';
import type { LibraryEntry } from './src/types/library';

// TEMPORARY: Sample data for testing the Home Screen.
// Replace this with data from GET /api/library later.
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

// Starts the application and displays the Home Screen.
export default function App() {
  return (
    <HomeScreen
      entries={sampleLibrary}
      // TEMPORARY: Show the sample-data preview notice.
      isPreview={true}
    />
  );
}
