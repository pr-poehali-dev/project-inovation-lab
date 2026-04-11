import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <span className="text-xs uppercase tracking-widest text-zinc-500">ЦГБ Невский</span>
        </div>

        <p className="text-8xl font-black text-red-600 leading-none mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Страница не найдена</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-10">
          Такой страницы не существует. Возможно, ссылка устарела или была введена с ошибкой.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
          >
            <Icon name="Home" size={15} />
            На главную
          </button>
          <button
            onClick={() => navigate("/learn")}
            className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm px-6 py-3 transition-colors"
          >
            <Icon name="BookOpen" size={15} />
            Обучение
          </button>
        </div>
      </motion.div>
    </div>
  );
}
