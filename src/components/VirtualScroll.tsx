import { useContext, useState } from "react";
import { Photo } from "./MasonaryGrid/MasonryGrid";
import { Link } from "react-router-dom";
import { GridContext } from "../store/GridContext";

const VirtualScroll:React.FC<{
    rowHeight:number,
    totalItems:number,
    items:Photo[],
    visibleItemsLength:number,
    containerHeight:number,
  }> = ({
  rowHeight,
  totalItems,
  items,
  visibleItemsLength,
  containerHeight,
}) => {

  const {setPhoto} = useContext(GridContext)  
  const totalHeight = rowHeight * totalItems;
  //   Current scroll position of the container
  const [scrollTop, setScrollTop] = useState(0);
  // Get the first element to be displayed
  const startNodeElem = Math.ceil(scrollTop / rowHeight);
  // Get the items to be displayed
  const visibleItems = items?.slice(
    startNodeElem,
    startNodeElem + visibleItemsLength
  );
  //  Add padding to the empty space
  const offsetY = startNodeElem * rowHeight;

  const handleScroll = (e:React.UIEvent<HTMLDivElement>) => {
    // set scrollTop to the current scroll position of the container.
    setScrollTop(e?.currentTarget?.scrollTop);
  };

  return (
    <div
      style={{
        height: containerHeight,
        overflow: "auto",
        border: "5px solid black",
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
        {visibleItems.map((photo) => (
          <div key={photo.id} className="masonry-item">
            <Link to={`/photo/${photo.id}`} onClick={() => setPhoto(photo)}>
              <img src={photo.urls.thumb} alt={photo.alt_description} />
            </Link>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualScroll;