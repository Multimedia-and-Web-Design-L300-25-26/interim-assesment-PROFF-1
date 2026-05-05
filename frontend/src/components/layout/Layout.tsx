/*
 * Shared page shell for the public Coinbase clone pages.
 * Renders the responsive navbar, page content, and footer.
 */
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
