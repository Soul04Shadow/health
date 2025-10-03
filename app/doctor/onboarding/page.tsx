"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function DoctorOnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    expertise: "",
    qualification: "",
    experience: "",
    languages: "",
    profile_photo: "",
    availability_time: "",
    medicalLicenseCertificate: "",
    clinicAddress: "",
    phoneNumber: "",
    preferredLanguages: "",
  })
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/doctor/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: "temp_doctor_id", // TODO: Get the actual doctor_id
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      router.push("/doctor/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Doctor Onboarding</h1>
          <p className="mt-2 text-gray-500">
            Complete your profile to get started
          </p>
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={handleChange}
                placeholder="e.g., Cardiology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., MD, PhD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (in years)</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5"
              />
            </div>
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="languages">Languages Spoken</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., English, Spanish"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLanguages">
                Preferred Languages for Consultation
              </Label>
              <Input
                id="preferredLanguages"
                value={formData.preferredLanguages}
                onChange={handleChange}
                placeholder="e.g., English"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability_time">Availability Time</Label>
              <Input
                id="availability_time"
                value={formData.availability_time}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri, 9am-5pm"
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicalLicenseCertificate">
                Medical License Certificate (URL)
              </Label>
              <Input
                id="medicalLicenseCertificate"
                value={formData.medicalLicenseCertificate}
                onChange={handleChange}
                placeholder="https://example.com/license.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile_photo">Profile Photo (URL)</Label>
              <Input
                id="profile_photo"
                value={formData.profile_photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinicAddress">Clinic Address</Label>
              <Textarea
                id="clinicAddress"
                value={formData.clinicAddress}
                onChange={handleChange}
                placeholder="123 Main St, Anytown USA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
