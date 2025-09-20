import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Brain, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { MoodData, ViewType } from "../../lib/types";

interface HomeSectionProps {
  setCurrentView: (view: ViewType) => void;
  isLoadingMood: boolean;
  moodData: MoodData | null;
  currentTip: string;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setCurrentView,
  isLoadingMood,
  moodData,
  currentTip,
}) => {
  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Brain className="h-6 w-6 text-secondary" />
              <span>Mood Analytics</span>
            </CardTitle>
            <CardDescription className="text-base">
              Your emotional wellness insights from recent sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMood ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading mood data...</p>
              </div>
            ) : moodData ? (
              <div className="space-y-6">
                {/* Mood Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {moodData.mood}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current Mood
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {moodData.mood_percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mood Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {moodData.energy_level}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Energy Level
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {moodData.stress_level}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stress Level
                    </div>
                  </div>
                </div>

                {/* Energy and Stress Level Half Doughnut Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Energy Level Chart */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <ResponsiveContainer width={150} height={150}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Energy",
                                value: moodData.energy_level,
                                fill: "#10b981",
                              },
                              {
                                name: "Remaining",
                                value: 100 - moodData.energy_level,
                                fill: "#e5e7eb",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={0}
                            dataKey="value"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {moodData.energy_level}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Energy
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-700">
                        {moodData.mood_stability}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Stability
                      </div>
                    </div>
                  </div>

                  {/* Stress Level Chart */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <ResponsiveContainer width={150} height={150}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Stress",
                                value: moodData.stress_level,
                                fill: "#ef4444",
                              },
                              {
                                name: "Remaining",
                                value: 100 - moodData.stress_level,
                                fill: "#e5e7eb",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={0}
                            dataKey="value"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {moodData.stress_level}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Stress
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700">
                        {moodData.mood_calmness}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Calmness
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete a session to see your mood analytics
                </p>
                <Button
                  onClick={() => setCurrentView("session")}
                  className="mt-4"
                  size="sm"
                >
                  Start Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="w-1/3 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              "{currentTip}"
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Heart className="h-7 w-7 text-primary" />
              <span>How are you feeling today?</span>
            </CardTitle>
            <CardDescription className="text-base">
              Start a conversation with Carel, your AI guide, anytime you need
              support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentView("session")}
              className="w-full h-16 text-xl font-semibold"
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              Start AI Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
