import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthDialog } from "@/components/AuthDialog";
import { UploadDialog } from "@/components/UploadDialog";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Search functionality will be implemented with backend
    console.log("Searching for:", e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
              alt="Pinterest Logo"
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search pins..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-pinterest-lightGray pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pinterest-gray h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UploadDialog />

            {isLoggedIn ? (
              <>
                <Link to="/my-pins">
                  <Button variant="ghost" className="rounded-full hover:bg-pinterest-lightGray">
                    My Pins
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsLoggedIn(false)}
                  variant="ghost"
                  className="rounded-full hover:bg-pinterest-lightGray"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};