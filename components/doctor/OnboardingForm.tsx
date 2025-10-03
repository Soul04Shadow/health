"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"

export const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    expertise: "",
    qualification: "",
    experience: "",
    languages: "",
    availability_time: "",
    clinicAddress: "",
    phoneNumber: "",
    preferredLanguages: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("id")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "")
  }

  const handleSubmit = async () => {
    if (!doctorId) {
      console.error("Doctor ID is missing")
      return
    }

    if (!isFormValid()) {
      alert("Please fill all the fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/doctor/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save onboarding data")
      }

      router.push("/doctor/dashboard")
    } catch (error) {
      console.error("Failed to save onboarding data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Doctor Onboarding</h1>
        <p className="mt-2 text-gray-500">
          Complete your profile to get started
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="123-456-7890"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinicAddress">Clinic Address</Label>
          <Textarea
            id="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            placeholder="123 Main St, Anytown USA"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={!isFormValid() || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}
