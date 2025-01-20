import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { PinCard } from "@/components/PinCard";
import { AuthDialog } from "@/components/AuthDialog";

interface SavedPin {
  id: string;
  image: string;
  description: string;
  category: string;
  savedAt: Date;
}

const MyPins = () => {
  const [pins, setPins] = useState<SavedPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setShowAuthDialog(true);
      } else {
        fetchUserPins(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserPins = async (userId: string) => {
    try {
      const q = query(
        collection(db, "savedPins"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const userPins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        savedAt: doc.data().savedAt.toDate(),
      })) as SavedPin[];
      setPins(userPins);
    } catch (error) {
      console.error("Error fetching pins:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Pins</h1>
      {pins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">You haven't saved any pins yet.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {pins.map((pin) => (
            <PinCard
              key={pin.id}
              image={pin.image}
              description={pin.description}
              category={pin.category}
              onRemove={() => handleRemovePin(pin.id)} // Pass the pin ID to the handler
            />
          ))}
        </div>
      )}

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default MyPins;
