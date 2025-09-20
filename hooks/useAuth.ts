import { useState, useEffect } from "react"
import { User, ViewType, AuthMode } from "../lib/types"
import {
  login,
  signup,
  logout,
  sendSignupOtp,
  verifySignupOtp,
  requestPasswordReset,
  resetPassword,
} from "../lib/auth"

export const useAuth = () => {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
  })
  const [signupOtp, setSignupOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [forgotPasswordModeState, setForgotPasswordMode] = useState(false)
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    otp: "",
    password: "",
  })
  const [isResetCodeSent, setIsResetCodeSent] = useState(false)
  const [isRequestingReset, setIsRequestingReset] = useState(false)
  const [isSubmittingNewPassword, setIsSubmittingNewPassword] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("curez_user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setCurrentView("dashboard")
        
        // If user data doesn't have profile fields, try to fetch from server
        if (user.uid && (!user.name || !user.age || !user.gender)) {
          fetchUserProfile(user.uid)
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("curez_user")
      }
    }
  }, [])

  useEffect(() => {
    setSignupOtp("")
    setIsOtpSent(false)
    setIsOtpVerified(false)
  }, [signupForm.email])

  const fetchUserProfile = async (uid: string) => {
    try {
      const response = await fetch(`/api/user/${uid}`)
      if (response.ok) {
        const userData = await response.json()
        
        const updatedUser = {
          uid: uid,
          email: currentUser?.email || userData.email || "",
          name: userData.name || "",
          age: userData.age || undefined,
          gender: userData.gender || "",
        }
        
        setCurrentUser(updatedUser)
        localStorage.setItem("curez_user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  const handleLogin = async () => {
    try {
      const user = await login(loginForm.email, loginForm.password)
      setCurrentUser(user)
      setCurrentView("dashboard")
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const handleSignup = async () => {
    if (!isOtpVerified) {
      alert("Please verify your email with the OTP before creating an account.")
      return
    }

    try {
      const user = await signup(signupForm)
      setCurrentUser(user)
      setCurrentView("dashboard")
      setSignupOtp("")
      setIsOtpSent(false)
      setIsOtpVerified(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const handleSendOtp = async () => {
    if (!signupForm.email) {
      alert("Please enter your email before requesting an OTP.")
      return
    }

    try {
      setIsSendingOtp(true)
      await sendSignupOtp(signupForm.email)
      setIsOtpSent(true)
      alert("Verification OTP sent to your email.")
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!signupForm.email || !signupOtp) {
      alert("Please enter the OTP sent to your email.")
      return
    }

    try {
      setIsVerifyingOtp(true)
      await verifySignupOtp(signupForm.email, signupOtp)
      setIsOtpVerified(true)
      alert("Email verified successfully.")
    } catch (error) {
      setIsOtpVerified(false)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleRequestPasswordReset = async () => {
    if (!forgotPasswordForm.email) {
      alert("Please enter your email to reset your password.")
      return
    }

    try {
      setIsRequestingReset(true)
      await requestPasswordReset(forgotPasswordForm.email)
      setIsResetCodeSent(true)
      alert("Password reset code sent to your email.")
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsRequestingReset(false)
    }
  }

  const handleSubmitPasswordReset = async () => {
    if (!forgotPasswordForm.email || !forgotPasswordForm.otp || !forgotPasswordForm.password) {
      alert("Please complete all fields to reset your password.")
      return
    }

    try {
      setIsSubmittingNewPassword(true)
      await resetPassword({
        email: forgotPasswordForm.email,
        otp: forgotPasswordForm.otp,
        newPassword: forgotPasswordForm.password,
      })
      alert("Password reset successfully. You can now log in with your new password.")
      setForgotPasswordForm({ email: "", otp: "", password: "" })
      setIsResetCodeSent(false)
      setForgotPasswordMode(false)
      setLoginForm({ email: forgotPasswordForm.email, password: "" })
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmittingNewPassword(false)
    }
  }

  const setForgotPasswordModeState = (mode: boolean) => {
    setForgotPasswordMode(mode)

    if (mode) {
      setForgotPasswordForm((prev) => ({ ...prev, email: loginForm.email || prev.email }))
    }
  }

  useEffect(() => {
    if (!forgotPasswordModeState) {
      setForgotPasswordForm({ email: "", otp: "", password: "" })
      setIsResetCodeSent(false)
      setIsRequestingReset(false)
      setIsSubmittingNewPassword(false)
    }
  }, [forgotPasswordModeState])

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    setCurrentView("auth")
    // Note: audioClient close will be handled in session hook
  }

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem("curez_user", JSON.stringify(user))
  }

  return {
    currentView,
    setCurrentView,
    authMode,
    setAuthMode,
    currentUser,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    handleLogin,
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    handleLogout,
    updateCurrentUser,
    signupOtp,
    setSignupOtp,
    isOtpSent,
    isOtpVerified,
    isSendingOtp,
    isVerifyingOtp,
    forgotPasswordMode: forgotPasswordModeState,
    setForgotPasswordMode: setForgotPasswordModeState,
    forgotPasswordForm,
    setForgotPasswordForm,
    isResetCodeSent,
    isRequestingReset,
    isSubmittingNewPassword,
    handleRequestPasswordReset,
    handleSubmitPasswordReset,
  }
}
