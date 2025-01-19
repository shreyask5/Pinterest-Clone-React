import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PinCard } from "@/components/PinCard";

const mockSavedPins = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    description: "Working from home setup",
    category: "Workspace",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    description: "Tech workspace inspiration",
    category: "Technology",
  },
];

const MyPinsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to view your pins.",
      });
      navigate("/");
    }
  }, [isLoggedIn, navigate, toast]);

  const handleRemovePin = (pinId: number) => {
    toast({
      title: "Pin removed",
      description: "The pin has been removed from your collection.",
    });
    // Pin removal logic will be implemented with backend
    console.log("Removing pin:", pinId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
      <h1 className="text-2xl font-bold mb-6">My Pins</h1>
      {isLoggedIn ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {mockSavedPins.map((pin) => (
            <PinCard
              key={pin.id}
              image={pin.image}
              description={pin.description}
              category={pin.category}
              onRemove={() => handleRemovePin(pin.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Please log in to view your pins
        </div>
      )}
    </div>
  );
};

export default MyPinsPage;