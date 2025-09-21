import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PositiveTipCardProps {
  tip: string;
}

export const PositiveTipCard: React.FC<PositiveTipCardProps> = ({ tip }) => {
  return (
    <Card>
      <CardContent >
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-semibold text-primary shrink-0">
            Positive Tip:
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            "{tip}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
