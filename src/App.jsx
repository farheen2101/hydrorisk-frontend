import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import MapView from "./pages/MapView";
import RiskUpdates from "./pages/RiskUpdates";
import ReportIssue from "./pages/ReportIssue";
import Resources from "./pages/Resources";
import SettingsPage from "./pages/SettingsPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<MapView />} />
            <Route path="/risk-updates" element={<RiskUpdates />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

function AppLayout() {
  const [search, setSearch] = useState("");

  return (
    <div className="app-shell">
      <TopBar search={search} onSearchChange={setSearch} />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}
