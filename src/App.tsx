import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { SearchProvider } from "@/context/SearchContext";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Dynamic imports for code splitting:
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const MyPinsPage = lazy(() => import("@/pages/MyPinsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SharedPinPage = lazy(() => import("@/pages/SharedPinPage"));

const App = () => {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Toaster />
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/projects/pinterest-clone/demo" element={<ExplorePage />} />
            <Route path="/projects/pinterest-clone/demo/my-pins" element={<MyPinsPage />} />
            <Route path="/projects/pinterest-clone/demo/profile" element={<ProfilePage />} />
            <Route path="/projects/pinterest-clone/demo/pin/:imageUrl" element={<SharedPinPage />} />
          </Routes>
        </Suspense>
      </SearchProvider>
    </BrowserRouter>
  );
};

export default App;