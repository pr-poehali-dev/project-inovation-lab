import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, Inp, SectionHeader } from "./adminHelpers";
import { BADGE_COLORS, HeroData, StaffMember, IntroData, InternExam } from "./adminTypes";
import RichEditor from "@/components/ui/rich-editor";

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

  introData: IntroData;
  setIntroData: React.Dispatch<React.SetStateAction<IntroData>>;

  internExam: InternExam;
  setInternExam: React.Dispatch<React.SetStateAction<InternExam>>;
}

export default function AdminTabsSiteBasic({
  tab, saved, saving, saveBlock,
  hero, setHero,
  staff, setStaff,
  introData, setIntroData,
  internExam, setInternExam,
}: Props) {

  const upd = (idx: number, patch: Partial<StaffMember>) =>
    setStaff(s => s.map((p, i) => i === idx ? { ...p, ...patch } : p));

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {tab === "hero" && (
        <div className="max-w-2xl">
          <SectionHeader title="Главная страница" desc="Заголовок и кнопка на экране-приветствии" />
          <div className="flex flex-col gap-4">
            <Field label="Подзаголовок">
              <RichEditor value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Подзаголовок на главной..." minHeight={80} />
            </Field>
            <Field label="Текст кнопки">
              <Inp value={hero.buttonText} onChange={v => setHero({ ...hero, buttonText: v })} />
            </Field>
            <SaveBtn onClick={() => saveBlock("hero", hero)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── STAFF / CONTACTS ───────────────────────────────────────────── */}
      {tab === "staff" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <SectionHeader title="Руководящий состав" desc='Страница «Контакты» — список людей с должностями и ссылками ВК' />
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {staff.map((person, idx) => (
              <div key={idx} className="border border-zinc-700 bg-zinc-900/40 rounded-sm">
                {/* Шапка карточки */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${person.badgeColor}`} />
                  <span className="text-sm font-semibold flex-1 truncate text-white">{person.name || "Новый сотрудник"}</span>
                  <a
                    href={person.href || "https://vk.ru/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-zinc-500 hover:text-blue-400 transition-colors"
                    title="Открыть ВК"
                  >
                    <Icon name="ExternalLink" size={13} />
                  </a>
                  <button
                    onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>

                {/* Поля редактирования — всегда открыты */}
                <div className="px-4 py-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Имя и фамилия">
                      <Inp value={person.name} onChange={v => upd(idx, { name: v })} placeholder="Имя Фамилия" />
                    </Field>
                    <Field label="Должность">
                      <Inp value={person.role} onChange={v => upd(idx, { role: v })} placeholder="Куратор" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Никнейм ВК (без vk.ru/)">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs select-none">vk.ru/</span>
                        <input
                          type="text"
                          value={person.nickname}
                          onChange={e => upd(idx, { nickname: e.target.value, href: `https://vk.ru/${e.target.value}` })}
                          placeholder="nickname"
                          className="w-full bg-zinc-900 border border-zinc-700 text-white pl-12 pr-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </Field>
                    <Field label="Прямая ссылка ВК">
                      <Inp value={person.href} onChange={v => upd(idx, { href: v })} placeholder="https://vk.ru/..." />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Текст бейджа">
                      <Inp value={person.badge} onChange={v => upd(idx, { badge: v })} placeholder="Куратор" />
                    </Field>
                    <Field label="Цвет бейджа">
                      <div className="flex gap-2 flex-wrap pt-1">
                        {BADGE_COLORS.map(c => (
                          <button
                            key={c}
                            onClick={() => upd(idx, { badgeColor: c })}
                            className={`w-7 h-7 rounded-sm ${c} transition-all ${person.badgeColor === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                          />
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Добавить */}
          <button
            onClick={() => {
              playClickSound();
              setStaff(s => [...s, {
                role: "Должность",
                name: "Имя Фамилия",
                nickname: "nickname",
                href: "https://vk.ru/nickname",
                badge: "Роль",
                badgeColor: "bg-red-600",
              }]);
            }}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-red-600 text-zinc-500 hover:text-white py-3 text-sm transition-colors mb-4"
          >
            <Icon name="Plus" size={15} />
            Добавить сотрудника
          </button>

          <SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── INTRO ──────────────────────────────────────────────────────── */}
      {tab === "intro" && (
        <div className="max-w-3xl">
          <SectionHeader title="Вступление" desc="Текст страницы приветствия в разделе обучения" />
          <div className="flex flex-col gap-4">
            <Field label="Заголовок раздела">
              <Inp value={introData.welcome} onChange={v => setIntroData(d => ({ ...d, welcome: v }))} placeholder="Добро пожаловать в ЦГБ города Невский!" />
            </Field>
            <Field label="Содержимое раздела">
              <div className="mb-2 text-xs text-zinc-500 leading-relaxed">
                Используй панель инструментов для форматирования. Для выделения чисел красным цветом — выдели текст и используй цвет текста.
              </div>
              <RichEditor value={introData.content} onChange={v => setIntroData(d => ({ ...d, content: v }))} placeholder="Текст вступления..." minHeight={200} />
            </Field>
            <SaveBtn onClick={() => saveBlock("intro_data", introData)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── INTERN EXAM ────────────────────────────────────────────────── */}
      {tab === "intern_exam" && (
        <div className="max-w-3xl">
          <SectionHeader title="Раздел Интерн" desc="Задача и требования для получения допуска к лечению" />
          <div className="flex flex-col gap-4">
            <Field label="Заголовок задачи (красный текст на сайте)">
              <Inp value={internExam.title} onChange={v => setInternExam(d => ({ ...d, title: v }))} placeholder="Твоя первая и главная задача..." />
            </Field>
            <Field label="Содержимое раздела">
              <div className="mb-2 text-xs text-zinc-500 leading-relaxed">
                Пиши весь текст раздела: описание, нумерованные списки, условия. Для красного цвета — выдели текст и выбери цвет.
              </div>
              <RichEditor value={internExam.content} onChange={v => setInternExam(d => ({ ...d, content: v }))} placeholder="Описание и условия получения допуска..." minHeight={250} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ссылка на бинды">
                <Inp value={internExam.binds_link} onChange={v => setInternExam(d => ({ ...d, binds_link: v }))} placeholder="https://forum.gtaprovince.ru/..." />
              </Field>
              <Field label="Ссылка на Внутренний Устав">
                <Inp value={internExam.charter_link} onChange={v => setInternExam(d => ({ ...d, charter_link: v }))} placeholder="https://forum.gtaprovince.ru/..." />
              </Field>
            </div>
            <SaveBtn onClick={() => saveBlock("intern_exam", internExam)} saved={saved} loading={saving} />
          </div>
        </div>
      )}
    </>
  );
}