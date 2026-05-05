/*
 * App router for the Coinbase clone frontend.
 * Defines the public pages plus the protected profile route.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AssetDetail from "./pages/AssetDetail";
import Learn from "./pages/Learn";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="asset/:symbol" element={<AssetDetail />} />
        <Route path="learn" element={<Learn />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
