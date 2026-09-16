import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    signIn({ email });
    const redirectTo = location.state?.from || "/";
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthShell>
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Sign in to track flood risk across your neighborhood.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit">
          Sign In
        </button>
      </form>

      <p className="auth-switch">
        New to HydroRisk? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo size={44} />
          <span>
            Hydro<strong>Risk</strong>
          </span>
        </div>
        {children}
      </div>
      <p className="auth-footnote">HydroRisk · Citizen Safety Portal · Hyderabad</p>
    </div>
  );
}
