"use client"

import { OnboardingForm } from "@/components/doctor/OnboardingForm"

export default function DoctorOnboardingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-[80vw] h-[80vh] flex items-center justify-center">
        <OnboardingForm />
      </div>
    </div>
  )
}
