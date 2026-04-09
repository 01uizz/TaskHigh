import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const icons = {
  home: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
      />
    </svg>
  ),
  tasks: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5h6M9 12l2 2 4-4"
      />
    </svg>
  ),
  history: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  profile: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  logout: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7"
      />
    </svg>
  ),
};

const menuItems = [
  { label: "Dashboard", path: "/", icon: icons.home },
  { label: "Tarefas", path: "/tasks", icon: icons.tasks },
  { label: "Histórico", path: "/history", icon: icons.history },
  { label: "Perfil", path: "/profile", icon: icons.profile },
];

const avatars = ["🧑‍💻", "🚀", "😎", "🔥", "📊"];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { accent } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const avatar = avatars[0]; // fixo por enquanto (depois posso deixar selecionável)

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-screen">
      {/* LOGO */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
            style={{ background: "var(--accent)" }}
          >
            T
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">TaskHigh</p>
            <p className="text-xs text-gray-400">Workspace</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map(({ label, path, icon }) => {
          const active =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  active
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              style={active ? { background: "var(--accent)" } : {}}
            >
              {icon}
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            {avatar}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition"
          >
            {icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}
