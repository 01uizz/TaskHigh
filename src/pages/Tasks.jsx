import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { StatusBadge, PriorityBadge } from "../components/Badge";
import TaskModal from "../components/TaskModal";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // =========================
  // FETCH
  // =========================
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (e) {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // =========================
  // SAVE
  // =========================
  const handleSave = async (form) => {
    try {
      if (!user) return;

      if (editing) {
        const oldTask = editing;

        const { error } = await supabase
          .from("tasks")
          .update({
            ...form,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editing.id);

        if (error) throw error;

        await supabase.from("task_history").insert([
          {
            task_id: editing.id,
            user_id: user.id,
            action: "updated",
            old_value: JSON.stringify(oldTask),
            new_value: JSON.stringify(form),
          },
        ]);

        toast.success("Tarefa atualizada");
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert([
            {
              ...form,
              created_by: user.id,
              assigned_to: user.id,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        await supabase.from("task_history").insert([
          {
            task_id: data.id,
            user_id: user.id,
            action: "created",
            new_value: JSON.stringify(data),
          },
        ]);

        toast.success("Tarefa criada");
      }

      setModalOpen(false);
      setEditing(null);
      fetchTasks();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar");
    }
  };

  // =========================
  // CONCLUIR
  // =========================
  const handleComplete = async (task) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "done" })
        .eq("id", task.id);

      if (error) throw error;

      await supabase.from("task_history").insert([
        {
          task_id: task.id,
          user_id: user.id,
          action: "completed",
          new_value: JSON.stringify({ ...task, status: "done" }),
        },
      ]);

      toast.success("Concluída!");
      fetchTasks();
    } catch {
      toast.error("Erro ao concluir");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (task) => {
    try {
      setDeleting(task.id);

      await supabase.from("task_history").insert([
        {
          task_id: task.id,
          user_id: user.id,
          action: "deleted",
          old_value: JSON.stringify(task),
        },
      ]);

      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) throw error;

      toast.success("Tarefa excluída");
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <Toaster position="top-right" />

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Minhas tarefas
          </h1>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-white font-semibold shadow"
            style={{ background: "var(--accent)" }}
          >
            + Nova tarefa
          </button>
        </div>

        {/* LISTA */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />

                    {/* CONCLUIR */}
                    {task.status !== "done" && (
                      <button
                        onClick={() => handleComplete(task)}
                        className="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      >
                        ✔
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(task)}
                      disabled={deleting === task.id}
                      className="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      🗑
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditing(task);
                        setModalOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition text-xs text-blue-500"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
