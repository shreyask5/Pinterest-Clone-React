import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                className="w-full bg-pinterest-lightGray pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pinterest-gray h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-pinterest-lightGray"
            >
              <Plus className="h-5 w-5" />
            </Button>

            {isLoggedIn ? (
              <Link to="/my-pins">
                <Button variant="ghost" className="rounded-full hover:bg-pinterest-lightGray">
                  My Pins
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setIsLoggedIn(true)}
                className="rounded-full bg-pinterest-red hover:bg-pinterest-red/90 text-white"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Log in
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};