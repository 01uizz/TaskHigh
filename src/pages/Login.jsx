import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessMode, setAccessMode] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single();

      if (error) throw error;

      if (accessMode === "admin" && data.role !== "admin") {
        toast.error("Você não tem permissão de administrador");
        return;
      }

      toast.success("Login realizado!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao entrar. Verifique suas credenciais.");
    }
  };

  // 🔥 CORRIGIDO: Função de Esqueci a Senha agora aponta para a rota correta
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor, digite seu e-mail no campo acima primeiro.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Agora a URL bate exatamente com o path configurado no App.jsx
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success("Link de recuperação enviado! Verifique seu e-mail.");
    } catch (err) {
      toast.error("Erro ao enviar e-mail: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Toaster />

      <div className="w-full max-w-lg bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Entrar no sistema
        </h1>

        <p className="text-sm text-center text-gray-400 mb-6">
          Acesse sua conta corporativa
        </p>

        {/* MODO */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setAccessMode("user")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
              accessMode === "user"
                ? "text-white"
                : "text-gray-500 bg-gray-100 dark:bg-gray-800"
            }`}
            style={accessMode === "user" ? { background: "var(--accent)" } : {}}
          >
            Usuário
          </button>

          <button
            onClick={() => setAccessMode("admin")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
              accessMode === "admin"
                ? "text-white"
                : "text-gray-500 bg-gray-100 dark:bg-gray-800"
            }`}
            style={
              accessMode === "admin" ? { background: "var(--accent)" } : {}
            }
          >
            Administrador
          </button>
        </div>

        {accessMode === "admin" && (
          <p className="text-xs text-center text-gray-400 mb-4">
            Apenas contas autorizadas podem acessar como administrador.
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* 🔥 NOVO: Botão Esqueci a senha */}
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium text-sm"
            style={{ background: "var(--accent)" }}
          >
            Entrar
          </button>
        </form>

        {/* DIVISOR */}
        <div className="my-5 text-center text-xs text-gray-400">ou</div>

        {/* GOOGLE */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Entrar com Google
          </span>
        </button>

        {/* REGISTER */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Não tem conta?{" "}
          <Link
            to="/register"
            className="hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
