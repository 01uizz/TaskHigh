import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { StatusBadge, PriorityBadge } from "../components/Badge";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const StatCard = ({ label, value, icon, colorClass, sub }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase">{label}</p>
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${colorClass}`}
      >
        {icon}
      </span>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const taskIcon = <span>📋</span>;
const checkIcon = <span>✅</span>;
const clockIcon = <span>⏳</span>;
const alertIcon = <span>⚠️</span>;

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    in_progress: 0,
    overdue: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("created_by", user.id);

      if (!tasks) return;

      const now = new Date();

      const overdue = tasks.filter(
        (t) => t.due_date && new Date(t.due_date) < now && t.status !== "done",
      ).length;

      setStats({
        total: tasks.length,
        done: tasks.filter((t) => t.status === "done").length,
        in_progress: tasks.filter((t) => t.status === "in_progress").length,
        overdue,
      });

      const sorted = [...tasks]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setRecent(sorted);
    } catch (e) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ PORCENTAGEM RESTAURADA
  const pct =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const handleComplete = async (task) => {
    try {
      await supabase.from("tasks").update({ status: "done" }).eq("id", task.id);

      toast.success("Tarefa concluída!");
      fetchData();
    } catch {
      toast.error("Erro ao concluir tarefa.");
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <Toaster position="top-right" />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()}, {user?.email?.split("@")[0]} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Aqui está um resumo das suas tarefas.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total"
                value={stats.total}
                icon={taskIcon}
                colorClass="bg-violet-500"
              />
              <StatCard
                label="Concluídas"
                value={stats.done}
                icon={checkIcon}
                colorClass="bg-green-500"
                sub={`${pct}%`}
              />
              <StatCard
                label="Em andamento"
                value={stats.in_progress}
                icon={clockIcon}
                colorClass="bg-blue-500"
              />
              <StatCard
                label="Atrasadas"
                value={stats.overdue}
                icon={alertIcon}
                colorClass="bg-red-500"
              />
            </div>

            {/* ✅ PROGRESSO */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 mb-8">
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Progresso geral
                  </p>
                  <p className="text-xs text-gray-400">
                    {stats.done} de {stats.total} tarefas concluídas
                  </p>
                </div>

                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {pct}%
                </span>
              </div>

              <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>

            {/* RECENTES */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Tarefas recentes
                </h2>

                <Link
                  to="/tasks"
                  className="text-xs hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Ver todas
                </Link>
              </div>

              {recent.length === 0 ? (
                <p className="p-5 text-gray-400 text-sm">
                  Nenhuma tarefa ainda.
                </p>
              ) : (
                <div className="divide-y dark:divide-gray-800">
                  {recent.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />

                        {task.status !== "done" && (
                          <button
                            onClick={() => handleComplete(task)}
                            className="text-xs text-green-500"
                          >
                            Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
