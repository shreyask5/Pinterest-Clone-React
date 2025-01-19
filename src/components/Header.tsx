import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthDialog } from "@/components/AuthDialog";
import { UploadDialog } from "@/components/UploadDialog";
import { useSearchContext } from "@/context/SearchContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchContext();
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log("Search query updated:", e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    console.log("Search cleared");
  };

  const handleAuthRequired = () => {
    setShowAuthAlert(true);
    console.log("Auth required alert shown");
  };

  const handleAuthConfirm = () => {
    setShowAuthAlert(false);
    // Simulate opening the auth dialog
    const signInButton = document.querySelector('[role="dialog"] button') as HTMLButtonElement;
    if (signInButton) signInButton.click();
    console.log("Redirecting to auth dialog");
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
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isLoggedIn ? (
                    <UploadDialog />
                  ) : (
                    <Button onClick={handleAuthRequired}>
                      <Upload className="h-5 w-5" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload new pins</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  {isLoggedIn ? (
                    <Button
                      variant="ghost"
                      className="rounded-full hover:bg-pinterest-lightGray flex items-center gap-2"
                      onClick={() => navigate("/my-pins")}
                    >
                      <User className="h-5 w-5" />
                      My Pins
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="rounded-full hover:bg-pinterest-lightGray flex items-center gap-2"
                      onClick={handleAuthRequired}
                    >
                      <User className="h-5 w-5" />
                      My Pins
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your saved pins</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isLoggedIn ? (
              <Button
                onClick={() => setIsLoggedIn(false)}
                variant="ghost"
                className="rounded-full hover:bg-pinterest-lightGray"
              >
                Sign Out
              </Button>
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You are not signed in. Please sign in to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAuthConfirm}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};