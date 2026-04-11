import { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Role = "super_admin" | "editor";
type Tab = "hero" | "staff" | "sections";

type Section = { id: string; title: string; items: string[] };
type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };
type HeroData = { subtitle: string; buttonText: string };

const defaultSections: Section[] = [
  { id: "intern", title: "Интерн", items: ["Ознакомление с правилами внутреннего распорядка", "Изучение структуры отделения", "Работа с медицинской документацией"] },
  { id: "feldsher", title: "Фельдшер", items: ["Протоколы первичной диагностики пациентов", "Алгоритмы оказания неотложной помощи", "Инфекционная безопасность и работа с биоматериалом"] },
];
const defaultHero: HeroData = { subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.", buttonText: "Перейти к обучению" };
const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
];
const BADGE_COLORS = ["bg-red-600", "bg-blue-600", "bg-green-600", "bg-yellow-600", "bg-purple-600", "bg-zinc-600"];

function SaveBtn({ onClick, saved, loading }: { onClick: () => void; saved: boolean; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || saved}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
      {saved ? <><Icon name="Check" size={14} /> Сохранено</> : loading ? "Сохраняю..." : <><Icon name="Save" size={14} /> Сохранить</>}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors ${className}`} />
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);

  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [editStaffIdx, setEditStaffIdx] = useState<number | null>(null);

  const token = () => localStorage.getItem("admin_token") || "";

  const authFetch = useCallback((url: string, opts?: RequestInit) =>
    fetch(url, { ...opts, headers: { ...(opts?.headers || {}), "X-Authorization": `Bearer ${token()}`, "Content-Type": "application/json" } }),
    []
  );

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  // ── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token()) { navigate("/admin/login"); return; }
    authFetch(`${API}?action=me`)
      .then(r => r.json())
      .then(d => {
        if (d.nickname) setMe({ nickname: d.nickname, role: d.role });
        else navigate("/admin/login");
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate, authFetch]);

  // ── Load site data from DB ─────────────────────────────────────────────────
  useEffect(() => {
    if (!me) return;
    authFetch(`${API}?action=site_data`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          if (d.data.hero) setHero(d.data.hero);
          if (d.data.sections) setSections(d.data.sections);
          if (d.data.staff) setStaff(d.data.staff);
        }
      });
  }, [me, authFetch]);

  const saveBlock = async (key: string, value: unknown) => {
    setSaving(true);
    await authFetch(`${API}?action=save_site_data`, {
      method: "POST",
      body: JSON.stringify({ key, value }),
    });
    setSaving(false);
    showSaved();
  };

  const logout = () => {
    playClickSound();
    localStorage.clear();
    navigate("/admin/login");
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "hero", label: "Главная", icon: "Home" },
    { id: "staff", label: "Состав", icon: "Users" },
    { id: "sections", label: "Обучение", icon: "BookOpen" },
  ];

  if (!me) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <span className="text-xs uppercase tracking-widest text-zinc-400 hidden sm:block">ЦГБ Невский</span>
          <span className="text-sm font-semibold">Панель управления</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Icon name="User" size={13} className="text-zinc-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">vk.ru/{me.nickname}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{me.role === "super_admin" ? "Главный администратор" : "Редактор"}</p>
            </div>
          </div>
          <button onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-400 hover:text-white text-xs transition-colors hidden sm:block">
            На сайт
          </button>
          <button onClick={logout}
            className="text-red-500 hover:text-red-400 text-xs transition-colors flex items-center gap-1">
            <Icon name="LogOut" size={14} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-14 md:w-52 border-r border-zinc-800 flex flex-col py-4 shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { playClickSound(); setTab(t.id); }}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${tab === t.id ? "bg-zinc-800 text-white border-r-2 border-red-600" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
              <Icon name={t.icon as "Home"} size={16} className="shrink-0" />
              <span className="hidden md:block">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">

          {/* ── HERO TAB ─────────────────────────────────────────────────── */}
          {tab === "hero" && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-bold mb-1">Главная страница</h2>
              <p className="text-zinc-500 text-sm mb-6">Текст и кнопка на экране-приветствии</p>
              <div className="flex flex-col gap-5">
                <Field label="Подзаголовок">
                  <textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
                </Field>
                <Field label="Текст кнопки">
                  <Input value={hero.buttonText} onChange={v => setHero({ ...hero, buttonText: v })} />
                </Field>
                <div className="pt-2">
                  <SaveBtn onClick={() => saveBlock("hero", hero)} saved={saved} loading={saving} />
                </div>
              </div>
            </div>
          )}

          {/* ── STAFF TAB ────────────────────────────────────────────────── */}
          {tab === "staff" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-1">Руководящий состав</h2>
                  <p className="text-zinc-500 text-sm">Список сотрудников на странице «Контакты»</p>
                </div>
                <button onClick={() => {
                  playClickSound();
                  setStaff(s => [...s, { role: "Должность", name: "Имя Фамилия", nickname: "nickname", href: "https://vk.ru/", badge: "Роль", badgeColor: "bg-red-600" }]);
                  setEditStaffIdx(staff.length);
                }} className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors">
                  <Icon name="Plus" size={13} /> Добавить
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {staff.map((person, idx) => (
                  <div key={idx} className="border border-zinc-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-sm shrink-0 ${person.badgeColor}`} />
                      <span className="font-semibold text-sm flex-1">{person.name}</span>
                      <button onClick={() => { playClickSound(); setEditStaffIdx(editStaffIdx === idx ? null : idx); }}
                        className="text-zinc-500 hover:text-white transition-colors">
                        <Icon name={editStaffIdx === idx ? "ChevronUp" : "Pencil"} size={14} />
                      </button>
                      <button onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }}
                        className="text-zinc-600 hover:text-red-500 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>

                    {editStaffIdx === idx && (
                      <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Имя">
                            <Input value={person.name} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, name: v } : p))} />
                          </Field>
                          <Field label="Должность">
                            <Input value={person.role} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, role: v } : p))} />
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Никнейм ВК">
                            <Input value={person.nickname} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, nickname: v } : p))} placeholder="nickname" />
                          </Field>
                          <Field label="Ссылка ВК">
                            <Input value={person.href} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, href: v } : p))} placeholder="https://vk.ru/..." />
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Бейдж">
                            <Input value={person.badge} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, badge: v } : p))} />
                          </Field>
                          <Field label="Цвет бейджа">
                            <div className="flex gap-2 flex-wrap pt-1">
                              {BADGE_COLORS.map(c => (
                                <button key={c} onClick={() => setStaff(s => s.map((p, i) => i === idx ? { ...p, badgeColor: c } : p))}
                                  className={`w-6 h-6 rounded-sm ${c} ${person.badgeColor === c ? "ring-2 ring-white" : ""}`} />
                              ))}
                            </div>
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} />
              </div>
            </div>
          )}

          {/* ── SECTIONS TAB ─────────────────────────────────────────────── */}
          {tab === "sections" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-1">Разделы обучения</h2>
                  <p className="text-zinc-500 text-sm">Этапы и пункты программы интернатуры</p>
                </div>
                <button onClick={() => {
                  playClickSound();
                  setSections(s => [...s, { id: `sec_${Date.now()}`, title: "Новый раздел", items: [] }]);
                }} className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors">
                  <Icon name="Plus" size={13} /> Раздел
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {sections.map((sec) => (
                  <div key={sec.id} className="border border-zinc-800 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Input value={sec.title}
                        onChange={v => setSections(s => s.map(x => x.id === sec.id ? { ...x, title: v } : x))}
                        className="font-semibold" />
                      <button onClick={() => { playClickSound(); setSections(s => s.filter(x => x.id !== sec.id)); }}
                        className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>

                    <ul className="flex flex-col gap-1.5 mb-4">
                      {sec.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 group">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                          <input type="text" value={item}
                            onChange={e => setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.map((it, i) => i === idx ? e.target.value : it) } : x))}
                            className="flex-1 bg-transparent text-sm text-zinc-300 outline-none border-b border-transparent focus:border-zinc-600 transition-colors py-0.5" />
                          <button onClick={() => { playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.filter((_, i) => i !== idx) } : x)); }}
                            className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5">
                            <Icon name="X" size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2">
                      <input type="text" placeholder="Новый пункт..." value={newItem[sec.id] || ""}
                        onChange={e => setNewItem(p => ({ ...p, [sec.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === "Enter" && newItem[sec.id]?.trim()) {
                            setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x));
                            setNewItem(p => ({ ...p, [sec.id]: "" }));
                          }
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                      <button onClick={() => {
                        if (!newItem[sec.id]?.trim()) return;
                        playClickSound();
                        setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x));
                        setNewItem(p => ({ ...p, [sec.id]: "" }));
                      }} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 transition-colors">
                        <Icon name="Plus" size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <SaveBtn onClick={() => saveBlock("sections", sections)} saved={saved} loading={saving} />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}