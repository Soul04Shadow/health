import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  MessageCircle,
  Heart,
  Brain,
  Edit,
  Check,
  X,
  Activity,
} from "lucide-react";
import { User, DashboardPage, ViewType, MoodData, Exercise } from "../lib/types";
import tips from "../lib/health-tips.json";
import allExercises from "../lib/exercises.json";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { ExerciseTemplate } from "./ExerciseTemplate";
import { HomeSection } from "./sections/HomeSection";
import { SessionsSection } from "./sections/SessionsSection";
import { ResourcesSection } from "./sections/ResourcesSection";
import { ProfileSection } from "./sections/ProfileSection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardProps {
  currentUser: User | null;
  handleLogout: () => void;
  dashboardPage: DashboardPage;
  setDashboardPage: (page: DashboardPage) => void;
  setCurrentView: (view: ViewType) => void;
  onUserUpdate?: (user: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  handleLogout,
  dashboardPage,
  setDashboardPage,
  setCurrentView,
  onUserUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserName,setUserName]=useState("")
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Update form states when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditedName(currentUser.name || "");
      setEditedAge(currentUser.age?.toString() || "");
      setEditedGender(currentUser.gender || "");
    }
  }, [currentUser]);

  const handleEdit = () => {
    setEditedName(currentUser?.name || "");
    setEditedAge(currentUser?.age?.toString() || "");
    setEditedGender(currentUser?.gender || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(currentUser?.name || "");
    setEditedAge(currentUser?.age?.toString() || "");
    setEditedGender(currentUser?.gender || "");
  };

  const handleSave = async () => {
    if (!currentUser?.uid) return;

    // Validate that we have actual values to save
    if (!editedName.trim() && !editedAge.trim() && !editedGender.trim()) {
      alert("Please fill in at least one field before saving.");
      return;
    }

    setIsLoading(true);
    try {
      // Only send non-empty values
      const updateData: any = {
        uid: currentUser.uid,
      };
      
      if (editedName.trim()) {
        updateData.name = editedName.trim();
      }
      if (editedAge.trim()) {
        updateData.age = editedAge.trim();
      }
      if (editedGender.trim()) {
        updateData.gender = editedGender.trim();
      }

      console.log("Sending update data:", updateData);

      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Update local storage with new data
        const updatedUser = {
          ...currentUser,
          name: editedName.trim() || currentUser.name,
          age: editedAge.trim() ? Number.parseInt(editedAge) : currentUser.age,
          gender: editedGender.trim() || currentUser.gender,
        };
        localStorage.setItem("curez_user", JSON.stringify(updatedUser));

        // Update current user in parent component
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }

        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!currentUser?.uid) {
      console.log("No current user UID available");
      return;
    }

    console.log("Fetching user data for user:", currentUser.uid);
    setIsLoadingMood(true);
    setIsLoadingSession(true);
    setIsLoadingExercises(true);
    try {
      const response = await fetch(`/api/user/${currentUser.uid}`);
      console.log("Response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("User data received:", userData);
        setUserName(userData.name);
        console.log(currentUserName)
        const latestSummary = userData.latestSummary?.summary_data;
        console.log("Latest summary:", latestSummary);

        // Set session summary data
        if (userData.latestSummary) {
          setSessionSummary(userData.latestSummary);
        }

        if (latestSummary && latestSummary.mood) {
          const moodDataObj = {
            mood: latestSummary.mood,
            mood_percentage: latestSummary.mood_percentage || 0,
            energy_level: latestSummary.energy_level || 0,
            stress_level: latestSummary.stress_level || 0,
            mood_stability: latestSummary.mood_stability || "Unknown",
            mood_calmness: latestSummary.mood_calmness || "Unknown",
            generated_at_utc:
              latestSummary.generated_at_utc || new Date().toISOString(),
          };
          console.log("Setting mood data:", moodDataObj);
          setMoodData(moodDataObj);
        } else {
          console.log("No mood data found in latest summary");
        }

        // Filter and set suggested exercises
        if (latestSummary && latestSummary.suggested_exercises && Array.isArray(latestSummary.suggested_exercises)) {
          const filteredExercises = allExercises.filter(ex =>
            latestSummary.suggested_exercises.includes(ex.id)
          );
          setSuggestedExercises(filteredExercises);
        }
      } else {
        console.error("Failed to fetch user data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingMood(false);
      setIsLoadingSession(false);
      setIsLoadingExercises(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserData();
    }
  }, [currentUser?.uid]);
  
    useEffect(() => {
      const updateTip = () => {
        const now = Date.now();
        const interval = 12 * 60 * 60 * 1000; // 12 hours in ms
        const index = Math.floor(now / interval) % tips.length;
        setCurrentTip(tips[index].tip);
      };
  
      updateTip(); // Set initial tip
  
      const timer = setInterval(updateTip, 12 * 60 * 60 * 1000);
  
      return () => clearInterval(timer);
    }, []);

  return (
    <div className="min-h-screen flex relative">
      {selectedExercise && (
        <ExerciseTemplate 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
      <Sidebar
        dashboardPage={dashboardPage}
        setDashboardPage={setDashboardPage}
        handleLogout={handleLogout}
        onNavigateToLanding={() => setCurrentView("landing")}
      />
      <main className="flex-1 p-6 md:p-8 transition-all duration-300">
        <DashboardHeader
          dashboardPage={dashboardPage}
          currentUserName={currentUser?.name || currentUserName}
          currentUser={currentUser}
        />

        {/* Dashboard Content */}
        {dashboardPage === "home" && (
          <HomeSection
            setCurrentView={setCurrentView}
            isLoadingMood={isLoadingMood}
            moodData={moodData}
            currentTip={currentTip}
          />
        )}

        {dashboardPage === "sessions" && (
          <SessionsSection
            setCurrentView={setCurrentView}
            isLoadingSession={isLoadingSession}
            sessionSummary={sessionSummary}
          />
        )}

        {dashboardPage === "resources" && (
          <ResourcesSection
            isLoadingExercises={isLoadingExercises}
            suggestedExercises={suggestedExercises}
            setSelectedExercise={setSelectedExercise}
            setCurrentView={setCurrentView}
          />
        )}

        {dashboardPage === "profile" && (
          <ProfileSection
            currentUser={currentUser}
            isEditing={isEditing}
            editedName={editedName}
            setEditedName={setEditedName}
            editedAge={editedAge}
            setEditedAge={setEditedAge}
            editedGender={editedGender}
            setEditedGender={setEditedGender}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};
