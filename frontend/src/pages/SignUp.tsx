/*
 * Sign-up page that registers a new user with the backend.
 * Shows success feedback and redirects to sign-in after a short delay.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/signin");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, success]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await register(name, email, password);
      setSuccess(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Sign up</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Join the Coinbase clone and start exploring crypto markets.</p>

        {error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052ff]"
              placeholder="Your full name"
            />
          </label>

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
              placeholder="Create a password"
            />
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-[#0052ff]">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default SignUp;
