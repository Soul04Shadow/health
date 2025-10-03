import { useState, useEffect } from "react";
import { Doctor, ViewType, AuthMode } from "../lib/types";
import {
  signup as doctorSignup,
  login as doctorLogin,
  logout as doctorLogout,
} from "../lib/doctor-auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);

export const useDoctorAuth = () => {
  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [signupForm, setSignupForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // This is a simplified version. In a real app, you'd fetch the doctor's profile from your database.
        const doctor: Doctor = {
          doctor_id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          age: 0,
          gender: "",
          expertise: "",
          qualification: "",
          experience: 0,
          languages: [],
          profile_photo: "",
          availability_time: "",
          medicalLicenseCertificate: "",
          clinicAddress: "",
          phoneNumber: "",
          preferredLanguages: [],
          averageRating: 0,
          reviewStars: [],
        };
        setCurrentDoctor(doctor);
        setCurrentView("dashboard");
      } else {
        setCurrentDoctor(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignup = async () => {
    if (!signupForm.email || !signupForm.password || !signupForm.name || !signupForm.age || !signupForm.gender) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      await doctorSignup(signupForm);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      alert("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    try {
      await doctorLogin(loginForm.email, loginForm.password);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    doctorLogout();
  };

  return {
    currentView,
    setCurrentView,
    authMode,
    setAuthMode,
    currentDoctor,
    signupForm,
    setSignupForm,
    loginForm,
    setLoginForm,
    handleSignup,
    handleLogin,
    handleLogout,
    isLoading,
  };
};
