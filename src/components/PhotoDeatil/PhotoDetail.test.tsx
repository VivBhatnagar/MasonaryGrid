import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PhotoDetail from "./PhotoDetail";
import { GridContext } from "../../store/GridContext";
import { fetchPhotosById } from "../../api/unsplashAPI";
import "@testing-library/jest-dom";
import { Photo } from "../MasonaryGrid/MasonryGrid";



jest.mock("../../api/unsplashAPI", () => ({
  fetchPhotosById: jest.fn(),
}));

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

const renderComponent = (photo = mockPhoto) => {
  return render(
    <MemoryRouter initialEntries={["/photo/1"]}>
      <GridContext.Provider
        value={{
          photo,
          setPhoto: jest.fn(),
          photos: [photo],
          setPhotos: () => {},
          page: 1,
          setPage: () => {},
          hasFetchedData: { current: false },
        }}
      >
        <Routes>
          <Route path="/photo/:id" element={<PhotoDetail />} />
        </Routes>
      </GridContext.Provider>
    </MemoryRouter>
  );
};

describe("PhotoDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays photo data correctly", async () => {
    (fetchPhotosById as jest.Mock).mockResolvedValue(mockPhoto);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByAltText(mockPhoto.alt_description)).toHaveAttribute(
        "src",
        mockPhoto.urls.small
      );
      expect(screen.getByText(mockPhoto.description)).toBeInTheDocument();
      expect(
        screen.getByText(`Photographer: ${mockPhoto.user.name}`)
      ).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    (fetchPhotosById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("There is an Error in Fetching Please Check The ID")
      ).toBeInTheDocument();
    });
  });

  test("updates image URL based on window width", async () => {
    (fetchPhotosById as jest.Mock).mockResolvedValue(mockPhoto);

    renderComponent();

    await waitFor(() => {
      // Simulate window width change
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));

      // Update image URL should reflect the new window width
      expect(screen.getByAltText(mockPhoto.alt_description)).toHaveAttribute(
        "src",
        mockPhoto.urls.regular
      );
    });
  });

  test("navigates back on button click", () => {
    renderComponent();

    const backButton = screen.getByText("Back");
    backButton.click();

    expect(window.history.length).toBe(1); // Check that history length has changed
  });
});
