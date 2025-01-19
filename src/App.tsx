import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import ExplorePage from "@/pages/ExplorePage";
import MyPinsPage from "@/pages/MyPinsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/my-pins" element={<MyPinsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;