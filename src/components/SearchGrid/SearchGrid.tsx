import {
  ChangeEvent,
  useContext,
} from "react";
import classes from "./SearchGrid.module.css";
import { fetchPhotos, fetchPhotosByQuery } from "../../api/unsplashAPI";
import { GridContext } from "../../store/GridContext";
import SearchIcon from "../../assets/SearchIcon"
import { debounce } from "../../utils";

const Searchgrid: React.FC = () => {
  const { setPhotos } = useContext(GridContext);


  const debouncedHandleInputChange = 
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        resetSearch();
        return;
      }
      const data = await fetchPhotosByQuery(searchTerm.trim());
      setPhotos(data.results);
    }, 300)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedHandleInputChange(event.target.value);
  };

  const resetSearch = async () => {
    const data = await fetchPhotos();
    setPhotos(data);
  };

  return (
    <div className={classes.searchGrid}>
      <SearchIcon></SearchIcon>
      <input
        type="text"
        placeholder="Please type here"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Searchgrid;
