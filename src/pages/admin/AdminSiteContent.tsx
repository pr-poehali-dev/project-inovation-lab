import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, Inp, SectionHeader } from "./adminHelpers";
import {
  BADGE_COLORS, DEPT_COLORS,
  HeroData, Section, StaffMember, Command, Floor, Department, CharterDoc, Report,
  AbbrItem, RadioCommand, RadioRule,
} from "./adminTypes";

type Schedule = {
  weekdays: string; saturday: string; break: string; sunday: string; note: string;
};

interface Props {
  tab: string;
  saved: boolean;
  saving: boolean;
  saveBlock: (key: string, value: unknown) => Promise<void>;

  hero: HeroData;
  setHero: React.Dispatch<React.SetStateAction<HeroData>>;

  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  editStaffIdx: number | null;
  setEditStaffIdx: React.Dispatch<React.SetStateAction<number | null>>;

  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  newItem: Record<string, string>;
  setNewItem: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;

  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;

  floors: Floor[];
  setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;

  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;

  charter: CharterDoc[];
  setCharter: React.Dispatch<React.SetStateAction<CharterDoc[]>>;

  oathLines: string[];
  setOathLines: React.Dispatch<React.SetStateAction<string[]>>;

  maleReports: Report[];
  setMaleReports: React.Dispatch<React.SetStateAction<Report[]>>;
  femaleReports: Report[];
  setFemaleReports: React.Dispatch<React.SetStateAction<Report[]>>;

  abbr: AbbrItem[];
  setAbbr: React.Dispatch<React.SetStateAction<AbbrItem[]>>;
  radioCommands: RadioCommand[];
  setRadioCommands: React.Dispatch<React.SetStateAction<RadioCommand[]>>;
  radioRules: RadioRule[];
  setRadioRules: React.Dispatch<React.SetStateAction<RadioRule[]>>;
  activityData: { ja_link: string; app_link: string; forum_link: string; afk_rules: string[] };
  setActivityData: React.Dispatch<React.SetStateAction<{ ja_link: string; app_link: string; forum_link: string; afk_rules: string[] }>>;
  introData: { welcome: string; line1: string; days_total: string; days_feldsher: string };
  setIntroData: React.Dispatch<React.SetStateAction<{ welcome: string; line1: string; days_total: string; days_feldsher: string }>>;
  internExam: { title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] };
  setInternExam: React.Dispatch<React.SetStateAction<{ title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] }>>;
}

