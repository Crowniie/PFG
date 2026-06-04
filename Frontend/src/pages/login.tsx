import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../api/auth";
import Card from "../components/card";
import Label from "../components/label";
import Input from "../components/input";
import Button from "../components/button";
import Alert from "../components/alert";

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await apiLogin({ email, password });

      if (response.success && response.user) {
        setAuthUser(response.user);
        navigate("/dashboard");
      } else {
        setError(response.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      if (err.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Could not connect. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 antialiased">
      <main className="w-full max-w-[440px]">
        <Card className="flex flex-col gap-6">
          <Header />

          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <EmailField value={email} onChange={setEmail} />
            <PasswordField
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggleShow={() => setShowPassword((s) => !s)}
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <SignUpLink />
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          By signing in you accept the{" "}
          <a
            href="#"
            className="text-teal-500/80 hover:text-teal-400 transition-colors"
          >
            terms
          </a>
        </p>
      </main>
    </div>
  );
}

// Helpers ---------------------------------------------------------------

function Header() {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 mb-2">
        <TrendingUp className="w-6 h-6 text-teal-400" />
      </div>
      <h1 className="text-2xl font-semibold">Investment Advisor</h1>
      <p className="text-slate-400">Sign in to your account</p>
    </div>
  );
}

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function EmailField({ value, onChange }: EmailFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="email">Email Address</Label>
      <div className="relative">
        <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input
          id="email"
          type="email"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="name@example.com"
          hasIconLeft
        />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
}

function PasswordField({
  value,
  onChange,
  show,
  onToggleShow,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input
          id="password"
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          hasIconLeft
          hasIconRight
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function SignUpLink() {
  return (
    <div className="text-center border-t border-slate-800 pt-4">
      <p className="text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-teal-400 hover:text-teal-300 font-medium hover:underline underline-offset-4 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
