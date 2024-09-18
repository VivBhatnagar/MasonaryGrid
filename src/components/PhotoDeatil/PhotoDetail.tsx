import { useEffect, useContext, useCallback, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchPhotosById } from "../../api/unsplashAPI";
import { GridContext } from "../../store/GridContext";

const PhotoDetail: React.FC = () => {
  const { photo, setPhoto } = useContext(GridContext);
  const { id } = useParams<{ id: string }>();
  const history = useNavigate();
  const [error, setError] = useState(false);
  const hasFetchedPhoto = useRef(false);
  const { full, regular, small } = photo?.urls || {};
  const [imageUrl, setImageUrl] = useState<string>(small);
  const loadPhoto = useCallback(async function loadPhoto() {
    hasFetchedPhoto.current = true;
    try {
      const selectedPhoto = await fetchPhotosById(id!); // Fetch photo detail
      setPhoto(selectedPhoto);
    } catch (error) {
      console.error("Error in async function", error);
      setError(true);
    }
  }, [id,setPhoto]);

  useEffect(() => {
    if (!photo.id && !hasFetchedPhoto.current) {
      loadPhoto();
    }
  }, [photo.id,loadPhoto, hasFetchedPhoto]);

  useEffect(() => {
    if (photo) {
      // Determine the image URL based on device width
      const updateImageUrl = () => {
        const width = window.innerWidth;
        if (width < 400) {
          setImageUrl(small);
        } else if (width < 1440) {
          setImageUrl(regular);
        } else {
          setImageUrl(full);
        }
      };
      // Initial load
      updateImageUrl();
    }
  }, [photo, full , regular ,small]);

  if (error) return <p>There is an Error in Fetching Please Check The ID, Please go to <Link to="/">Homepage</Link></p>;

  if (!photo?.id) return <div>Loading...</div>;

  return (
    <section className="flex flex-col items-center px-10 md:px-2">
    <p className="flex justify-start w-full">
      <button 
        onClick={() => history(-1)} 
        className="px-5 py-2 text-white text-base bg-blue-500 hover:bg-blue-700 rounded-md md:text-sm"
      >
        Back
      </button>
    </p>
    <p>
      <img
        src={imageUrl}
        alt={photo.alt_description}
        className="max-w-full h-[65vh] rounded-lg my-2 w-auto md:my-4"
      />
    </p>
    <h2 className="text-center text-base my-2 md:text-lg">
      {photo.description || photo.alt_description || "No description"}
    </h2>
    <p className="text-center text-base text-gray-600 md:text-sm">
      Photographer: {photo.user.name} | {new Date(photo?.created_at).toLocaleString()}
    </p>
  </section>
  );
};

export default PhotoDetail;
