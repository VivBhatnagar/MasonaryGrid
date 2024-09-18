import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MasonryGrid from "./components/MasonaryGrid/MasonryGrid";
import PhotoDetail from "./components/PhotoDeatil/PhotoDetail";
import "./App.css";
import { GridContextProvider } from "./store/GridContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <main>
      <Router>
        <GridContextProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<MasonryGrid />} />
              <Route path="/photo/:id" element={<PhotoDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </GridContextProvider>
      </Router>
    </main>
  );
}

export default App;
