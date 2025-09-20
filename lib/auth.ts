import { User } from "./types"

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()

    if (response.ok) {
      const user: User = { 
        uid: data.uid, 
        email,
        name: data.name,
        age: data.age,
        gender: data.gender
      }
      localStorage.setItem("curez_user", JSON.stringify(user))
      return user
    } else {
      throw new Error(data.error || "Login failed")
    }
  } catch (error) {
    console.error("Login failed:", error)
    throw new Error("Login failed. Please try again.")
  }
}

export const signup = async (formData: {
  email: string
  password: string
  name: string
  age: string
  gender: string
}): Promise<User> => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()

    if (response.ok) {
      const user: User = {
        uid: data.uid,
        email: formData.email,
        name: formData.name,
        age: Number.parseInt(formData.age),
        gender: formData.gender,
      }
      localStorage.setItem("curez_user", JSON.stringify(user))
      return user
    } else {
      throw new Error(data.error || "Signup failed")
    }
  } catch (error) {
    console.error("Signup failed:", error)
    throw new Error("Signup failed. Please try again.")
  }
}

export const sendSignupOtp = async (email: string): Promise<void> => {
  try {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to send verification OTP")
    }
  } catch (error) {
    console.error("Failed to send verification OTP:", error)
    throw new Error("Failed to send verification OTP. Please try again.")
  }
}

export const verifySignupOtp = async (email: string, otp: string): Promise<void> => {
  try {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to verify OTP")
    }
  } catch (error) {
    console.error("Failed to verify OTP:", error)
    throw new Error("Failed to verify OTP. Please try again.")
  }
}

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to request password reset")
    }
  } catch (error) {
    console.error("Failed to request password reset:", error)
    throw new Error("Failed to request password reset. Please try again.")
  }
}

export const resetPassword = async (params: {
  email: string
  otp: string
  newPassword: string
}): Promise<void> => {
  try {
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to reset password")
    }
  } catch (error) {
    console.error("Failed to reset password:", error)
    throw new Error("Failed to reset password. Please try again.")
  }
}
export const getCurrentUser = async (uid: string): Promise<User> => {
  try {
    const response = await fetch(`/api/user/${uid}`)
    const data = await response.json()

    if (response.ok) {
      const user: User = {
        uid: data.uid,
        email: data.email,
        name: data.name,
        age: data.age,
        gender: data.gender,
      }
      return user
    } else {
      throw new Error(data.error || "Failed to fetch user data")
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error)
    throw new Error("Failed to fetch user data. Please try again.")
  }
}
export const logout = () => {
  localStorage.removeItem("curez_user")
}
