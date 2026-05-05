/*
 * Responsive Coinbase-style navbar with auth-aware actions.
 * Desktop shows centered navigation and mobile collapses into a drawer.
 */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/learn", label: "Learn" },
  ];

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-[#0052ff]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0052ff] text-sm font-bold text-white">
            C
          </span>
          <span className="hidden sm:inline">Coinbase</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-[#0052ff]" : "text-slate-700 hover:text-slate-900"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Button as={Link} to="/profile" variant="outline" size="sm">
                Profile
              </Button>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/signin" variant="outline" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/signup" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive ? "bg-[#0052ff] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {user ? (
                <>
                  <Button as={Link} to="/profile" variant="outline" size="sm" className="w-full" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Button>
                  <Button variant="primary" size="sm" className="w-full" onClick={handleLogout}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/signin" variant="outline" size="sm" className="w-full" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Button>
                  <Button as={Link} to="/signup" variant="primary" size="sm" className="w-full" onClick={() => setMenuOpen(false)}>
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
