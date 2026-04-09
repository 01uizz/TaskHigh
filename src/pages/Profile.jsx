import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const avatars = ["👨‍💻", "🧑‍🚀", "🔥", "😎", "🤖", "👾", "⚡", "🚀", "🐱", "🦾"];

const accentOptions = [
  { key: "purple", label: "Roxo", color: "bg-violet-500" },
  { key: "blue", label: "Azul", color: "bg-blue-500" },
  { key: "green", label: "Verde", color: "bg-emerald-500" },
];

export default function Profile() {
  const { user, logout, avatar, changeAvatar } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 flex justify-center items-start p-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Perfil
            </h1>
            <p className="text-sm text-gray-400 mt-1">Personalize sua conta</p>
          </div>

          {/* CONTA */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xs text-gray-400 mb-4">Conta</h2>

            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ background: "var(--accent)" }}
              >
                {avatar}
              </div>

              <p className="text-sm text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>

          {/* AVATAR */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xs text-gray-400 mb-4">Escolher Avatar</h2>

            <div className="grid grid-cols-5 gap-3">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => changeAvatar(a)}
                  className={`text-2xl p-3 rounded-xl transition-all ${
                    avatar === a
                      ? "bg-gray-200 dark:bg-gray-700 scale-110"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* APARÊNCIA */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
            <h2 className="text-xs text-gray-400">Aparência</h2>

            <button
              onClick={toggleTheme}
              className="w-full py-2 rounded-xl text-white font-semibold"
              style={{ background: "var(--accent)" }}
            >
              Alternar tema
            </button>

            <div className="flex justify-center gap-3">
              {accentOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAccent(opt.key)}
                  className={`w-8 h-8 rounded-full ${opt.color} ${
                    accent === opt.key
                      ? "ring-2 ring-black dark:ring-white"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl text-white font-semibold bg-rose-500 hover:bg-rose-600 transition"
          >
            Sair
          </button>
        </div>
      </main>
    </div>
  );
}
