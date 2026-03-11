import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, RefreshCw, Shield, Zap } from "lucide-react";
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
  financial: {
    bg: "#fff7ed",
    text: "#9a3412",
    border: "#fed7aa",
    label: "Financial",
  },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (captcha.toUpperCase() !== "A3K7P2") {
      setError("Invalid captcha. Please enter: A3K7P2");
      return;
    }
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid credentials. Please verify your email and password.");
    } else {
      toast.success("Login successful. Redirecting to your dashboard...");
    }
  };

  const autoFill = (acc: (typeof demoAccounts)[0]) => {
    setEmail(acc.email);
    setPassword("Password@123");
    setCaptcha("A3K7P2");
    setError("");
    toast.info(`Credentials filled for ${acc.name}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Split Layout */}
      <div className="flex flex-1 min-h-screen">
        {/* ── Left Branding Panel ── */}
        <div
          className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #1a3a6b 0%, #0f2d57 60%, #091e3a 100%)",
          }}
        >
          {/* dot pattern overlay */}
          <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

          {/* Top brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #f5a623, #e8920d)",
                  color: "#1a3a6b",
                }}
              >
                BEE
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">
                  GOVERNMENT OF INDIA
                </p>
                <p className="text-blue-300 text-xs leading-tight">
                  Ministry of Power
                </p>
              </div>
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

            {/* Portal features */}
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  text: "Secure role-based access for Directors, Officials, SDA Purchasers & Test Labs",
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

          {/* Bottom emblem area */}
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

        {/* ── Right Login Panel ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ backgroundColor: "#f8fafc" }}
        >
          {/* Mobile top banner */}
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
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                  style={{ background: "#1a3a6b", color: "white" }}
                >
                  BEE
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#1a3a6b" }}>
                    Bureau of Energy Efficiency
                  </p>
                  <p className="text-xs text-gray-500">Check Testing Portal</p>
                </div>
              </div>

              {/* Form card */}
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
                  <div
                    className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                    data-ocid="login.error_state"
                  >
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
                      data-ocid="login.email_input"
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
                        data-ocid="login.forgot_password_link"
                        onClick={() =>
                          toast.info(
                            "Password reset link has been sent to your registered email ID.",
                          )
                        }
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
                        data-ocid="login.password_input"
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
                        data-ocid="login.captcha_input"
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
                    data-ocid="login.submit_button"
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
                    const style = roleColors[acc.role] ?? roleColors.director;
                    return (
                      <button
                        type="button"
                        key={acc.email}
                        data-ocid={`login.demo_${acc.role}_button`}
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
            </div>
          </div>

          {/* Footer */}
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
