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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
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
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !title || !description || !category) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", image);

      // Dynamic import for axios
      const { default: axios } = await import("axios");
      const { data } = await axios.post("https://shreyask.in/projects/pinterest-clone/demo/api", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileUrl } = data;

      // Step 3: Save pin details in Firestore
      const pinDetails = {
        title,
        category,
        description,
        image: fileUrl,
        savedAt: new Date(),
        userId: userId,
        uploaderName: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
        uploadDate: new Date(),
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
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setTitle("");
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
        <span>
          <Button className="bg-gray-100 hover:bg-gray-200 text-black rounded-full p-3 border-0" variant="ghost">
            <Upload className="h-5 w-5" />
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Pin</DialogTitle>
          <DialogDescription>
            Upload an image and add details to create your pin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="border-2 border-dashed rounded-lg p-2 sm:p-4 text-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              {imagePreview ? (
                <div className="space-y-2 sm:space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-32 sm:h-48 object-cover rounded-lg mx-auto"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
                  >
                    Change Image
                  </Label>
                </div>
              ) : (
                <Label
                  htmlFor="image"
                  className="cursor-pointer block py-4 sm:py-8 text-gray-500 text-sm"
                >
                  Click to upload or drag and drop
                </Label>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Add a title (max 100 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              maxLength={100}
              className="text-sm"
              required
            />
            <p className="text-xs text-gray-500">{title.length}/100 characters</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's your pin about? (max 500 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              maxLength={500}
              className="text-sm min-h-[80px]"
              required
            />
            <p className="text-xs text-gray-500">{description.length}/500 characters</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="text-sm">
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
          
          <Button type="submit" className="w-full text-sm sm:text-base">
            Create Pin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

