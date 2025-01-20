import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PinDialog } from "@/components/PinDialog";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface PinCardProps {
  image: string;
  description: string;
  category: string;
  onRemove?: () => void;
}

export const PinCard = ({ image, description, category, onRemove }: PinCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!auth.currentUser) {
      // Trigger auth dialog through context or props
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
    description,
    category,
    uploader: "John Doe",
    uploadDate: new Date(),
  };

  return (
    <>
      <div
        className="relative rounded-lg overflow-hidden mb-4 group cursor-pointer"
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
          <div className="absolute top-4 right-4">
            {onRemove ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Remove
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-pinterest-red hover:bg-pinterest-red/90 text-white rounded-full"
              >
                <BookmarkPlus className="h-5 w-5 mr-2" />
                Save
              </Button>
            )}
          </div>
          
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-medium mb-1">{description}</h3>
            <span className="text-sm opacity-90">{category}</span>
          </div>
        </div>
      </div>

      <PinDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        pin={mockPinData}
      />
    </>
  );
};