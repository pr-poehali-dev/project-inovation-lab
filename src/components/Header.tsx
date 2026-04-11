import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleNav = (path: string) => {
    playClickSound();
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-4 md:py-6 ${className ?? ""}`}>
        <div className="flex justify-between items-center">
          <div className="text-white text-sm uppercase tracking-wide font-semibold leading-tight">
            <span className="block">ЦГБ Невский</span>
            <span className="block text-xs font-normal tracking-widest opacity-70 normal-case">Отделение Интернатуры</span>
          </div>
          <nav className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => handleNav("/contacts")}
              className="hidden sm:block text-white hover:text-red-400 transition-colors duration-300 uppercase text-xs md:text-sm"
            >
              Руководящий состав ОИ
            </button>
            <a
              href="#contact"
              onClick={playClickSound}
              className="hidden sm:block text-white hover:text-red-400 transition-colors duration-300 uppercase text-xs md:text-sm"
            >
              Правила
            </a>
            <button
              onClick={() => { playClickSound(); toggleTheme(); }}
              className="text-white hover:text-red-400 transition-colors duration-300 p-1"
              aria-label="Переключить тему"
            >
              <Icon name={dark ? "Sun" : "Moon"} size={18} />
            </button>
            <button
              onClick={() => { playClickSound(); setMenuOpen(v => !v); }}
              className="sm:hidden text-white hover:text-red-400 transition-colors duration-300 p-1"
              aria-label="Меню"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-10 bg-black/95 flex flex-col items-center justify-center gap-8 sm:hidden">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-4">Навигация</div>
          <button
            onClick={() => handleNav("/contacts")}
            className="text-white text-2xl uppercase tracking-widest font-semibold hover:text-red-400 transition-colors duration-300"
          >
            Руководящий состав ОИ
          </button>
          <a
            href="#contact"
            onClick={() => { playClickSound(); setMenuOpen(false); }}
            className="text-white text-2xl uppercase tracking-widest font-semibold hover:text-red-400 transition-colors duration-300"
          >
            Правила
          </a>
          <button
            onClick={() => handleNav("/learn")}
            className="text-white text-2xl uppercase tracking-widest font-semibold hover:text-red-400 transition-colors duration-300"
          >
            Обучение
          </button>
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => { playClickSound(); toggleTheme(); }}
              className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <Icon name={dark ? "Sun" : "Moon"} size={16} />
              {dark ? "Светлая тема" : "Тёмная тема"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
