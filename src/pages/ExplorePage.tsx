import { PinCard } from "@/components/PinCard";
import { useSearchContext } from "@/context/SearchContext";

const mockPins = [
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
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    description: "Circuit board close-up",
    category: "Electronics",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Coding session",
    category: "Programming",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "Modern workspace",
    category: "Workspace",
  },
];

const ExplorePage = () => {
  const { searchQuery } = useSearchContext();

  const filteredPins = mockPins.filter((pin) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      pin.description.toLowerCase().includes(searchTerm) ||
      pin.category.toLowerCase().includes(searchTerm)
    );
  });

  console.log("Filtered pins:", filteredPins.length);

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