import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/843f54ec-67eb-4b07-97dc-a5110ef168b0";

const SECTIONS_KEY = "admin_sections";
const HERO_KEY = "admin_hero";

type Section = { id: string; title: string; items: string[] };

const defaultSections: Section[] = [
  {
    id: "intern",
    title: "Интерн",
    items: [
      "Ознакомление с правилами внутреннего распорядка",
      "Изучение структуры отделения и должностных инструкций",
      "Знакомство с протоколами оказания медицинской помощи",
      "Работа с медицинской документацией",
      "Участие в утренних обходах и разборах клинических случаев",
      "Освоение навыков работы в МИС",
    ],
  },
  {
    id: "feldsher",
    title: "Фельдшер",
    items: [
      "Протоколы первичной диагностики пациентов",
      "Алгоритмы оказания неотложной помощи",
      "Ведение сестринской документации и карт наблюдения",
      "Правила хранения и выдачи лекарственных средств",
      "Взаимодействие с дежурным врачом и старшим медперсоналом",
      "Инфекционная безопасность и работа с биоматериалом",
    ],
  },
];

const defaultHero = {
  subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.",
  buttonText: "Перейти к обучению",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<"hero" | "sections">("hero");

  const [hero, setHero] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HERO_KEY) || "null") || defaultHero; }
    catch { return defaultHero; }
  });
  const [sections, setSections] = useState<Section[]>(() => {
    try { return JSON.parse(localStorage.getItem(SECTIONS_KEY) || "null") || defaultSections; }
    catch { return defaultSections; }
  });

  const [saved, setSaved] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { navigate("/admin/login"); return; }
    fetch(`${API}?action=me`, { headers: { "X-Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.username) setUsername(d.username); else navigate("/admin/login"); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  const logout = () => {
    playClickSound();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  };

  const saveHero = () => {
    playClickSound();
    localStorage.setItem(HERO_KEY, JSON.stringify(hero));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveSections = () => {
    playClickSound();
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSectionTitle = (id: string, title: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, title } : sec));
  };

  const removeItem = (secId: string, idx: number) => {
    setSections(s => s.map(sec => sec.id === secId
      ? { ...sec, items: sec.items.filter((_, i) => i !== idx) }
      : sec));
  };

  const addItem = (secId: string) => {
    if (!newItemText.trim()) return;
    setSections(s => s.map(sec => sec.id === secId
      ? { ...sec, items: [...sec.items, newItemText.trim()] }
      : sec));
    setNewItemText("");
  };

  const addSection = () => {
    const id = `section_${Date.now()}`;
    setSections(s => [...s, { id, title: "Новый раздел", items: [] }]);
  };

  const removeSection = (id: string) => {
    setSections(s => s.filter(sec => sec.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-600">ЦГБ Невский</p>
          <h1 className="text-lg font-bold">Админ-кабинет</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">{username}</span>
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            На сайт
          </button>
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
          >
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-zinc-800">
          {(["hero", "sections"] as const).map(t => (
            <button
              key={t}
              onClick={() => { playClickSound(); setTab(t); }}
              className={`px-5 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2 ${
                tab === t
                  ? "border-red-600 text-white"
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              {t === "hero" ? "Главная страница" : "Разделы обучения"}
            </button>
          ))}
        </div>

        {/* Hero tab */}
        {tab === "hero" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 mb-2 block">Подзаголовок</label>
              <textarea
                rows={3}
                value={hero.subtitle}
                onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm outline-none focus:border-red-600 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 mb-2 block">Текст кнопки</label>
              <input
                type="text"
                value={hero.buttonText}
                onChange={e => setHero({ ...hero, buttonText: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <button
              onClick={saveHero}
              className="self-start bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm uppercase tracking-widest font-semibold transition-colors"
            >
              {saved ? "Сохранено ✓" : "Сохранить"}
            </button>
            <p className="text-zinc-500 text-xs">Изменения применяются сразу на сайте после сохранения.</p>
          </div>
        )}

        {/* Sections tab */}
        {tab === "sections" && (
          <div className="flex flex-col gap-6">
            {sections.map(sec => (
              <div key={sec.id} className="border border-zinc-800 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={e => updateSectionTitle(sec.id, e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors font-semibold"
                  />
                  <button
                    onClick={() => { playClickSound(); removeSection(sec.id); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                <ul className="flex flex-col gap-2 mb-3">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => { playClickSound(); removeItem(sec.id, idx); }}
                        className="text-zinc-600 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Новый пункт..."
                    value={editSection?.id === sec.id ? newItemText : ""}
                    onFocus={() => setEditSection(sec)}
                    onChange={e => setNewItemText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addItem(sec.id)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  />
                  <button
                    onClick={() => { playClickSound(); addItem(sec.id); }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 transition-colors"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={() => { playClickSound(); addSection(); }}
                className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-400 hover:text-white px-4 py-2.5 text-sm transition-colors"
              >
                <Icon name="Plus" size={16} /> Добавить раздел
              </button>
              <button
                onClick={saveSections}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                {saved ? "Сохранено ✓" : "Сохранить"}
              </button>
            </div>
            <p className="text-zinc-500 text-xs">Изменения применяются сразу на сайте после сохранения.</p>
          </div>
        )}
      </div>
    </div>
  );
}
