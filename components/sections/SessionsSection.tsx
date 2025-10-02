import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ViewType } from "../../lib/types";
import { useTranslation } from "@/hooks/useTranslation";

interface SessionsSectionProps {
  setCurrentView: (view: ViewType) => void;
  isLoadingSession: boolean;
  sessionSummary: any;
}

export const SessionsSection: React.FC<SessionsSectionProps> = ({
  setCurrentView,
  isLoadingSession,
  sessionSummary,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl">{t("sessions_curie")}</CardTitle>
            <CardDescription className="text-base">
              {t("sessions_curieDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentView("session")}
              className="w-full h-16 text-xl font-semibold"
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              {t("sessions_startNew")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t("sessions_summary")}</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoadingSession ? (
            <div className="flex items-center justify-center h-16">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="ml-2 text-sm text-muted-foreground">{t("sessions_loading")}</p>
            </div>
          ) : sessionSummary ? (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-foreground mb-2">{t("sessions_lastSummary")}</p>
                {sessionSummary.description || sessionSummary.summary_text || sessionSummary.summary ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {sessionSummary.description || sessionSummary.summary_text || sessionSummary.summary}
                    </p>
                    {sessionSummary.generated_at_utc && (
                      <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
                        {t("sessions_completed", { date: new Date(sessionSummary.generated_at_utc).toLocaleDateString() })}
                      </div>
                    )}
                  </div>
                ) : sessionSummary.summary_data ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {sessionSummary.summary_data.summary ||
                       sessionSummary.summary_data.summary ||
                       t("sessions_completedInsights")}
                    </p>
                    {sessionSummary.summary_data.generated_at_utc && (
                      <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
                        {t("sessions_completed", { date: new Date(sessionSummary.summary_data.generated_at_utc).toLocaleDateString() })}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("sessions_noSummary")}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("sessions_completeForHistory")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  );
};
