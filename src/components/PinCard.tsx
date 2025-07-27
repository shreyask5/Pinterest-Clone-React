import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PinDialog } from "@/components/PinDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface PinCardProps {
  image: string;
  title?: string;
  description: string;
  category: string;
  uploaderName?: string;
  uploadDate?: Date;
  onRemove?: () => void;
}

export const PinCard = ({ image, title, description, category, uploaderName, uploadDate, onRemove }: PinCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!auth.currentUser) {
      setShowAuthDialog(true);
      return;
    }

    try {
      await addDoc(collection(db, "savedPins"), {
        userId: auth.currentUser.uid,
        image,
        description,
        category,
        savedAt: new Date(),
      });

      toast({
        title: "Pin saved!",
        description: "The pin has been added to your collection.",
      });
    } catch (error) {
      toast({
        title: "Error saving pin",
        description: "There was an error saving your pin. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  // Mock data for the dialog
  const mockPinData = {
    image,
    title: title || description,
    description,
    category,
    uploader: uploaderName || "Anonymous",
    uploadDate: uploadDate instanceof Date && !isNaN(uploadDate.getTime()) 
      ? uploadDate 
      : null,
    savedAt: uploadDate instanceof Date && !isNaN(uploadDate.getTime()) 
      ? uploadDate 
      : new Date(),
  };

  return (
    <>
      <div
        className="relative rounded-lg overflow-hidden mb-2 sm:mb-4 group cursor-pointer break-inside-avoid"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <img
          src={image}
          alt={description}
          className="w-full h-auto object-cover rounded-lg"
        />
        
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
            {onRemove ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Remove
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-pinterest-red hover:bg-pinterest-red/90 text-white rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <BookmarkPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Save
              </Button>
            )}
          </div>
          
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
            {title && <h3 className="font-medium mb-1 truncate text-sm sm:text-base">{title}</h3>}
            <p className="text-xs sm:text-sm opacity-90 line-clamp-2">{description}</p>
            <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs opacity-75">
              <span className="capitalize">{category}</span>
              {uploadDate instanceof Date && !isNaN(uploadDate.getTime()) && (
                <span>{uploadDate.toLocaleDateString()}</span>
              )}
            </div>
            {uploaderName && (
              <p className="text-xs opacity-75 mt-1">By {uploaderName}</p>
            )}
          </div>
        </div>
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />

      <PinDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        pin={mockPinData}
        showRemove={!!onRemove}
        onRemove={onRemove}
      />
    </>
  );
};