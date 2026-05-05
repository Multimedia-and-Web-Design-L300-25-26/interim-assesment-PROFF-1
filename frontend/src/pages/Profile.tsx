/*
 * Protected profile page that shows the signed-in user's account details.
 * The page also provides a logout action that clears the auth cookie.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type AuthUser } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await apiFetch<{ message: string; user: AuthUser }>("/profile", {
          method: "GET",
        });

        if (active) {
          setProfile(data.user);
          setUser(data.user);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load profile");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to log out");
    }
  };

  if (loading) {
    return <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Account details</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your Coinbase clone session and inspect the user profile returned by the backend.
        </p>

        {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Name</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.name ?? "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.email ?? "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account created</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Back home
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-[#0052ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0046db]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;