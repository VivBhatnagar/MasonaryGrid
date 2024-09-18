const UNSPLASH_API_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_API_KEY;

export const fetchPhotos = async (page: number = 1, perPage: number = 10) => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from Unsplash API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

export const fetchPhotosById = async (id: string) => {
  try {
    const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Unsplash API");
    }

    const selectedPhoto = await response.json();
    return selectedPhoto;
  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
};

export const fetchPhotosByQuery = async (searchTerm: string) => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${searchTerm}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from Unsplash API");
    }

    const photos = await response.json();
    return photos;
  } catch (error) {
    console.error("Error fetching photo:", error);
    return [];
  }
};
