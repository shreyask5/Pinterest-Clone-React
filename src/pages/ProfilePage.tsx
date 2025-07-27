import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  name: string;
  email: string;
  dateOfBirth?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Profile not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={auth.currentUser?.photoURL || ""} />
            <AvatarFallback className="text-2xl">
              {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.name}</CardTitle>
          <p className="text-gray-600">{profile.email}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.dateOfBirth && (
              <div>
                <label className="font-semibold">Date of Birth:</label>
                <p>{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <label className="font-semibold">Member Since:</label>
              <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 