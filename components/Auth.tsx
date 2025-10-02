import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle } from "lucide-react"
import { AuthMode } from "../lib/types"
import { useTranslation } from "@/hooks/useTranslation"

interface AuthProps {
  authMode: AuthMode
  setAuthMode: (mode: AuthMode) => void
  loginForm: { email: string; password: string }
  setLoginForm: (form: { email: string; password: string }) => void
  signupForm: { email: string; password: string; name: string; age: string; gender: string }
  setSignupForm: (form: { email: string; password: string; name: string; age: string; gender: string }) => void
  handleLogin: () => void
  handleSignup: () => void
  isLoggingIn: boolean
  isSigningUp: boolean
  forgotPasswordMode: boolean
  setForgotPasswordMode: (mode: boolean) => void
  forgotPasswordEmail: string
  setForgotPasswordEmail: (email: string) => void
  isSendingResetEmail: boolean
  resetEmailSentTo: string | null
  handleRequestPasswordReset: () => void
  signupVerificationEmail: string | null
  unverifiedLoginEmail: string | null
}

const InfoBanner: React.FC<{ message: string; tone?: "info" | "warning" }> = ({ message, tone = "info" }) => {
  const toneClasses =
    tone === "warning"
      ? "bg-amber-100 text-amber-900 border-amber-200"
      : "bg-sky-100 text-sky-900 border-sky-200"
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${toneClasses}`}>
      {message}
    </div>
  )
}

export const Auth: React.FC<AuthProps> = ({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  signupForm,
  setSignupForm,
  handleLogin,
  handleSignup,
  isLoggingIn,
  isSigningUp,
  forgotPasswordMode,
  setForgotPasswordMode,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  isSendingResetEmail,
  resetEmailSentTo,
  handleRequestPasswordReset,
  signupVerificationEmail,
  unverifiedLoginEmail,
}) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <MessageCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("auth_welcome")}
            </CardTitle>
            <CardDescription className="text-lg mt-2">{t("auth_welcomeDesc")}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("auth_login")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth_signup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {unverifiedLoginEmail && (
                <InfoBanner
                  tone="warning"
                  message={t("auth_unverifiedEmail", { email: unverifiedLoginEmail })}
                />
              )}
              {!forgotPasswordMode ? (
                <>
                  <Input
                    type="email"
                    placeholder={t("auth_email")}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="h-12"
                  />
                  <Input
                    type="password"
                    placeholder={t("auth_password")}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="h-12"
                  />
                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? t("auth_loggingIn") : t("auth_login")}
                  </Button>
                  <Button variant="link" onClick={() => setForgotPasswordMode(true)} className="w-full">
                    {t("auth_forgotPassword")}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder={t("auth_email")}
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="h-12"
                  />
                  {resetEmailSentTo && (
                    <InfoBanner
                      message={t("auth_resetLinkSent", { email: resetEmailSentTo })}
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t("auth_resetLinkDesc")}
                  </p>
                  <Button
                    onClick={handleRequestPasswordReset}
                    disabled={isSendingResetEmail}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {isSendingResetEmail ? t("auth_sendingResetLink") : t("auth_sendResetLink")}
                  </Button>
                  <Button variant="ghost" onClick={() => setForgotPasswordMode(false)} className="w-full">
                    {t("auth_backToLogin")}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {signupVerificationEmail && (
                <InfoBanner
                  message={t("auth_verificationSent", { email: signupVerificationEmail })}
                />
              )}
              <Input
                type="text"
                placeholder={t("auth_fullName")}
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                className="h-12"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t("auth_age")}
                  min="13"
                  max="25"
                  value={signupForm.age}
                  onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                  className="h-12"
                  required
                />
                <Select
                  value={signupForm.gender}
                  onValueChange={(value) => setSignupForm({ ...signupForm, gender: value })}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("auth_gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("auth_male")}</SelectItem>
                    <SelectItem value="female">{t("auth_female")}</SelectItem>
                    <SelectItem value="non-binary">{t("auth_nonBinary")}</SelectItem>
                    <SelectItem value="prefer-not-to-say">{t("auth_preferNotToSay")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="email"
                placeholder={t("auth_email")}
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                className="h-12"
                required
              />
              <Input
                type="password"
                placeholder={t("auth_passwordMin")}
                minLength={6}
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                {t("auth_verificationNotice")}
              </p>
              <Button
                onClick={handleSignup}
                className="w-full h-12 text-lg font-semibold"
                disabled={isSigningUp}
              >
                {isSigningUp ? t("auth_creatingAccount") : t("auth_createAccount")}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
