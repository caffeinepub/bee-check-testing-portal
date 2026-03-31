import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { demoAccounts, useAuth } from "../contexts/AuthContext";

const roleColors: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  director: {
    bg: "#eff6ff",
    text: "#1e40af",
    border: "#bfdbfe",
    label: "Director",
  },
  official: {
    bg: "#f0fdf4",
    text: "#166534",
    border: "#bbf7d0",
    label: "Official",
  },
  purchaser: {
    bg: "#fffbeb",
    text: "#92400e",
    border: "#fde68a",
    label: "Purchaser",
  },
  lab: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff", label: "Test Lab" },
  labcoordinator: {
    bg: "#ecfeff",
    text: "#0e7490",
    border: "#a5f3fc",
    label: "Lab Coord.",
  },
  complianceofficer: {
    bg: "#fef2f2",
    text: "#991b1b",
    border: "#fecaca",
    label: "Compliance",
  },
  financialofficial: {
    bg: "#fff7ed",
    text: "#9a3412",
    border: "#fed7aa",
    label: "Financial",
  },
};

type Step = "credentials" | "otp" | "forgot";

const DEMO_OTP = "283641";

export default function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (captcha.toUpperCase() !== "A3K7P2") {
      setError("Invalid captcha. Please enter: A3K7P2");
      return;
    }
    const account = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );
    if (!account || password !== "Password@123") {
      setError("Invalid credentials. Please verify your email and password.");
      return;
    }
    setPendingEmail(email);
    setOtpValue("");
    setOtpError("");
    setStep("otp");
    toast.info(`OTP sent to ${email}. (Demo OTP: ${DEMO_OTP})`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue !== DEMO_OTP) {
      setOtpError("Invalid OTP. Please check and try again.");
      return;
    }
    const ok = login(pendingEmail, "Password@123");
    if (!ok) {
      setOtpError("Authentication failed. Please try again.");
    } else {
      toast.success("Login successful. Redirecting to your dashboard...");
    }
  };

  const handleResendOtp = () => {
    setOtpValue("");
    setOtpError("");
    toast.info(`OTP resent to ${pendingEmail}. (Demo OTP: ${DEMO_OTP})`);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoAccounts.find(
      (a) => a.email.toLowerCase() === forgotEmail.toLowerCase(),
    );
    if (!found) {
      setForgotError("No account found with this email address.");
      return;
    }
    setForgotSent(true);
    setForgotError("");
    toast.success(`Password reset link sent to ${forgotEmail}`);
  };

  const autoFill = (acc: (typeof demoAccounts)[0]) => {
    setEmail(acc.email);
    setPassword("Password@123");
    setCaptcha("A3K7P2");
    setError("");
    setStep("credentials");
    toast.info(`Credentials filled for ${acc.name}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="flex flex-1 min-h-screen">
        {/* ── Left Branding Panel ── */}
        <div
          className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #1a3a6b 0%, #0f2d57 60%, #091e3a 100%)",
          }}
        >
          <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-8">
              <img
                src="/assets/generated/bee_logo_transparent.png"
                alt="Bureau of Energy Efficiency — Ministry of Power, Government of India"
                className="h-14 max-w-full object-contain bg-white rounded-xl px-3 py-1.5"
              />
            </div>

            <div className="mb-8">
              <h1
                className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-2"
                style={{ fontFamily: "'Sora', system-ui, sans-serif" }}
              >
                Bureau of Energy
                <span style={{ color: "#f5a623" }}> Efficiency</span>
              </h1>
              <p className="text-blue-200 text-base font-medium leading-snug mb-1">
                Standards & Labelling Programme
              </p>
              <p className="text-blue-300 text-sm font-semibold tracking-wider uppercase">
                Check Testing Portal
              </p>
            </div>

            <div className="h-px bg-blue-700/60 mb-8" />

            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  text: "Secure role-based access for Directors, Officials, SDA Purchasers, Test Labs & Lab Coordinators",
                },
                {
                  icon: Zap,
                  text: "Real-time tracking of product testing, star ratings & compliance status",
                },
                {
                  icon: RefreshCw,
                  text: "Automated workflow management from target creation to final certification",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(245,166,35,0.15)",
                      border: "1px solid rgba(245,166,35,0.3)",
                    }}
                  >
                    <Icon size={14} style={{ color: "#f5a623" }} />
                  </div>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="h-px bg-blue-700/50 mb-5" />
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{
                  borderColor: "rgba(245,166,35,0.5)",
                  color: "#f5a623",
                }}
              >
                GOI
              </div>
              <div>
                <p className="text-blue-300 text-xs">Powered by CLASP & BEE</p>
                <p className="text-blue-400 text-xs">
                  Government of India Initiative
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <div
            className="lg:hidden py-3 px-6 text-center"
            style={{ backgroundColor: "#1a3a6b" }}
          >
            <p className="text-white text-sm font-medium">
              Bureau of Energy Efficiency | Government of India
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden flex items-center justify-center mb-8">
                <img
                  src="/assets/generated/bee_logo_transparent.png"
                  alt="Bureau of Energy Efficiency — Ministry of Power, Government of India"
                  className="h-12 max-w-full object-contain"
                />
              </div>

              {/* ── CREDENTIALS STEP ── */}
              {step === "credentials" && (
                <>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
                    <div className="mb-7">
                      <h2
                        className="text-2xl font-bold mb-1"
                        style={{
                          color: "#1a3a6b",
                          fontFamily: "'Sora', system-ui, sans-serif",
                        }}
                      >
                        Sign In
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Enter your credentials to access the portal
                      </p>
                    </div>

                    {error && (
                      <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          !
                        </span>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-gray-700 mb-1.5 block"
                        >
                          Email ID / Username
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter your official email ID"
                          className="h-11 rounded-xl border-gray-200 focus:border-blue-400 bg-gray-50/50"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Password
                          </Label>
                          <button
                            type="button"
                            className="text-xs font-medium hover:underline"
                            style={{ color: "#1a3a6b" }}
                            onClick={() => {
                              setForgotEmail(email);
                              setForgotSent(false);
                              setForgotError("");
                              setStep("forgot");
                            }}
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter your password"
                            className="h-11 rounded-xl border-gray-200 focus:border-blue-400 bg-gray-50/50 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                          CAPTCHA Verification
                        </Label>
                        <div className="flex items-stretch gap-3">
                          <div
                            className="flex items-center px-5 py-2.5 rounded-xl border-2 select-none"
                            style={{
                              background:
                                "linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)",
                              borderColor: "#93c5fd",
                              fontFamily: "'Courier New', monospace",
                              fontSize: "18px",
                              fontWeight: 800,
                              letterSpacing: "0.35em",
                              color: "#1e3a8a",
                              textDecoration: "line-through",
                              textDecorationColor: "#93c5fd",
                              textDecorationStyle: "wavy",
                              minWidth: "130px",
                              justifyContent: "center",
                            }}
                          >
                            A3K7P2
                          </div>
                          <Input
                            value={captcha}
                            onChange={(e) => {
                              setCaptcha(e.target.value);
                              setError("");
                            }}
                            placeholder="Type captcha"
                            className="flex-1 h-auto rounded-xl border-gray-200 focus:border-blue-400 bg-gray-50/50 font-mono tracking-widest"
                            maxLength={6}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                          Type exactly: A3K7P2 (uppercase)
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a3a6b 0%, #1e4a8a 100%)",
                          color: "white",
                        }}
                      >
                        Login to Portal
                      </Button>
                    </form>
                  </div>

                  {/* Demo Credentials Card */}
                  <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#1a3a6b" }}
                      >
                        i
                      </div>
                      <h3
                        className="font-bold text-sm"
                        style={{ color: "#1a3a6b" }}
                      >
                        Demo Login Credentials
                      </h3>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Click to auto-fill
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 ml-8">
                      Password:{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded-md font-mono text-gray-700">
                        Password@123
                      </code>
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {demoAccounts.map((acc) => {
                        const style =
                          roleColors[acc.role] ?? roleColors.director;
                        return (
                          <button
                            type="button"
                            key={acc.email}
                            onClick={() => autoFill(acc)}
                            className="text-left p-3 rounded-xl border transition-all hover:shadow-sm group"
                            style={{
                              backgroundColor: style.bg,
                              borderColor: style.border,
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: style.border,
                                  color: style.text,
                                }}
                              >
                                {style.label}
                              </span>
                            </div>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: style.text }}
                            >
                              {acc.name}
                            </p>
                            <p
                              className="text-xs truncate mt-0.5"
                              style={{ color: style.text, opacity: 0.7 }}
                            >
                              {acc.email}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className="mt-4 p-3 rounded-xl text-xs"
                      style={{
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fde68a",
                        color: "#78350f",
                      }}
                    >
                      <strong>Note:</strong> Prototype demonstration portal. All
                      data shown is for demonstration purposes only.
                    </div>
                  </div>
                </>
              )}

              {/* ── OTP STEP ── */}
              {step === "otp" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtpValue("");
                      setOtpError("");
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                  >
                    <ArrowLeft size={15} /> Back to Login
                  </button>

                  <div className="flex flex-col items-center text-center mb-7">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                        border: "2px solid #93c5fd",
                      }}
                    >
                      <KeyRound size={24} style={{ color: "#1e40af" }} />
                    </div>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{
                        color: "#1a3a6b",
                        fontFamily: "'Sora', system-ui, sans-serif",
                      }}
                    >
                      OTP Verification
                    </h2>
                    <p className="text-gray-500 text-sm">
                      A 6-digit OTP has been sent to
                    </p>
                    <p
                      className="font-semibold text-sm mt-0.5"
                      style={{ color: "#1a3a6b" }}
                    >
                      {pendingEmail}
                    </p>
                  </div>

                  <div
                    className="mb-6 p-3.5 rounded-xl text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      color: "#166534",
                    }}
                  >
                    <Mail size={16} className="flex-shrink-0" />
                    <span>
                      Demo OTP:{" "}
                      <strong className="font-mono tracking-widest">
                        {DEMO_OTP}
                      </strong>
                    </span>
                  </div>

                  {otpError && (
                    <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        !
                      </span>
                      {otpError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <Label className="text-sm font-semibold text-gray-700 self-start">
                        Enter 6-Digit OTP
                      </Label>
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={(val) => {
                          setOtpValue(val);
                          setOtpError("");
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <p className="text-xs text-gray-400">
                        Enter the OTP sent to your registered email
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #1a3a6b 0%, #1e4a8a 100%)",
                        color: "white",
                      }}
                      disabled={otpValue.length < 6}
                    >
                      Verify OTP & Login
                    </Button>

                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        Didn't receive the OTP?{" "}
                      </span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "#1a3a6b" }}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── FORGOT PASSWORD STEP ── */}
              {step === "forgot" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setForgotEmail("");
                      setForgotSent(false);
                      setForgotError("");
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                  >
                    <ArrowLeft size={15} /> Back to Login
                  </button>

                  <div className="flex flex-col items-center text-center mb-7">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                        border: "2px solid #93c5fd",
                      }}
                    >
                      <Mail size={24} style={{ color: "#1e40af" }} />
                    </div>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{
                        color: "#1a3a6b",
                        fontFamily: "'Sora', system-ui, sans-serif",
                      }}
                    >
                      Forgot Password
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Enter your registered email ID to receive a password reset
                      link
                    </p>
                  </div>

                  {forgotSent ? (
                    <div
                      className="p-5 rounded-xl text-center"
                      style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: "#dcfce7" }}
                      >
                        <span className="text-2xl">✓</span>
                      </div>
                      <p
                        className="font-semibold text-sm mb-1"
                        style={{ color: "#166534" }}
                      >
                        Reset Link Sent!
                      </p>
                      <p className="text-xs text-gray-600">
                        A password reset link has been sent to{" "}
                        <strong>{forgotEmail}</strong>. Please check your inbox
                        and follow the instructions.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStep("credentials");
                          setForgotEmail("");
                          setForgotSent(false);
                        }}
                        className="mt-4 text-xs font-semibold hover:underline"
                        style={{ color: "#1a3a6b" }}
                      >
                        Return to Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotSubmit} className="space-y-5">
                      {forgotError && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            !
                          </span>
                          {forgotError}
                        </div>
                      )}
                      <div>
                        <Label
                          htmlFor="forgot-email"
                          className="text-sm font-semibold text-gray-700 mb-1.5 block"
                        >
                          Registered Email ID
                        </Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setForgotError("");
                          }}
                          placeholder="Enter your registered email address"
                          className="h-11 rounded-xl border-gray-200 focus:border-blue-400 bg-gray-50/50"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a3a6b 0%, #1e4a8a 100%)",
                          color: "white",
                        }}
                      >
                        Send Reset Link
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer
            className="py-3 px-6 text-center text-xs border-t"
            style={{
              backgroundColor: "#1a3a6b",
              borderColor: "#1a3a6b",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            © {new Date().getFullYear()} Bureau of Energy Efficiency | Ministry
            of Power, Government of India | All Rights Reserved
          </footer>
        </div>
      </div>
    </div>
  );
}
