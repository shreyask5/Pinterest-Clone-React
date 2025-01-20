import { useEffect, useState } from "react";
import { PinCard } from "@/components/PinCard";
import { useSearchContext } from "@/context/SearchContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ExplorePage = () => {
  const { searchQuery } = useSearchContext(); // Search context for filtering
  const [pins, setPins] = useState([]); // State to hold all pins from Firestore
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "explore"));
        const pinsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPins(pinsData);
      } catch (error) {
        console.error("Error fetching pins:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPins();
  }, []);

  // Filter pins based on search query
  const filteredPins = pins.filter((pin) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      pin.description.toLowerCase().includes(searchTerm) ||
      pin.category.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading pins...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
      {filteredPins.length === 0 && searchQuery && (
        <div className="text-center text-gray-500 py-8">
          No pins found matching "{searchQuery}"
        </div>
      )}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {filteredPins.map((pin) => (
          <PinCard
            key={pin.id}
            image={pin.image}
            description={pin.description}
            category={pin.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
