
import React from 'react';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';

import EditLibraryScreen from '../src/screens/EditLibraryScreen';
import type { LibraryEntry } from '../src/types/library';

// TEMPORARY: Sample entries used only for Issue #15 tests.
const sampleAnime: LibraryEntry = {
  id: 1,
  title: 'Sample Anime',
  mediaType: 'ANIME',
  status: 'WATCHING',
  progress: 8,
  total: 12,
  rating: 8,
};

const sampleManga: LibraryEntry = {
  id: 2,
  title: 'Sample Manga',
  mediaType: 'MANGA',
  status: 'READING',
  progress: 15,
  total: 40,
  rating: 9,
};

describe('Edit Library Screen', () => {
  const mockSave = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays the selected anime entry', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    expect(screen.getByText('Edit Library Entry')).toBeTruthy();
    expect(screen.getByText('Sample Anime')).toBeTruthy();
    expect(screen.getByText('Anime')).toBeTruthy();

    expect(
      screen.getByLabelText('Episodes progress').props.value
    ).toBe('8');

    expect(
      screen.getByLabelText('Rating').props.value
    ).toBe('8');

    expect(
      screen.getByRole('button', {
        name: 'Set status to Watching',
      }).props.accessibilityState.selected
    ).toBe(true);
  });

  test('saves valid status, progress, and rating changes', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Set status to Completed',
      })
    );

    await fireEvent.changeText(
      screen.getByLabelText('Episodes progress'),
      '10'
    );

    await fireEvent.changeText(
      screen.getByLabelText('Rating'),
      '9'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith({
      ...sampleAnime,
      status: 'COMPLETED',
      progress: 10,
      rating: 9,
    });
  });

  test('rejects progress greater than the total', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Episodes progress'),
      '13'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(
      screen.getByText('Progress cannot exceed 12 episodes.')
    ).toBeTruthy();

    expect(mockSave).not.toHaveBeenCalled();
  });

  test('rejects negative progress', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Episodes progress'),
      '-1'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(
      screen.getByText(
        'Progress must be a whole number of 0 or greater.'
      )
    ).toBeTruthy();

    expect(mockSave).not.toHaveBeenCalled();
  });

  test('rejects decimal progress', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Episodes progress'),
      '4.5'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(
      screen.getByText(
        'Progress must be a whole number of 0 or greater.'
      )
    ).toBeTruthy();

    expect(mockSave).not.toHaveBeenCalled();
  });

  test('rejects ratings greater than 10', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Rating'),
      '11'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(
      screen.getByText(
        'Rating must be a whole number from 0 to 10.'
      )
    ).toBeTruthy();

    expect(mockSave).not.toHaveBeenCalled();
  });

  test('allows an entry to be left unrated', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Rating'),
      ''
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Save Changes (Preview)',
      })
    );

    expect(mockSave).toHaveBeenCalledWith({
      ...sampleAnime,
      rating: null,
    });
  });

  test('cancels editing without saving', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    await fireEvent.changeText(
      screen.getByLabelText('Episodes progress'),
      '10'
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Cancel',
      })
    );

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockSave).not.toHaveBeenCalled();
  });

  test('shows only anime-compatible statuses', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleAnime}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    expect(
      screen.getByRole('button', {
        name: 'Set status to Watching',
      })
    ).toBeTruthy();

    expect(
      screen.getByRole('button', {
        name: 'Set status to Plan to Watch',
      })
    ).toBeTruthy();

    expect(
      screen.queryByRole('button', {
        name: 'Set status to Reading',
      })
    ).toBeNull();

    expect(
      screen.queryByRole('button', {
        name: 'Set status to Plan to Read',
      })
    ).toBeNull();
  });

  test('shows only manga-compatible statuses', async () => {
    await render(
      <EditLibraryScreen
        entry={sampleManga}
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    expect(
      screen.getByRole('button', {
        name: 'Set status to Reading',
      })
    ).toBeTruthy();

    expect(
      screen.getByRole('button', {
        name: 'Set status to Plan to Read',
      })
    ).toBeTruthy();

    expect(
      screen.queryByRole('button', {
        name: 'Set status to Watching',
      })
    ).toBeNull();

    expect(
      screen.queryByRole('button', {
        name: 'Set status to Plan to Watch',
      })
    ).toBeNull();
  });

  test('shows an error when the entry is missing', async () => {
    await render(
      <EditLibraryScreen
        onBack={mockBack}
        onSave={mockSave}
      />
    );

    expect(
      screen.getByText('Library entry not found')
    ).toBeTruthy();

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Back to Library',
      })
    );

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockSave).not.toHaveBeenCalled();
  });
});
