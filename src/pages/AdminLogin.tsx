import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";

const API = "https://functions.poehali.dev/843f54ec-67eb-4b07-97dc-a5110ef168b0";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    playClickSound();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка");
      } else {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_username", data.username);
        navigate("/admin");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mb-8"
        >
          ← На главную
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-2 text-center">ЦГБ Невский</p>
        <h1 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
          {mode === "login" ? "Вход в кабинет" : "Регистрация"}
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm outline-none focus:border-red-600 transition-colors"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm outline-none focus:border-red-600 transition-colors"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 text-sm uppercase tracking-widest font-semibold transition-colors"
          >
            {loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>

          <button
            onClick={() => { playClickSound(); setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-zinc-500 hover:text-white text-sm transition-colors text-center"
          >
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}