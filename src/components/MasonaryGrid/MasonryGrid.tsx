import { useEffect, useContext, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GridContext } from "../../store/GridContext";
import Searchgrid from "../SearchGrid/SearchGrid";
import { throttle } from "../../utils";

export interface Photo {
  id: string;
  urls: { regular: string; small: string; full: string; thumb: string };
  alt_description: string;
  user: { name: string };
  description: string;
  created_at: string;
}

const MasonryGrid: React.FC = () => {
  const { photos, setPhoto, setPage, hasFetchedData } = useContext(GridContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [startIndex, setStartIndex] = useState(0);
  // const [endIndex, setEndIndex] = useState(40);
  // const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
 
    

  // const handleVirtualScroll = useCallback(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     const scrollTop = container.scrollTop;
  //     const containerHeight = container.clientHeight;
  //     const scrollHeight = container.scrollHeight;
  
  //     // Subtract the height of the scrollbar from the total scrollable height
  //     const scrollbarWidth = 3
  //     const totalScrollableHeight = scrollHeight - containerHeight - scrollbarWidth;
  
  //     // Adjust the start and end index based on scroll position
  //     const visibleHeight = containerHeight; // Total visible area of the container
  //     const scrollPercentage = scrollTop / totalScrollableHeight;
  
  //     // Dynamically adjust the visible range of photos
  //     const newEndIndex = Math.min(
  //       Math.ceil((photos.length * scrollPercentage) + 20),
  //       photos.length
  //     );
  //     const newStartIndex = Math.max(0, newEndIndex - 40); // Keep a buffer of 40 images
  //     console.log(newStartIndex, newEndIndex);
  //     setStartIndex(newStartIndex);
  //     setEndIndex(newEndIndex);
  
  //     // Check if we need to fetch more photos when reaching near the bottom
  //     if (scrollTop + containerHeight >= scrollHeight - 100) {
  //       throttledPagination()
  //       // setPage((prevPage) => prevPage + 1); // Load more photos as you scroll
  //     }
  //   }
  // }, [photos.length, setPage]);

  // useEffect(()=>{
  //   setVisiblePhotos(photos.slice(startIndex,endIndex))
  // },[startIndex,endIndex,photos])

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    if (scrollTop + containerHeight >= scrollHeight - 100) {
      throttledPagination();
    }
  },[]);

  const handlePagination = () =>{
    hasFetchedData.current = false; // Reset the useRef for API call on scroll
    setPage((prevPage) => prevPage + 1); // Load more photos as you scroll
  }

  const throttledPagination = throttle(handlePagination,100);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [throttledPagination]);

  return (
    <section>
      <div className="search-grid mb-4">
        <Searchgrid />
      </div>
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[10px] items-start overflow-y-auto h-[80vh] relative"
        ref={containerRef}
      >
        {photos?.map((photo) => (
          <div key={photo.id}>
            <Link to={`/photo/${photo?.id}`} onClick={() => setPhoto(photo)}>
              <img
                src={photo?.urls.thumb}
                alt={photo?.alt_description}
                className="rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200 transform hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );

};

export default MasonryGrid;
