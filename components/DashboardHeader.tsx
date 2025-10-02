import { User, DashboardPage } from "../lib/types";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface DashboardHeaderProps {
  dashboardPage: DashboardPage;
  currentUserName: string;
  currentUser: User | null;
}

const getHeaderDetails = (page: DashboardPage, name: string, t: (key: string, params?: any) => string) => {
  switch (page) {
    case "home":
      return {
        title: t("header_welcome", { name }),
        // description: "Here's your wellness overview.",
      };
    case "sessions":
      return {
        title: t("header_session"),
        // description: "Connect with your AI mentor for personalized support and guidance.",
      };
    case "resources":
      return {
        title: t("header_resources"),
        // description: "Explore exercises and tips to support your mental well-being.",
      };
    case "profile":
      return {
        title: t("header_profile"),
        // description: "Manage your personal information.",
      };
    default:
      return {
        title: t("header_dashboard"),
        description: "",
      };
  }
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dashboardPage,
  currentUserName,
  currentUser,
}) => {
  const { t, setLanguage, language } = useTranslation();
  const headerDetails = getHeaderDetails(
    dashboardPage,
    currentUserName || "User",
    t
  );

  return (
    <header className="flex justify-between items-center mb-8 md:mt-0 mt-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {headerDetails.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {headerDetails.description}
        </p>
      </div>
      <LanguageSwitcher />
    </header>
  );
};
