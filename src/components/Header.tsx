// ... existing imports ...
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation(); // Add this line

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value && location.pathname !== '/projects/pinterest-clone/demo') {
      navigate('/projects/pinterest-clone/demo');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAuthRequired = () => {
    setShowAuthDialog(true);
    setShowAuthAlert(true);
  };

  const handleAuthConfirm = () => {
    setShowAuthAlert(false);
    setShowAuthDialog(true);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      navigate("/projects/pinterest-clone/demo");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/projects/pinterest-clone/demo" className="flex-shrink-0">
            <img
              src="https://pinterest-clone-picture-storage.s3.ap-south-1.amazonaws.com/Pinterest-logo.png"
              alt="Pinterest Logo"
              className="h-6 sm:h-8 w-auto"
            />
          </Link>

                     <div className="flex-1 max-w-xl sm:max-w-2xl">
             <div className="relative">
               <Input
                 type="search"
                 placeholder="Search pins..."
                 value={searchQuery}
                 onChange={handleSearch}
                 className="w-full bg-pinterest-lightGray pl-8 sm:pl-10 pr-10 py-2 rounded-full text-sm [&::-webkit-search-cancel-button]:appearance-none"
               />
               <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-pinterest-gray h-4 w-4 sm:h-5 sm:w-5" />
               {searchQuery && (
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={handleClearSearch}
                   className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 hover:bg-gray-200 rounded-full"
                 >
                   <span className="text-lg leading-none">×</span>
                 </Button>
               )}
             </div>
           </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isLoggedIn ? (
                    <UploadDialog />
                  ) : (
                    <Button 
                      onClick={handleAuthRequired}
                      className="bg-gray-100 hover:bg-gray-200 text-black rounded-full p-3 border-0"
                      variant="ghost"
                    >
                      <Upload className="h-5 w-5" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLoggedIn ? "Upload new pins" : "Sign in to upload pins"}</p>
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
                  <DropdownMenuItem onClick={() => navigate("/projects/pinterest-clone/demo/my-pins")}>
                    My Pins
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/projects/pinterest-clone/demo/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthDialog(true)} variant="default">
                Sign In
              </Button>
            )}

            <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
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
