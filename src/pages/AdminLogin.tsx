import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "denied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  const login = async () => {
    playClickSound();
    const val = nickname.trim();
    if (!val) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const r = await fetch(`${API}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: val }),
      });
      const data = await r.json();

      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_nickname", data.nickname);
        localStorage.setItem("admin_role", data.role);
        navigate("/admin");
      } else if (data.error === "denied") {
        setStatus("denied");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Ошибка входа");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Ошибка соединения");
    }
  };

  if (status === "denied") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-6">🚫</div>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-xl font-bold text-white mb-3">Ой, а вы не администратор…</h1>
          <p className="text-zinc-500 text-sm mb-8">Этот никнейм ВКонтакте не имеет доступа к панели управления.</p>
          <button
            onClick={() => { playClickSound(); setStatus("idle"); setNickname(""); }}
            className="text-zinc-400 hover:text-white text-sm transition-colors mr-6"
          >
            Попробовать снова
          </button>
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-600 hover:text-white text-sm transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mb-8"
        >
          ← На главную
        </button>

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Кабинет администратора</h1>
          <p className="text-zinc-500 text-sm">Введите ваш никнейм ВКонтакте</p>
        </div>

        {status === "error" && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm px-4 py-3 mb-5 text-center">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm select-none">vk.ru/</span>
            <input
              type="text"
              placeholder="nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              autoComplete="off"
              autoCapitalize="none"
              className="w-full bg-zinc-900 border border-zinc-700 text-white pl-14 pr-4 py-3.5 text-sm outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <button
            onClick={login}
            disabled={status === "loading" || !nickname.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 text-sm uppercase tracking-widest font-semibold transition-colors"
          >
            {status === "loading" ? "Проверяю…" : "Войти"}
          </button>
        </div>

        <p className="text-zinc-700 text-xs text-center mt-6 leading-relaxed">
          Доступ только для сотрудников администрации ОИ
        </p>
      </div>
    </div>
  );
}
