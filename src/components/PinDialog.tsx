import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { format } from "date-fns";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pin: {
    image: string;
    description: string;
    category: string;
    uploader: string;
    uploadDate: Date;
  };
}

export const PinDialog = ({ isOpen, onClose, pin }: PinDialogProps) => {
  const handleSave = () => {
    console.log("Pin saved");
  };

  const handleShare = () => {
    console.log("Pin shared");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Image Section */}
          <div className="relative h-[500px]">
            <img
              src={pin.image}
              alt={pin.description}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{pin.description}</h2>
                <p className="text-gray-600 mb-1">
                  Uploaded by {pin.uploader}
                </p>
                <p className="text-gray-500 text-sm">
                  {format(pin.uploadDate, "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <span className="inline-block bg-pinterest-lightGray rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {pin.category}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-pinterest-red hover:bg-pinterest-red/90"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
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