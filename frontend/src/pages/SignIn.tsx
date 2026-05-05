/*
 * Sign-in page that logs the user in through the backend cookie-based auth flow.
 * Displays a clear error message when the login request fails.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Sign in</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to Coinbase</h1>
        <p className="mt-2 text-sm text-slate-600">Use your email and password to access your account.</p>

        {error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052ff]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052ff]"
              placeholder="Enter your password"
            />
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Dont have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#0052ff]">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default SignIn;
