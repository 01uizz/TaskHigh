import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword"; // 🔥 NOVO: Importação da tela de reset
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// 🎨 O LAYOUT QUE MATA A DUPLICAÇÃO
function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0c] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 transition-all">
        <div className="max-w-7xl mx-auto uppercase-none">{children}</div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth();
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center dark:bg-gray-950 text-gray-400">
        Carregando...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && profile?.role !== "admin")
    return <Navigate to="/" replace />;

  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔥 NOVO: Rota para a tela de criar nova senha */}
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
