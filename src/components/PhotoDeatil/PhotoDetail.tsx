import { useEffect, useContext, useCallback, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPhotosById } from "../../api/unsplashAPI";
import "./PhotoDetail.css";
import { GridContext } from "../../store/GridContext";
import { throttle } from "../../utils";

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
  }, []);

  useEffect(() => {
    if (!photo.id && !hasFetchedPhoto.current) {
      loadPhoto();
    }
  }, [id]);

  useEffect(() => {
    if (photo) {
      // Determine the image URL based on device width
      const updateImageUrl = () => {
        const width = window.innerWidth;
        if (width < 400) {
          setImageUrl(photo.urls.small);
        } else if (width < 1440) {
          setImageUrl(photo.urls.regular);
        } else {
          setImageUrl(photo.urls.full);
        }
      };
      // Initial load
      updateImageUrl();
    }
  }, [photo]);

  if (error) return <p>There is an Error in Fetching Please Check The ID</p>;

  if (!photo?.id) return <div>Loading...</div>;

  return (
    <section className="photo-detail">
      <p className="back-button">
        <button onClick={() => history(-1)}>Back</button>
      </p>
      <p>
        <img src={imageUrl} alt={photo.alt_description} />
      </p>
      <h2>{photo.description || photo.alt_description || "No description"}</h2>
      <p>
        Photographer: {photo.user.name} |{" "}
        {new Date(photo?.created_at).toLocaleString()}
      </p>
    </section>
  );
};

export default PhotoDetail;
