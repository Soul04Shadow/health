export interface AudioClientType {
  connect: () => Promise<void>
  startRecording: () => Promise<boolean>
  stopRecording: () => void
  close: () => void
  ws: WebSocket | null
  onReady: () => void
  onAudioReceived: (data: string) => void
  onTextReceived: (text: string) => void
  onTurnComplete: () => void
  onError: (error: any) => void
  onInterrupted: () => void
  interrupt: () => void
  sendTextMessage: (message: string) => void
  inputMode: "audio" | "text"
  setUserId: (uid: string) => void
}

export interface User {
  uid: string
  email: string
  name?: string
  age?: number
  gender?: string
}

export interface Message {
  text: string
  sender: "user" | "assistant"
}

export interface MoodData {
  mood: string
  mood_percentage: number
  energy_level: number
  stress_level: number
  mood_stability: string
  mood_calmness: string
  generated_at_utc: string
}

export type ViewType = "landing" | "auth" | "dashboard" | "session"
export type AuthMode = "login" | "signup"
export type DashboardPage = "home" | "sessions" | "resources" | "community" | "profile"
export type InputMode = "audio" | "text"

export interface Exercise {
  id: string
  exercise_name: string
  procedure: string
  bgSound: string
  video_link: string
  expected_time_to_complete: string
  image: string
}