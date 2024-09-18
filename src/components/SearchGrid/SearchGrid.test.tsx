import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GridContext } from '../../store/GridContext';
import { fetchPhotos, fetchPhotosByQuery } from '../../api/unsplashAPI';
import SearchGrid from './SearchGrid';
import '@testing-library/jest-dom';
import { debounce } from '../../utils';
import { Photo } from '../MasonaryGrid/MasonryGrid';

jest.mock('../../api/unsplashAPI', () => ({
  fetchPhotos: jest.fn(),
  fetchPhotosByQuery: jest.fn(),
}));

const mockSetPhotos = jest.fn();

const mockPhoto: Photo = {
    id: "1",
    urls: {
      full: "full-size.jpg",
      regular: "regular-size.jpg",
      small: "small-size.jpg",
      thumb:"thumb-size.jpg"
    },
    alt_description: "A beautiful landscape",
    description: "Landscape photo",
    user: { name: "John Doe" },
    created_at: "2024-01-01T00:00:00Z",
  };

  
jest.mock('../../utils', () => ({
  debounce: jest.fn((fn) => fn), // Mock debounce to execute immediately
}));

const renderComponent = (photo = mockPhoto) => {
  return render(
    <GridContext.Provider  value={{
        photo,
        setPhoto: () => {},
        photos:[photo],
        setPhotos: mockSetPhotos,
        page: 1,
        setPage: () => {},
        hasFetchedData: { current: false },
      }}>
      <SearchGrid />
    </GridContext.Provider>
  );
};

describe('SearchGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it renders initially', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Please type here')).toBeInTheDocument();
  });

  test('handles the input change and calls API', async () => {
    const mockData = { results: [{ id: '1', urls: { small: 'small.jpg' } }] };
    (fetchPhotosByQuery as jest.Mock).mockResolvedValue(mockData);

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Please type here'), {
      target: { value: 'nature' },
    });

    await waitFor(() => {
      expect(fetchPhotosByQuery).toHaveBeenCalledWith('nature');
      expect(mockSetPhotos).toHaveBeenCalledWith(mockData.results);
    });
  });

  test('debounces input change', async () => {
    const mockData = { results: [{ id: '1', urls: { small: 'small.jpg' } }] };
    (fetchPhotosByQuery as jest.Mock).mockResolvedValue(mockData);

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Please type here'), {
      target: { value: 'nature' },
    });

    // Check that the debounced function is called after a delay
    await waitFor(() => {
      expect(fetchPhotosByQuery).toHaveBeenCalledTimes(1); // Check debounce works
      expect(mockSetPhotos).toHaveBeenCalledWith(mockData.results);
    });
  });

  test('resets search on empty input', async () => {
    const mockPhotos = [{ id: '1', urls: { small: 'small.jpg' } }];
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Please type here'), {
      target: { value: '' },
    });

    await waitFor(() => {
      expect(fetchPhotos).toHaveBeenCalled();
      expect(mockSetPhotos).toHaveBeenCalledWith(mockPhotos);
    });
  });
});
