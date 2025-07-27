import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { PinCard } from "@/components/PinCard";
import { AuthDialog } from "@/components/AuthDialog";
import { useSearchContext } from "@/context/SearchContext";

interface SavedPin {
  id: string;
  image: string;
  title?: string;
  description: string;
  category: string;
  uploaderName?: string;
  savedAt: any; // Firebase timestamp
  userId: string;
}

const MyPins = () => {
  const [pins, setPins] = useState<SavedPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Add this state
  const navigate = useNavigate();
  const { searchQuery } = useSearchContext();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!user) {
        setShowAuthDialog(true);
        setLoading(false);
      } else {
        // Set up real-time listener for user's pins
        const q = query(
          collection(db, "savedPins"),
          where("userId", "==", user.uid)
        );
        
        const unsubscribePins = onSnapshot(q, (snapshot) => {
          const userPins = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as SavedPin[];
          setPins(userPins);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching pins:", error);
          setLoading(false);
        });

        return () => unsubscribePins();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemovePin = async (pinId: string) => {
    try {
      // Remove the pin from Firestore
      await deleteDoc(doc(db, "savedPins", pinId));

      // Update the state to remove the pin locally
      setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
    } catch (error) {
      console.error("Error removing pin:", error);
    }
  };

  // Update the loading condition:
  if (!authChecked || (loading && !showAuthDialog)) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Add auth dialog for unauthenticated users:
  if (showAuthDialog && !auth.currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your pins</h1>
          <p className="text-xl text-gray-600 mb-8">Please sign in to access your saved pins.</p>
        </div>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    );
  }

  // Filter pins based on search query
  const filteredPins = pins.filter((pin) => {
    if (!searchQuery) return true;
    const searchTerm = searchQuery.toLowerCase();
    return (
      pin.description.toLowerCase().includes(searchTerm) ||
      pin.category.toLowerCase().includes(searchTerm) ||
      (pin.title && pin.title.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Pins</h1>
      {pins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">You haven't saved any pins yet.</p>
        </div>
      ) : (
        <>
          {filteredPins.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No pins found matching "{searchQuery}"</p>
            </div>
          )}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4">
            {filteredPins.map((pin) => (
              <PinCard
                key={pin.id}
                image={pin.image}
                title={pin.title}
                description={pin.description}
                category={pin.category}
                uploaderName={pin.uploaderName}
                uploadDate={pin.savedAt?.toDate ? pin.savedAt.toDate() : new Date(pin.savedAt)}
                onRemove={() => handleRemovePin(pin.id)} // Pass the pin ID to the handler
              />
            ))}
          </div>
        </>
      )}

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default MyPins;
