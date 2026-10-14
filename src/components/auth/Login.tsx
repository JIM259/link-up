import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Check } from "lucide-react";
import { User } from "../../types";
import { loginUser } from "../../services/api";
import logo from "../../assets/images/linkup-logo.png";
import mascots from "../../assets/images/linkup-mascots.png";

interface LoginProps {
  isOpen: boolean;
  initialMode?: "login";
  onClose: () => void;
  onSuccess: (user: User) => void;
  onRegisterClick: () => void;
}

const REMEMBER_KEY = "linkup_remembered_identifier";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path fill="#fff" d="M16.7 15.5l.5-3.5h-3.4V9.8c0-1 .5-1.9 2-1.9h1.5V4.9s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7V12H6.9v3.5H10V24h3.8v-8.5h2.9z" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#111" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#111" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Login: React.FC<LoginProps> = ({ isOpen, onClose, onSuccess, onRegisterClick }) => {
  const [identifier, setIdentifier] = useState(() => {
    try { return localStorage.getItem(REMEMBER_KEY) || ""; } catch { return ""; }
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const identifierError = useMemo(() => {
    const v = identifier.trim();
    if (!v) return "Enter your email or username";
    if (v.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "That email address looks incomplete";
    return null;
  }, [identifier]);
  const passwordError = useMemo(() => (password ? null : "Enter your password"), [password]);
  const canSubmit = !identifierError && !passwordError && !loading;

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
      setTouched({ identifier: false, password: false });
      setError(null);
      setNotice(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });
    setNotice(null);
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const { user } = await loginUser(identifier.trim(), password);
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, identifier.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch { /* storage unavailable */ }
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const social = (name: string) => {
    setError(null);
    setNotice(`${name} sign-in isn't available yet. Please log in with your email or username.`);
  };

  const socials = [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Facebook", icon: <FacebookIcon /> },
    { name: "GitHub", icon: <GithubIcon /> },
    { name: "X", icon: <XIcon /> },
  ];

  const fieldBase =
    "flex h-[58px] items-center gap-4 rounded-2xl bg-[#f6f6f8] px-5 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-[#e31f26]/40";

  if (!isOpen) return null;

  return (
    // 👇 Starts BELOW the header (top-20 = 80px) and sits at z-40
    <div className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-white">
      <div className="relative min-h-full w-full overflow-hidden bg-[#fefefe]">
        <div className="pointer-events-none absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#fdecec]" />
        <div className="pointer-events-none absolute -right-44 -top-52 h-[620px] w-[620px] rounded-full bg-[#fdecec]" />
        <div className="pointer-events-none absolute -right-24 bottom-[10%] h-[260px] w-[260px] rounded-full bg-[#fdecec]" />

        <svg
          className="pointer-events-none absolute bottom-0 left-0 hidden h-[68vh] w-[46vw] lg:block"
          viewBox="0 0 700 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sweepA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5333a" />
              <stop offset="100%" stopColor="#e21b22" />
            </linearGradient>
            <linearGradient id="sweepB" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef2a30" />
              <stop offset="100%" stopColor="#c70f16" />
            </linearGradient>
          </defs>
          <path d="M0 80 C 90 260, 320 430, 700 640 L0 640 Z" fill="url(#sweepA)" opacity="0.95" />
          <path d="M0 260 C 60 380, 240 500, 480 640 L0 640 Z" fill="url(#sweepB)" />
        </svg>

        <div className="relative z-10 mx-auto grid min-h-full max-w-[1480px] items-center gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
          <section className="flex flex-col items-center lg:items-start">
            <button
              type="button"
              onClick={onClose}
              className="block focus:outline-none"
              aria-label="Link Up home"
            >
              <img src={logo} alt="Link Up" className="h-auto w-[280px] sm:w-[360px] lg:w-[420px]" draggable={false} />
            </button>

            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 text-[20px] font-semibold text-neutral-900 lg:justify-start">
              <span>Connect</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e31f26]" />
              <span>Share</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e31f26]" />
              <span>Grow Together</span>
            </p>

            <p className="mt-3 max-w-md text-center text-[15px] leading-relaxed text-neutral-500 lg:text-left">
              Build your network, make new friends,
              <br className="hidden sm:block" /> and be part of something bigger.
            </p>

            <img
              src={mascots}
              alt="Link Up mascots giving a thumbs up"
              className="mt-6 hidden w-full max-w-[600px] md:block"
              draggable={false}
            />
          </section>

          <section className="mx-auto w-full max-w-[560px]">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[28px] bg-white px-8 py-12 shadow-[0_30px_80px_-24px_rgba(20,20,40,0.15)] ring-1 ring-black/[0.03] sm:px-12 sm:py-14"
            >
              <h1 className="text-[38px] font-extrabold leading-tight tracking-tight text-neutral-900">
                Welcome <span className="text-[#e31f26]">Back!</span>
              </h1>
              <p className="mt-2 text-[16px] text-neutral-600">
                Log in to your Link Up account
              </p>

              {error && (
                <div role="alert" className="mt-6 rounded-2xl bg-red-50 px-5 py-3 text-sm font-medium text-[#c81a20] ring-1 ring-red-100">
                  {error}
                </div>
              )}
              {notice && (
                <div role="status" className="mt-6 rounded-2xl bg-neutral-100 px-5 py-3 text-sm text-neutral-700">
                  {notice}
                </div>
              )}

              <div className="mt-8 space-y-4">
                <div>
                  <label className={fieldBase}>
                    <Mail className="h-5 w-5 shrink-0 text-neutral-500" />
                    <input
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
                      onBlur={() => setTouched((t) => ({ ...t, identifier: true }))}
                      placeholder="Email or Username"
                      className="w-full bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </label>
                  {touched.identifier && identifierError && (
                    <p className="mt-1.5 pl-5 text-xs text-[#e31f26]">{identifierError}</p>
                  )}
                </div>

                <div>
                  <label className={fieldBase}>
                    <Lock className="h-5 w-5 shrink-0 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      placeholder="Password"
                      className="w-full bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-neutral-500 transition hover:text-neutral-900"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </label>
                  {touched.password && passwordError && (
                    <p className="mt-1.5 pl-5 text-xs text-[#e31f26]">{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-[14px]">
                <label className="flex cursor-pointer select-none items-center gap-3 text-neutral-800">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
                  <span className="grid h-5 w-5 place-items-center rounded-md border-2 border-neutral-300 bg-white transition peer-checked:border-[#e31f26] peer-checked:bg-[#e31f26] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />
                  </span>
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => { setError(null); setNotice("Password reset isn't available yet. Please contact your campus admin."); }}
                  className="font-medium text-[#e31f26] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#e31f26] text-[17px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(227,31,38,0.6)] transition hover:bg-[#cf161d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Logging in…</>
                ) : (
                  <>Log In <ArrowRight className="h-5 w-5" /></>
                )}
              </button>

              <div className="my-6 flex items-center gap-5 text-neutral-400">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-[13px]">or</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {socials.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => social(s.name)}
                    className="grid h-[52px] place-items-center rounded-full border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {s.icon}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-center text-[14px] text-neutral-600">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={onRegisterClick} className="font-semibold text-[#e31f26] hover:underline">
                  Sign Up
                </button>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;