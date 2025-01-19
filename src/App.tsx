import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import ExplorePage from "@/pages/ExplorePage";
import MyPinsPage from "@/pages/MyPinsPage";
import { SearchProvider } from "@/context/SearchContext";

const App = () => {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/my-pins" element={<MyPinsPage />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
};

export default App;