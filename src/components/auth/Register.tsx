import React, { FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react";
import { User } from "../../types";
import { registerUser } from "../../services/api";
import logo from "../../assets/images/linkup-logo.png";
import mascots from "../../assets/images/linkup-mascots.png";

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onLoginClick?: () => void;
}

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  city: string;
  role: "student" | "senior_helper";
}

export default function Register({
  isOpen,
  onClose,
  onSuccess,
  onLoginClick,
}: RegisterProps) {
  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "Yiwu Industrial & Commercial College",
    city: "Yiwu",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !form.fullName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }
    if (form.username.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const { user } = await registerUser({
        fullName: form.fullName,
        username: form.username,
        email: form.email.toLowerCase(),
        password: form.password,
        university: form.university,
        city: form.city,
        role: form.role,
        bio: "",
        nativeLanguages: ["English"],
        learningLanguages: ["Chinese (Mandarin)"],
      });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldBase =
    "flex h-[52px] w-full items-center gap-3 rounded-2xl bg-[#f6f6f8] px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-[#e31f26]/40";

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <div className="relative h-screen w-full overflow-hidden bg-[#fefefe]">
        {/* ---------- decorative pink blobs ---------- */}
        <div className="pointer-events-none absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#fdecec]" />
        <div className="pointer-events-none absolute -right-44 -top-52 h-[620px] w-[620px] rounded-full bg-[#fdecec]" />
        <div className="pointer-events-none absolute -right-24 bottom-[10%] h-[260px] w-[260px] rounded-full bg-[#fdecec]" />

        {/* ---------- red sweep on bottom-left ---------- */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 hidden h-[68vh] w-[46vw] lg:block"
          viewBox="0 0 700 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="regSweepA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5333a" />
              <stop offset="100%" stopColor="#e21b22" />
            </linearGradient>
            <linearGradient id="regSweepB" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef2a30" />
              <stop offset="100%" stopColor="#c70f16" />
            </linearGradient>
          </defs>
          <path d="M0 80 C 90 260, 320 430, 700 640 L0 640 Z" fill="url(#regSweepA)" opacity="0.95" />
          <path d="M0 260 C 60 380, 240 500, 480 640 L0 640 Z" fill="url(#regSweepB)" />
        </svg>

        {/* ---------- main grid ---------- */}
        <div className="relative z-10 mx-auto grid h-full max-w-[1480px] items-center gap-8 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
          {/* =====================================================
              LEFT — brand + mascots
          ====================================================== */}
          <section className="flex flex-col items-center lg:items-start">
            {/* Logo */}
            <button
              type="button"
              onClick={onClose}
              className="block focus:outline-none"
              aria-label="Link Up home"
            >
              <img
                src={logo}
                alt="Link Up"
                className="h-auto w-[240px] sm:w-[320px] lg:w-[380px]"
                draggable={false}
              />
            </button>

            {/* Tagline */}
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 text-[19px] font-semibold text-neutral-900 lg:justify-start">
              <span>Connect</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e31f26]" />
              <span>Share</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e31f26]" />
              <span>Grow Together</span>
            </p>

            <p className="mt-3 max-w-md text-center text-[14px] leading-relaxed text-neutral-500 lg:text-left">
              Build your network, make new friends,
              <br className="hidden sm:block" /> and be part of something bigger.
            </p>

            {/* Mascots — capped height so they never push the layout */}
            <img
              src={mascots}
              alt="Link Up mascots giving a thumbs up"
              className="mt-4 hidden w-full max-w-[520px] max-h-[38vh] object-contain md:block"
              draggable={false}
            />
          </section>

          {/* =====================================================
              RIGHT — register card (scrolls internally if needed)
          ====================================================== */}
          <section className="mx-auto w-full max-w-[560px] max-h-[94vh] overflow-y-auto pr-1">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[28px] bg-white px-7 py-7 shadow-[0_30px_80px_-24px_rgba(20,20,40,0.15)] ring-1 ring-black/[0.03] sm:px-10 sm:py-9"
            >
              <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-neutral-900">
                Welcome to <span className="text-[#e31f26]">Link Up</span>
              </h1>
              <p className="mt-1.5 text-[14px] text-neutral-600">
                Create your account to start connecting.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-[#c81a20] ring-1 ring-red-100"
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  role="status"
                  className="mt-4 rounded-2xl bg-green-50 px-4 py-2.5 text-[13px] font-medium text-green-700 ring-1 ring-green-100"
                >
                  {success}
                </div>
              )}

              <div className="mt-5 space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    Full Name <span className="text-[#e31f26]">*</span>
                  </label>
                  <div className={fieldBase}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Your full name"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    Username <span className="text-[#e31f26]">*</span>
                  </label>
                  <div className={fieldBase}>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="@username"
                      autoComplete="off"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    Email Address <span className="text-[#e31f26]">*</span>
                  </label>
                  <div className={fieldBase}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@university.edu.cn"
                      autoComplete="off"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    Password <span className="text-[#e31f26]">*</span>
                  </label>
                  <div className={fieldBase}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-bold text-neutral-500 transition hover:text-[#e31f26]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    Confirm Password <span className="text-[#e31f26]">*</span>
                  </label>
                  <div className={fieldBase}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[11px] font-bold text-neutral-500 transition hover:text-[#e31f26]"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* City + Role */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                      City
                    </label>
                    <div className={fieldBase}>
                      <select
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        disabled={loading}
                        className="w-full bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer"
                      >
                        <option value="Yiwu">Yiwu</option>
                        <option value="Hangzhou">Hangzhou</option>
                        <option value="Shanghai">Shanghai</option>
                        <option value="Beijing">Beijing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                      Role
                    </label>
                    <div className={fieldBase}>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          handleChange("role", e.target.value as "student" | "senior_helper")
                        }
                        disabled={loading}
                        className="w-full bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="senior_helper">Senior Helper</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* University */}
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-neutral-800">
                    University
                  </label>
                  <div className={fieldBase}>
                    <input
                      type="text"
                      value={form.university}
                      onChange={(e) => handleChange("university", e.target.value)}
                      placeholder="Your university name"
                      disabled={loading}
                      className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[12px] leading-5 text-neutral-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded border-2 border-neutral-300 bg-white transition peer-checked:border-[#e31f26] peer-checked:bg-[#e31f26] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                    <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                  </span>
                  <span>
                    I agree to the{" "}
                    <button type="button" className="font-semibold text-[#e31f26] hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="font-semibold text-[#e31f26] hover:underline">
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#e31f26] text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(227,31,38,0.6)] transition hover:bg-[#cf161d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Creating Account…
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Login link */}
              <p className="mt-5 text-center text-[13px] text-neutral-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="font-semibold text-[#e31f26] hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}