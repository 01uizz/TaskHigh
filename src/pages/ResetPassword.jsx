import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // O Supabase entende que o usuário está validado por causa do link clicado no e-mail
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Senha atualizada com sucesso!");

      // Aguarda 2 segundos para o usuário ler a mensagem e manda pro Login
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(
        "Erro ao atualizar senha. O link de recuperação pode ter expirado.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Toaster />
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Criar Nova Senha
        </h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Digite sua nova senha de acesso abaixo.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Nova senha"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
