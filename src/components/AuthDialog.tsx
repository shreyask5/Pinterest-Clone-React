import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type AuthMode = "signin" | "signup";

interface AuthDialogProps {
  onAuthStateChange?: (isLoggedIn: boolean) => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AuthDialog({ onAuthStateChange, open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (onAuthStateChange) {
        onAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [onAuthStateChange]);

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (mode === "signup") {
        const name = formData.get("name") as string;
        const dob = formData.get("dob") as string;

        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name,
          dateOfBirth: dob,
          createdAt: new Date().toISOString(),
        });

        toast({
          title: "Account created successfully!",
          description: "Welcome to Pinterest clone!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed in successfully!",
          description: "Welcome back!",
        });
      }
      onOpenChange(false); // Close the dialog after successful authentication
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast({
        title: "Signed in with Google successfully!",
        description: "Welcome to Pinterest clone!",
      });
      onOpenChange(false); // Close the dialog after successful authentication
    } catch (error: any) {
      toast({
        title: "Google Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to your account to access all features."
              : "Create a new account to start pinning!"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" required />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue with Google"}
            </Button>
          </div>
          <div className="text-center text-sm">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
