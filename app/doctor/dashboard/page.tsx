"use client";
import { useState } from "react";
import { DoctorDashboard } from "@/components/doctor/DoctorDashboard";
import { useDoctorAuth } from "@/hooks/useDoctorAuth";
import { DashboardPage, ViewType } from "@/lib/types";
import { Doctor } from "@/lib/types";

export default function DoctorDashboardPage() {
  const { currentDoctor, handleLogout: doctorLogout } = useDoctorAuth();
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>("home");
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const handleLogout = () => {
    doctorLogout();
    window.location.href = "/doctor/login";
  };

  return (
    <DoctorDashboard
      currentDoctor={currentDoctor}
      handleLogout={handleLogout}
      dashboardPage={dashboardPage}
      setDashboardPage={setDashboardPage}
      setCurrentView={setCurrentView}
    />
  );
}
