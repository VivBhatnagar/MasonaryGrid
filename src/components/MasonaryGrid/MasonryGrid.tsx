import { useEffect, useContext, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GridContext } from "../../store/GridContext";
import "./MasonryGrid.css";
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

  // const handleVirtualScroll = useCallback(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     const scrollTop = container.scrollTop;
  //     const containerHeight = container.clientHeight;
  //     const scrollHeight = container.scrollHeight;

  //     // Adjust the start and end index based on scroll position
  //     const visibleHeight = containerHeight; // Total visible area of the container
  //     const totalScrollableHeight = scrollHeight - visibleHeight;
  //     const scrollPercentage = scrollTop / totalScrollableHeight;

  //     // Dynamically adjust the visible range of photos
  //     const newEndIndex = Math.min(
  //       Math.ceil((photos.length * scrollPercentage) + 20),
  //       photos.length
  //     );
  //     const newStartIndex = Math.max(0, newEndIndex - 40); // Keep a buffer of 40 images

  //     setStartIndex(newStartIndex);
  //     setEndIndex(newEndIndex);

  //     // Check if we need to fetch more photos when reaching near the bottom
  //     if (scrollTop + containerHeight >= scrollHeight - 100) {
  //       setPage((prevPage) => prevPage + 1); // Load more photos as you scroll
  //     }
  //   }
  // }, [photos.length, setPage]);

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
    <section className="grid-container">
      <div className="search-grid">
        <Searchgrid></Searchgrid>
      </div>
      <div
        className="masonry-grid"
        ref={containerRef}
        style={{ height: "80vh", overflowY: "auto" }} // Virtual scrolling container
      >
        {photos.map((photo) => (
          <div key={photo.id} className="masonry-item">
            <Link to={`/photo/${photo.id}`} onClick={() => setPhoto(photo)}>
              <img src={photo.urls.thumb} alt={photo.alt_description} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MasonryGrid;
