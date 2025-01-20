// ... existing imports ...
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchContext();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log("Search query updated:", e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    console.log("Search cleared");
  };

  const handleAuthRequired = () => {
    setShowAuthDialog(true);
    setShowAuthAlert(true);
    console.log("Auth required alert shown");
  };

  const handleAuthConfirm = () => {
    setShowAuthAlert(false);
    setShowAuthDialog(true);
    console.log("Redirecting to auth dialog");
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
                  <p>{isLoggedIn ? "Upload new pins" : "Sign in to upload pins"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-pinterest-lightGray flex items-center gap-2"
                    onClick={isLoggedIn ? () => navigate("/my-pins") : handleAuthRequired}
                  >
                    <User className="h-5 w-5" />
                    My Pins
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLoggedIn ? "View your saved pins" : "Sign in to view your pins"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
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
