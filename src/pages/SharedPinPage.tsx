import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PinDialog } from "@/components/PinDialog";

const SharedPinPage = () => {
  const { imageUrl } = useParams();
  const [pin, setPin] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchPin = async () => {
      if (imageUrl) {
        const decodedUrl = decodeURIComponent(imageUrl);
        const q = query(
          collection(db, "explore"),
          where("image", "==", decodedUrl)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const pinData = snapshot.docs[0].data();
          setPin({
            ...pinData,
            uploadDate: pinData.savedAt?.toDate ? pinData.savedAt.toDate() : new Date(pinData.savedAt),
            uploader: pinData.uploaderName || "Anonymous",
            title: pinData.title || pinData.description,
          });
        }
      }
    };

    fetchPin();
  }, [imageUrl]);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate to home page instead of going back
    window.location.href = "/projects/pinterest-clone/demo";
  };

  if (!pin) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center">
      <PinDialog
        isOpen={isOpen}
        onClose={handleClose}
        pin={pin}
      />
    </div>
  );
};

export default SharedPinPage; 