export default function AdminSiteContent({
  tab, saved, saving, saveBlock,
  hero, setHero,
  staff, setStaff, editStaffIdx, setEditStaffIdx,
  sections, setSections, newItem, setNewItem,
  commands, setCommands,
  schedule, setSchedule,
  floors, setFloors,
  departments, setDepartments,
  charter, setCharter,
  oathLines, setOathLines,
  maleReports, setMaleReports,
  femaleReports, setFemaleReports,
  abbr, setAbbr,
  radioCommands, setRadioCommands,
  radioRules, setRadioRules,
  activityData, setActivityData,
  introData, setIntroData,
  internExam, setInternExam,
}: Props) {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {tab === "hero" && (
        <div className="max-w-2xl">
          <SectionHeader title="Главная страница" desc="Заголовок и кнопка на экране-приветствии" />
          <div className="flex flex-col gap-4">
            <Field label="Подзаголовок">
              <textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <Field label="Текст кнопки">
              <Inp value={hero.buttonText} onChange={v => setHero({ ...hero, buttonText: v })} />
            </Field>
            <SaveBtn onClick={() => saveBlock("hero", hero)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── STAFF ──────────────────────────────────────────────────────── */}
      {tab === "staff" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Руководящий состав" desc='Отображается на странице "Контакты"' />
            <button onClick={() => { playClickSound(); setStaff(s => [...s, { role: "Должность", name: "Имя Фамилия", nickname: "nickname", href: "https://vk.ru/", badge: "Роль", badgeColor: "bg-red-600" }]); setEditStaffIdx(staff.length); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {staff.map((person, idx) => (
              <div key={idx} className="border border-zinc-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-sm shrink-0 ${person.badgeColor}`} />
                  <span className="font-semibold text-sm flex-1">{person.name}</span>
                  <button onClick={() => { playClickSound(); setEditStaffIdx(editStaffIdx === idx ? null : idx); }} className="text-zinc-500 hover:text-white transition-colors">
                    <Icon name={editStaffIdx === idx ? "ChevronUp" : "Pencil"} size={14} />
                  </button>
                  <button onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
                {editStaffIdx === idx && (
                  <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Имя"><Inp value={person.name} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, name: v } : p))} /></Field>
                      <Field label="Должность"><Inp value={person.role} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, role: v } : p))} /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Никнейм ВК"><Inp value={person.nickname} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, nickname: v } : p))} placeholder="nickname" /></Field>
                      <Field label="Ссылка ВК"><Inp value={person.href} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, href: v } : p))} placeholder="https://vk.ru/..." /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Текст бейджа"><Inp value={person.badge} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, badge: v } : p))} /></Field>
                      <Field label="Цвет бейджа">
                        <div className="flex gap-2 flex-wrap pt-1">
                          {BADGE_COLORS.map(c => <button key={c} onClick={() => setStaff(s => s.map((p, i) => i === idx ? { ...p, badgeColor: c } : p))} className={`w-6 h-6 rounded-sm ${c} ${person.badgeColor === c ? "ring-2 ring-white" : ""}`} />)}
                        </div>
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── SECTIONS ───────────────────────────────────────────────────── */}
      {tab === "sections" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Разделы обучения" desc="Этапы и пункты программы интернатуры" />
            <button onClick={() => { playClickSound(); setSections(s => [...s, { id: `sec_${Date.now()}`, title: "Новый раздел", items: [] }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Раздел
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {sections.map((sec) => (
              <div key={sec.id} className="border border-zinc-800 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Inp value={sec.title} onChange={v => setSections(s => s.map(x => x.id === sec.id ? { ...x, title: v } : x))} className="font-semibold" />
                  <button onClick={() => { playClickSound(); setSections(s => s.filter(x => x.id !== sec.id)); }} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 group">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <input type="text" value={item} onChange={e => setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.map((it, i) => i === idx ? e.target.value : it) } : x))}
                        className="flex-1 bg-transparent text-sm text-zinc-300 outline-none border-b border-transparent focus:border-zinc-600 transition-colors py-0.5" />
                      <button onClick={() => { playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.filter((_, i) => i !== idx) } : x)); }}
                        className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"><Icon name="X" size={13} /></button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input type="text" placeholder="Новый пункт..." value={newItem[sec.id] || ""}
                    onChange={e => setNewItem(p => ({ ...p, [sec.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter" && newItem[sec.id]?.trim()) { setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); } }}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { if (!newItem[sec.id]?.trim()) return; playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 transition-colors"><Icon name="Plus" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("sections", sections)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── COMMANDS ───────────────────────────────────────────────────── */}
      {tab === "commands" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Основные команды" desc="Список команд для сотрудников" />
            <button onClick={() => { playClickSound(); setCommands(c => [...c, { cmd: "/команда", desc: "Описание" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={cmd.cmd} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, cmd: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors w-40 shrink-0" />
                <input value={cmd.desc} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setCommands(c => c.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("commands", commands)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── SCHEDULE ───────────────────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="max-w-2xl">
          <SectionHeader title="График работы" desc="Расписание рабочих дней и перерывов" />
          <div className="flex flex-col gap-4">
            <Field label="Пн–Пт"><Inp value={schedule.weekdays} onChange={v => setSchedule(s => ({ ...s, weekdays: v }))} /></Field>
            <Field label="Суббота"><Inp value={schedule.saturday} onChange={v => setSchedule(s => ({ ...s, saturday: v }))} /></Field>
            <Field label="Перерыв (ежедневно)"><Inp value={schedule.break} onChange={v => setSchedule(s => ({ ...s, break: v }))} /></Field>
            <Field label="Воскресенье"><Inp value={schedule.sunday} onChange={v => setSchedule(s => ({ ...s, sunday: v }))} /></Field>
            <Field label="Примечание">
              <textarea rows={2} value={schedule.note} onChange={e => setSchedule(s => ({ ...s, note: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <SaveBtn onClick={() => saveBlock("schedule", schedule)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── FLOORS ─────────────────────────────────────────────────────── */}
      {tab === "floors" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Распределение этажей" desc="Описание каждого этажа больницы" />
            <button onClick={() => { playClickSound(); setFloors(f => [...f, { num: `${f.length + 1} этаж`, desc: "Описание" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {floors.map((floor, idx) => (
              <div key={idx} className="flex items-start gap-2 group">
                <input value={floor.num} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, num: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors w-28 shrink-0 font-semibold" />
                <input value={floor.desc} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setFloors(f => f.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2.5"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("floors", floors)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── DEPARTMENTS ────────────────────────────────────────────────── */}
      {tab === "departments" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Отделения ЦГБ-Н" desc="Структура и аббревиатуры подразделений" />
            <button onClick={() => { playClickSound(); setDepartments(d => [...d, { abbr: "ОТД", full: "Новое отделение", color: "text-zinc-400" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {departments.map((dept, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={dept.abbr} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm font-bold outline-none focus:border-red-600 transition-colors w-20 shrink-0" />
                <input value={dept.full} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                <select value={dept.color} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2.5 text-xs outline-none focus:border-red-600 transition-colors w-28 shrink-0">
                  {DEPT_COLORS.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                </select>
                <button onClick={() => { playClickSound(); setDepartments(d => d.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("departments", departments)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── CHARTER ────────────────────────────────────────────────────── */}
      {tab === "charter" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Уставная документация" desc="Ссылки на официальные документы и уставы" />
            <button onClick={() => { playClickSound(); setCharter(c => [...c, { abbr: "АБВ", title: "Название документа", href: "https://forum.gtaprovince.ru/" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {charter.map((doc, idx) => (
              <div key={idx} className="border border-zinc-800 p-4 group">
                <div className="flex items-start gap-2 mb-2">
                  <input value={doc.abbr} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                  <input value={doc.title} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setCharter(c => c.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
                <input value={doc.href} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, href: e.target.value } : x))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-400 px-3 py-2 text-xs outline-none focus:border-red-600 transition-colors" placeholder="https://..." />
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("charter", charter)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── OATH ───────────────────────────────────────────────────────── */}
      {tab === "oath" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Клятва врача" desc="Строки клятвы (say-команды для консоли)" />
            <button onClick={() => { playClickSound(); setOathLines(l => [...l, "say Новая строка клятвы."]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {oathLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={line} onChange={e => setOathLines(l => l.map((x, i) => i === idx ? e.target.value : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setOathLines(l => l.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <SaveBtn onClick={() => saveBlock("oath_lines", oathLines)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── REPORTS ────────────────────────────────────────────────────── */}
      {tab === "reports" && (
        <div className="max-w-2xl">
          <SectionHeader title="Доклады в рацию" desc="Шаблоны докладов для мужчин и женщин" />
          {([
            { label: "♂ Мужские доклады", items: maleReports, setItems: setMaleReports, key: "reports_male" },
            { label: "♀ Женские доклады", items: femaleReports, setItems: setFemaleReports, key: "reports_female" },
          ] as const).map(({ label, items, setItems, key }) => (
            <div key={key} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-zinc-300">{label}</p>
                <button onClick={() => { playClickSound(); setItems(l => [...l, { label: "Новый доклад", template: "/r ОИ-Инициалы. Текст." }]); }}
                  className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                  <Icon name="Plus" size={12} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-2 border border-zinc-800 p-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <input value={item.label} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs outline-none focus:border-red-600 transition-colors w-36 shrink-0" />
                    <input value={item.template} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, template: e.target.value } : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { playClickSound(); setItems(l => l.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={13} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-3"><SaveBtn onClick={() => saveBlock(key, items)} saved={saved} loading={saving} /></div>
            </div>
          ))}
        </div>
      )}
      {/* ── ABBR ───────────────────────────────────────────────────────── */}
      {tab === "abbr" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Аббревиатуры" desc="Список сокращений и расшифровок" />
            <button onClick={() => { playClickSound(); setAbbr(a => [...a, { abbr: "АБВ", full: "Расшифровка" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {abbr.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={item.abbr} onChange={e => setAbbr(a => a.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                <input value={item.full} onChange={e => setAbbr(a => a.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setAbbr(a => a.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("abbr", abbr)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── RADIO ──────────────────────────────────────────────────────── */}
      {tab === "radio" && (
        <div className="max-w-2xl">
          <SectionHeader title="Использование рации" desc="Команды рации и правила использования" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Команды рации</p>
              <button onClick={() => { playClickSound(); setRadioCommands(c => [...c, { cmd: "/r", desc: "Описание" }]); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {radioCommands.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={item.cmd} onChange={e => setRadioCommands(c => c.map((x, i) => i === idx ? { ...x, cmd: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                  <input value={item.desc} onChange={e => setRadioCommands(c => c.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setRadioCommands(c => c.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={13} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("radio_commands", radioCommands)} saved={saved} loading={saving} /></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Правила использования</p>
              <button onClick={() => { playClickSound(); setRadioRules(r => [...r, { text: "Новое правило" }]); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {radioRules.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 group">
                  <span className="text-zinc-500 text-xs shrink-0 pt-2.5">{idx + 1}.</span>
                  <textarea value={item.text} onChange={e => setRadioRules(r => r.map((x, i) => i === idx ? { ...x, text: e.target.value } : x))}
                    rows={2}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
                  <button onClick={() => { playClickSound(); setRadioRules(r => r.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2"><Icon name="X" size={13} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("radio_rules", radioRules)} saved={saved} loading={saving} /></div>
          </div>
        </div>
      )}

      {/* ── ACTIVITY ───────────────────────────────────────────────────── */}
      {tab === "activity" && (
        <div className="max-w-2xl">
          <SectionHeader title="Журнал активности (ЖА)" desc="Правила АФК и ссылки на ресурсы" />
          <div className="flex flex-col gap-4 mb-6">
            <Field label="Ссылка на сайт ЖА">
              <Inp value={activityData.ja_link} onChange={v => setActivityData(d => ({ ...d, ja_link: v }))} />
            </Field>
            <Field label="Ссылка на приложение ЖА">
              <Inp value={activityData.app_link} onChange={v => setActivityData(d => ({ ...d, app_link: v }))} />
            </Field>
            <Field label="Ссылка на госпортал">
              <Inp value={activityData.forum_link} onChange={v => setActivityData(d => ({ ...d, forum_link: v }))} />
            </Field>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Правила АФК</p>
              <button onClick={() => { playClickSound(); setActivityData(d => ({ ...d, afk_rules: [...d.afk_rules, "Новое правило"] })); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {activityData.afk_rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={rule} onChange={e => setActivityData(d => ({ ...d, afk_rules: d.afk_rules.map((r, i) => i === idx ? e.target.value : r) }))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setActivityData(d => ({ ...d, afk_rules: d.afk_rules.filter((_, i) => i !== idx) })); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <SaveBtn onClick={() => saveBlock("activity", activityData)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── INTRO ──────────────────────────────────────────────────────── */}
      {tab === "intro" && (
        <div className="max-w-2xl">
          <SectionHeader title="Вступление" desc="Текст приветствия при входе в раздел обучения" />
          <div className="flex flex-col gap-4">
            <Field label="Заголовок-приветствие">
              <Inp value={introData.welcome} onChange={v => setIntroData(d => ({ ...d, welcome: v }))} />
            </Field>
            <Field label="Первое предложение">
              <textarea rows={2} value={introData.line1} onChange={e => setIntroData(d => ({ ...d, line1: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Дней всего в ОИ">
                <Inp value={introData.days_total} onChange={v => setIntroData(d => ({ ...d, days_total: v }))} />
              </Field>
              <Field label="Дней до Фельдшера">
                <Inp value={introData.days_feldsher} onChange={v => setIntroData(d => ({ ...d, days_feldsher: v }))} />
              </Field>
            </div>
            <SaveBtn onClick={() => saveBlock("intro_data", introData)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── INTERN EXAM ────────────────────────────────────────────────── */}
      {tab === "intern_exam" && (
        <div className="max-w-2xl">
          <SectionHeader title="Раздел Интерн" desc="Задача и требования для получения допуска к лечению" />
          <div className="flex flex-col gap-4 mb-6">
            <Field label="Главная задача (красный заголовок)">
              <Inp value={internExam.title} onChange={v => setInternExam(d => ({ ...d, title: v }))} />
            </Field>
            <Field label="Описание">
              <textarea rows={3} value={internExam.desc} onChange={e => setInternExam(d => ({ ...d, desc: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <Field label="Ссылка на бинды">
              <Inp value={internExam.binds_link} onChange={v => setInternExam(d => ({ ...d, binds_link: v }))} />
            </Field>
            <Field label="Ссылка на Внутренний Устав">
              <Inp value={internExam.charter_link} onChange={v => setInternExam(d => ({ ...d, charter_link: v }))} />
            </Field>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Пункты ПМЭ</p>
              <button onClick={() => { playClickSound(); setInternExam(d => ({ ...d, exam_items: [...d.exam_items, "Новый пункт"] })); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {internExam.exam_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={item} onChange={e => setInternExam(d => ({ ...d, exam_items: d.exam_items.map((x, i) => i === idx ? e.target.value : x) }))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setInternExam(d => ({ ...d, exam_items: d.exam_items.filter((_, i) => i !== idx) })); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("intern_exam", internExam)} saved={saved} loading={saving} /></div>
          </div>
        </div>
      )}
    </>
  );
}