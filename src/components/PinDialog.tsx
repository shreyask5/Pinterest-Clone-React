import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

// Dynamic import for date formatting
const formatDate = async (date: Date) => {
  const { format } = await import('date-fns');
  return format(date, "MMMM d, yyyy 'at' h:mm a");
};

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pin: {
    image: string;
    title?: string;
    description: string;
    category: string;
    uploader: string;
    uploadDate: Date;
    savedAt?: Date;
  };
  showRemove?: boolean;
  onRemove?: () => void;
}

export const PinDialog = ({ isOpen, onClose, pin, showRemove = false, onRemove }: PinDialogProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("Date not available");

  useEffect(() => {
    const getFormattedDate = async () => {
      if (pin.uploadDate instanceof Date && !isNaN(pin.uploadDate.getTime())) {
        const formatted = await formatDate(pin.uploadDate);
        setFormattedDate(formatted);
      } else if (pin.savedAt instanceof Date && !isNaN(pin.savedAt.getTime())) {
        const formatted = await formatDate(pin.savedAt);
        setFormattedDate(formatted);
      }
    };
    
    if (isOpen) {
      getFormattedDate();
    }
  }, [isOpen, pin.uploadDate, pin.savedAt]);

  const handleSave = () => {
    if (showRemove && onRemove) {
      onRemove();
      onClose();
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/projects/pinterest-clone/demo/pin/${encodeURIComponent(pin.image)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title || pin.description,
          text: pin.description,
          url: shareUrl,
        });
      } catch (error) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Pin Details</DialogTitle>
        <DialogDescription className="sr-only">
          View and interact with this pin
        </DialogDescription>
        
        <div className="grid md:grid-cols-2 gap-0 md:gap-4 max-h-[90vh] overflow-auto">
          {/* Image Section */}
          <div className="relative flex items-center justify-center bg-gray-100 min-h-[40vh] md:min-h-[500px] max-h-[70vh]">
            <img
              src={pin.image}
              alt={pin.description}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">{pin.title || pin.description}</h2>
                <p className="text-gray-600 mb-1 text-sm md:text-base">
                  Uploaded by {pin.uploader}
                </p>
                                 <p className="text-gray-500 text-xs md:text-sm">
                   {formattedDate}
                 </p>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <span className="inline-block bg-pinterest-lightGray rounded-full px-3 py-1 text-xs md:text-sm font-semibold text-gray-700">
                {pin.category}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <Button
                onClick={handleSave}
                className={`flex-1 text-sm md:text-base rounded-full ${
                  showRemove 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-pinterest-red hover:bg-pinterest-red/90"
                }`}
              >
                {showRemove ? (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 text-sm md:text-base"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};