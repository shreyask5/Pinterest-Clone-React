import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const MyPinsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = false; // This will be replaced with actual auth state

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

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
      <h1 className="text-2xl font-bold mb-6">My Pins</h1>
      <div className="text-center text-gray-500">
        {isLoggedIn ? (
          "No pins saved yet"
        ) : (
          "Please log in to view your pins"
        )}
      </div>
    </div>
  );
};

export default MyPinsPage;