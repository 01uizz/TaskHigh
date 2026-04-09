import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  // =========================
  // 🔐 FORÇA DA SENHA
  // =========================
  const getPasswordStrength = () => {
    if (password.length === 0) return null;

    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "weak";
    if (score <= 3) return "medium";
    return "strong";
  };

  const strength = getPasswordStrength();

  const strengthLabel = {
    weak: "Fraca",
    medium: "Média",
    strong: "Forte",
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMsg("Conta criada! Verifique seu email.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setMsg("Email de recuperação enviado!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    if (mode === "login") return handleLogin(e);
    if (mode === "signup") return handleSignup(e);
    if (mode === "reset") return handleReset(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-xl"
            style={{ background: "var(--accent)" }}
          >
            T
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "login" && "Entrar"}
            {mode === "signup" && "Criar conta"}
            {mode === "reset" && "Recuperar senha"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">TaskHigh</p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

          {msg && <div className="text-green-400 text-sm mb-3">{msg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />

            {/* SENHA */}
            {mode !== "reset" && (
              <>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
                  >
                    {showPass ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {/* 🔥 INDICADOR BONITO */}
                {mode === "signup" && password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Força da senha</span>

                      <span
                        className={`font-medium ${
                          strength === "weak"
                            ? "text-red-400"
                            : strength === "medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {strengthLabel[strength]}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          strength === "weak"
                            ? "w-1/3 bg-red-400"
                            : strength === "medium"
                              ? "w-2/3 bg-yellow-400"
                              : "w-full bg-green-400"
                        }`}
                      />
                    </div>

                    <p className="text-[11px] text-gray-400">
                      Use letras maiúsculas, números e símbolos
                    </p>
                  </div>
                )}
              </>
            )}

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              {submitting
                ? "Carregando..."
                : mode === "login"
                  ? "Entrar"
                  : mode === "signup"
                    ? "Criar conta"
                    : "Enviar email"}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-4 text-xs text-center text-gray-400 space-y-2">
            {mode === "login" && (
              <>
                <p
                  onClick={() => setMode("reset")}
                  className="cursor-pointer hover:underline"
                >
                  Esqueci minha senha
                </p>
                <p
                  onClick={() => setMode("signup")}
                  className="cursor-pointer hover:underline"
                >
                  Criar conta
                </p>
              </>
            )}

            {mode !== "login" && (
              <p
                onClick={() => setMode("login")}
                className="cursor-pointer hover:underline"
              >
                Voltar para login
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
