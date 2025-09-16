import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Exercise } from "../lib/types";
import { X, Clock, Youtube } from "lucide-react";

interface ExerciseTemplateProps {
  exercise: Exercise;
  onClose: () => void;
}

export const ExerciseTemplate: React.FC<ExerciseTemplateProps> = ({ exercise, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [exercise]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-card text-card-foreground relative">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{exercise.exercise_name}</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <p className="text-base leading-relaxed">{exercise.procedure}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Expected time to complete: {exercise.expected_time_to_complete}</span>
          </div>
          <Button className="w-full" onClick={() => window.open(exercise.video_link, "_blank")}>
            <Youtube className="h-5 w-5 mr-2" />
            Watch Video Guide
          </Button>
        </CardContent>
      </Card>
      <audio ref={audioRef} src={exercise.bgSound} loop />
    </div>
  );
};
