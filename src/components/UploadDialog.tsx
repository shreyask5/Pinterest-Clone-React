import { useEffect, useState } from "react"; // Import hooks first
import { AiOutlineUpload as Upload } from "react-icons/ai";
import { AuthDialog } from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

// Constants
const categories = [
  "Art",
  "Photography",
  "Food",
  "Travel",
  "Fashion",
  "Technology",
  "DIY",
  "Home Decor",
];

export function UploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null); // State to store the userId
  const [showAuthDialog, setShowAuthDialog] = useState(false); // Fix hook usage

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setShowAuthDialog(true);
      } else {
        setUserId(user.uid); // Store the userId in state
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !description || !category) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Step 1: Prepare the form data for the upload
      const formData = new FormData();
      formData.append("file", image);

      // Step 2: Send the file to the backend for uploading
      const { data } = await axios.post("http://localhost:3000/upload-to-s3", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileUrl } = data;

      // Step 3: Save pin details in Firestore
      const pinDetails = {
        category,
        description,
        image: fileUrl,
        savedAt: new Date(),
        userId: userId,
      };

      // Add to the 'explore' collection
      await addDoc(collection(db, "explore"), pinDetails);

      // Add to the 'savedPins' collection
      await addDoc(collection(db, "savedPins"), pinDetails);

      toast({
        title: "Pin Created!",
        description: "Your pin has been created successfully.",
      });

      // Reset state and close dialog
      setIsOpen(false);
      setImage(null);
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload pin. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Create Pin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Pin</DialogTitle>
          <DialogDescription>
            Upload an image and add details to create your pin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              <Label
                htmlFor="image"
                className="cursor-pointer block py-8 text-gray-500"
              >
                Click to upload or drag and drop
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's your pin about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Create Pin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
