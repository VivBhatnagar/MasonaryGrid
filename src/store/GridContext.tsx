import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchPhotos } from "../api/unsplashAPI";
import { Photo } from "../components/MasonaryGrid/MasonryGrid";
import { useLocation } from "react-router-dom";

interface GridContextType {
  photos: Photo[];
  setPhotos: Dispatch<SetStateAction<Photo[]>>;
  photo: Photo;
  setPhoto: Dispatch<SetStateAction<Photo>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasFetchedData: MutableRefObject<boolean>;
  perPage: number;
}

const GridContext = createContext<GridContextType>({
  photo: {
    id: "",
    urls: {
      regular: "",
      small: "",
      full: "",
      thumb: "",
    },
    alt_description: "",
    user: {
      name: "",
    },
    description: "",
    created_at: "",
  },
  setPhoto: () => {},
  photos: [],
  setPhotos: () => {},
  page: 1,
  setPage: () => {},
  hasFetchedData: { current: false },
  perPage: 10,
});

interface GridContextProviderProps {
  children: ReactNode;
}

const GridContextProvider: React.FC<GridContextProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photo, setPhoto] = useState<Photo>({
    id: "",
    urls: {
      regular: "",
      small: "",
      full: "",
      thumb: "",
    },
    alt_description: "",
    user: {
      name: "",
    },
    description: "",
    created_at: "",
  });
  const [page, setPage] = useState(1);
  const hasFetchedData = useRef(false); // To avoid duplicate API call
  const imagesPerRow = Math.floor(window.innerWidth / 200);
  const rowsPerPage = Math.floor(window.innerHeight / 300);
  const perPage = imagesPerRow * rowsPerPage;

  useEffect(() => {
    if (hasFetchedData.current || location.pathname !== "/") {
      return; // Prevent duplicate call in strict mode
    }
    hasFetchedData.current = true; // Mark as fetched
    const loadPhotos = async () => {
      const newPhotos = await fetchPhotos(page, perPage);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    };
    loadPhotos();
  }, [page, perPage, location]);

  return (
    <GridContext.Provider
      value={{
        photo,
        setPhoto,
        photos,
        setPhotos,
        page,
        setPage,
        hasFetchedData,
        perPage,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export { GridContext, GridContextProvider };
