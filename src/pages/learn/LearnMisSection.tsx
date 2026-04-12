import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnMisSectionProps {
  go: (id: SectionId) => void;
}

const MIS_URL = "https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform";

const FIELDS = [
  { label: "Имя и Фамилия", desc: "Твоё игровое имя и фамилия точно так же, как в бейдже." },
  { label: "Ранг / должность", desc: "Интерн." },
  { label: "Ссылка на скриншот #1", desc: "Лечение пациента №1 — весь чат виден полностью." },
  { label: "Ссылка на скриншот #2", desc: "Лечение пациента №2." },
  { label: "Ссылка на скриншот #3", desc: "Лечение пациента №3." },
  { label: "Ссылка на скриншот #4", desc: "Лечение пациента №4." },
  { label: "Ссылка на скриншот #5", desc: "Лечение пациента №5." },
  { label: "Комментарий (необязательно)", desc: "Любые пояснения к доказательствам." },
];

const TIPS = [
  "Скриншот делается через F8 или Steam Overlay (Shift+F12) — чтобы был виден чат и HUD с датой/временем.",
  "Загружай скриншоты на imgur.com или на любой другой хостинг и вставляй прямую ссылку.",
  "Каждый скриншот — отдельное лечение отдельного пациента.",
  "На скриншоте должен быть виден твой бейдж (F6) и полный диалог от приветствия до прощания.",
];

export default function LearnMisSection({ go }: LearnMisSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-report")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к «Что дальше?»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">МИС «Здоровье»</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.2. МИС «Здоровье»</p>

      <p className="text-base text-foreground leading-relaxed">
        МИС «Здоровье» — это медицинская информационная система, куда ты загружаешь доказательства пролеченных пациентов перед подачей заявки на повышение. Без этого шага заявка не рассматривается.
      </p>

      {/* Кнопка перехода */}
      <a
        href={MIS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 border border-red-600/40 bg-red-600/5 hover:bg-red-600/10 rounded-sm px-4 py-3.5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Icon name="MonitorCheck" size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Открыть МИС «Здоровье»</p>
            <p className="text-xs text-muted-foreground mt-0.5">Google Forms — форма для загрузки доказательств</p>
          </div>
        </div>
        <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
      </a>

      {/* Что заполнять */}
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Что нужно заполнить в форме:</p>
        <div className="flex flex-col gap-2">
          {FIELDS.map((f, i) => (
            <div key={i} className="flex items-start gap-3 border border-border rounded-sm px-3 py-2.5 bg-secondary/20">
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0 pt-0.5">{i + 1}.</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Советы */}
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Советы по скриншотам:</p>
        <ul className="flex flex-col gap-2">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <Icon name="CircleCheck" size={14} className="text-green-500 shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Предупреждение */}
      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 rounded-sm px-4 py-3">
        <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-orange-300 leading-relaxed">
          <span className="font-bold">ВАЖНО:</span> Форму можно заполнить только один раз за отчётный период. Убедись, что все 5 скриншотов готовы, прежде чем отправлять.
        </p>
      </div>

      {/* Навигация */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => go("intern-report")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ChevronLeft" size={14} />
          Что дальше?
        </button>
        <button
          onClick={() => go("intern-evidence")}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Далее: Фиксация доказательств
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}
