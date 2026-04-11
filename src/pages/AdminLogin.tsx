import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) { navigate("/admin"); return; }

    const code = searchParams.get("code");
    if (code) {
      setStatus("loading");
      const redirectUri = window.location.origin + "/admin/login";
      fetch(`${API}?action=callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("admin_token", data.token);
            localStorage.setItem("admin_vk_name", data.vk_name || "");
            localStorage.setItem("admin_vk_avatar", data.vk_avatar || "");
            localStorage.setItem("admin_role", data.role || "editor");
            navigate("/admin");
          } else if (data.error === "pending") {
            setStatus("pending");
          } else {
            setStatus("error");
            setError(data.message || data.error || "Ошибка авторизации");
          }
        })
        .catch(() => { setStatus("error"); setError("Ошибка соединения"); });
    }
  }, [navigate, searchParams]);

  const loginVK = async () => {
    playClickSound();
    setStatus("loading");
    const redirectUri = window.location.origin + "/admin/login";
    try {
      const r = await fetch(`${API}?action=vk_url&redirect_uri=${encodeURIComponent(redirectUri)}&state=admin`);
      const data = await r.json();
      if (data.url) window.location.href = data.url;
      else { setStatus("error"); setError("Не удалось получить ссылку VK"); }
    } catch {
      setStatus("error");
      setError("Ошибка соединения");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Авторизация...</p>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-xl font-bold text-white mb-4">Заявка отправлена</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Ваш аккаунт ВКонтакте получен. Главный администратор должен одобрить ваш доступ — вы получите уведомление.
          </p>
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ← На главную
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Кабинет администратора</h1>
          <p className="text-zinc-500 text-sm mt-2">Вход только через ВКонтакте</p>
        </div>

        {status === "error" && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm px-4 py-3 mb-6 text-center">
            {error}
          </div>
        )}

        <button
          onClick={loginVK}
          className="w-full flex items-center justify-center gap-3 bg-[#0077FF] hover:bg-[#0066DD] text-white py-4 text-sm font-semibold transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.731 14.2h1.137s.343-.038.518-.226c.161-.173.156-.498.156-.498s-.022-1.521.683-1.745c.694-.22 1.585 1.47 2.53 2.12.714.493 1.257.385 1.257.385l2.522-.035s1.32-.081.694-1.119c-.051-.085-.364-.765-1.874-2.164-1.578-1.462-1.367-1.226.534-3.756 1.158-1.543 1.62-2.484 1.476-2.887-.138-.386-0.98-.284-.98-.284l-2.838.018s-.21-.029-.366.065c-.153.092-.251.308-.251.308s-.448 1.192-1.046 2.206c-1.26 2.14-1.764 2.253-1.97 2.12-.48-.31-.36-1.245-.36-1.91 0-2.076.315-2.942-.614-3.168-.308-.075-.535-.124-1.322-.133C9.206 3.502 8.1 3.516 7.477 3.82c-.415.203-.735.656-.54.682.241.031.787.147 1.077.54.373.509.36 1.653.36 1.653s.213 2.443-.498 2.744c-.487.207-1.155-.215-2.59-2.145-.735-.998-1.29-2.103-1.29-2.103s-.085-.208-.236-.32c-.184-.133-.44-.175-.44-.175L.702 5.732s-.397.011-.543.184c-.13.155-.01.476-.01.476s2.208 5.17 4.703 7.778c2.29 2.395 4.889 2.237 4.889 2.237h1.99l-.001-.207z" fill="white"/>
          </svg>
          Войти через ВКонтакте
        </button>

        <p className="text-zinc-600 text-xs text-center mt-6 leading-relaxed">
          Доступ предоставляется только после одобрения главным администратором
        </p>
      </div>
    </div>
  );
}
