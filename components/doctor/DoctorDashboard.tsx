import { useState, useEffect } from "react";
import { Doctor, DashboardPage, ViewType } from "../../lib/types";
import { useTranslation } from "@/hooks/useTranslation";
import { DoctorSidebar } from "./DoctorSidebar";
import { DashboardHeader } from "../DashboardHeader";

interface DoctorDashboardProps {
  currentDoctor: Doctor | null;
  handleLogout: () => void;
  dashboardPage: DashboardPage;
  setDashboardPage: (page: DashboardPage) => void;
  setCurrentView: (view: ViewType) => void;
  onDoctorUpdate?: (doctor: Doctor) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentDoctor,
  handleLogout,
  dashboardPage,
  setDashboardPage,
  setCurrentView,
  onDoctorUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex relative">
      <DoctorSidebar
        dashboardPage={dashboardPage}
        setDashboardPage={setDashboardPage}
        handleLogout={handleLogout}
        onNavigateToLanding={() => setCurrentView("landing")}
      />
      <main className="flex-1 p-6 md:p-8 transition-all duration-300">
        <DashboardHeader
          dashboardPage={dashboardPage}
          currentUserName={currentDoctor?.name || ""}
          currentUser={null} // Pass null for currentUser as this is a doctor dashboard
        />

        {/* Dashboard Content */}
        {dashboardPage === "home" && (
          <div>
            <h1 className="text-2xl font-bold">{t("doctor_dashboard_home_title")}</h1>
            <p>{t("doctor_dashboard_home_description")}</p>
          </div>
        )}

        {dashboardPage === "patients" && (
          <div>
            <h1 className="text-2xl font-bold">{t("doctor_dashboard_patients_title")}</h1>
            <p>{t("doctor_dashboard_patients_description")}</p>
          </div>
        )}

        {dashboardPage === "appointments" && (
          <div>
            <h1 className="text-2xl font-bold">{t("doctor_dashboard_appointments_title")}</h1>
            <p>{t("doctor_dashboard_appointments_description")}</p>
          </div>
        )}

        {dashboardPage === "profile" && (
          <div>
            <h1 className="text-2xl font-bold">{t("doctor_dashboard_profile_title")}</h1>
            <p>{t("doctor_dashboard_profile_description")}</p>
          </div>
        )}
      </main>
    </div>
  );
};
