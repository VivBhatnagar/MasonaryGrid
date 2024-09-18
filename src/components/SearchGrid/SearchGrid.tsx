import { ChangeEvent, useContext } from "react";
import { fetchPhotos, fetchPhotosByQuery } from "../../api/unsplashAPI";
import { GridContext } from "../../store/GridContext";
import SearchIcon from "../../assets/SearchIcon";
import { debounce } from "../../utils";

const Searchgrid: React.FC = () => {
  const { page,setPhotos, perPage } = useContext(GridContext);

  const debouncedHandleInputChange = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      resetSearch();
      return;
    }
    const data = await fetchPhotosByQuery(searchTerm.trim());
    setPhotos(data.results);
  }, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedHandleInputChange(event.target.value);
  };

  const resetSearch = async () => {
    const data = await fetchPhotos(page,perPage);
    setPhotos(data);
  };

  return (
    <div className="flex justify-center m-2.5">
      <div className="relative left-1/2 top-1 mr-2.5">
        <SearchIcon />
      </div>
      <input id="search-text"
        type="text"
        placeholder="Please type here"
        onChange={handleInputChange}
        className="w-1/2 rounded-lg h-8 pl-4"
      />
    </div>
  );
};

export default Searchgrid;
