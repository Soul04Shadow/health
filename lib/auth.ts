import { User } from "./types";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { app } from "./firebase"; // Assuming you have a firebase initialization file

const auth = getAuth(app);

type FirebaseErrorResponse = {
  error?: {
    message?: string;
  };
};

type AccountInfoResponse = {
  users?: Array<{
    localId: string;
    phoneNumber?: string;
    displayName?: string;
  }>;
};

type SignupFormData = {
  phoneNumber: string;
  name: string;
  age: string;
  gender: string;
};

type SyncProfileParams = {
  uid: string;
  phoneNumber: string;
  name?: string;
  age?: number;
  gender?: string;
};

export type SignupResult = {
  uid: string;
  phoneNumber: string;
};

const mapFirebaseError = (code?: string) => {
  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    case "auth/invalid-verification-code":
      return "Invalid OTP.";
    default:
      return code ? code.replace(/_/g, " ").toLowerCase() : undefined;
  }
};

const syncUserProfile = async ({
  uid,
  phoneNumber,
  name,
  age,
  gender,
}: SyncProfileParams) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        phoneNumber,
        name,
        age,
        gender,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      console.warn(
        "Failed to persist user profile:",
        data.error || response.statusText
      );
    }
  } catch (error) {
    console.error("Failed to sync user profile:", error);
  }
};

export const setupRecaptcha = (elementId: string) => {
  if (typeof window !== "undefined") {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  }
};

export const sendOtp = async (
  phoneNumber: string
): Promise<ConfirmationResult> => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    if (error instanceof Error) {
      const message = mapFirebaseError((error as any).code);
      throw new Error(message || "Failed to send OTP. Please try again.");
    }
    throw new Error("Failed to send OTP. Please try again.");
  }
};

export const verifyOtp = async (
  confirmationResult: ConfirmationResult,
  otp: string,
  formData: Omit<SignupFormData, "phoneNumber">
): Promise<User> => {
  try {
    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;

    if (!firebaseUser) {
      throw new Error("Unable to retrieve user information.");
    }

    await syncUserProfile({
      uid: firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber!,
      name: formData.name,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
    });

    let profile: User | null = null;

    try {
      profile = await getCurrentUser(firebaseUser.uid);
    } catch (error) {
      console.warn("Failed to load profile from database:", error);
    }

    const user: User = {
      uid: firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber!,
      name: profile?.name || formData.name || undefined,
      age: profile?.age,
      gender: profile?.gender,
    };

    localStorage.setItem("curez_user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("OTP verification failed:", error);
    if (error instanceof Error) {
      const message = mapFirebaseError((error as any).code);
      throw new Error(message || "OTP verification failed. Please try again.");
    }
    throw new Error("OTP verification failed. Please try again.");
  }
};

export const getCurrentUser = async (uid: string): Promise<User> => {
  try {
    const response = await fetch(`/api/user/${uid}`);
    const data = await response.json();

    if (response.ok) {
      const user: User = {
        uid: data.uid || uid,
        phoneNumber: data.phoneNumber,
        name: data.name,
        age: data.age,
        gender: data.gender,
      };
      return user;
    } else {
      throw new Error(data.error || "Failed to fetch user data");
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data. Please try again.");
  }
};

export const logout = () => {
  localStorage.removeItem("curez_user");
  if (auth) {
    auth.signOut();
  }
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
