import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnRadioSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnRadioSection({ go }: LearnRadioSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к Интерну
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-3xl font-bold">Использование рации</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.2. Использование рации</p>

      <p className="text-base text-foreground leading-relaxed">
        В шкафу (на 1 этаже) лежит рация, настроенная на нужную волну. Возьмите её, а также возьмите медицинскую сумку. Рация предназначена для того, чтобы делать необходимые доклады.
      </p>

      {/* Команды */}
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Команды рации:</p>
        <div className="flex flex-col gap-2">
          {[
            { cmd: "/r",   desc: "Команда РП рации" },
            { cmd: "/rb",  desc: "Команда нонРП рации" },
            { cmd: "/ro",  desc: "Команда РП рации (между больницами)" },
            { cmd: "/rob", desc: "Команда нонРП рации (между больницами)" },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="flex items-center gap-3 text-sm text-foreground">
              <code className="bg-secondary border border-border rounded px-2 py-1 text-xs font-mono shrink-0">{cmd}</code>
              <span className="text-muted-foreground">— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Правила */}
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Правила использования</p>
        <ol className="flex flex-col gap-4">
          <li className="flex items-start gap-2 text-sm text-foreground">
            <span className="shrink-0 font-medium text-muted-foreground">1.</span>
            <span>
              <span className="font-semibold">Отыгровка:</span> Перед тем, как сказать что-то в рацию, нужно обязательно отыграть то, что Вы её достали, а после доклада — то, что убрали;
            </span>
          </li>

          <li className="flex flex-col gap-2 text-sm text-foreground">
            <div className="flex items-start gap-2">
              <span className="shrink-0 font-medium text-muted-foreground">2.</span>
              <span>
                Что говорить в{" "}
                <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono">/r</code>
                : Сейчас в РП рацию Вам можно использовать только для докладов: о заступлении на смену, сдаче смены;
              </span>
            </div>
            <div className="ml-5 border border-border rounded-sm px-4 py-3 bg-secondary/40 text-sm text-foreground">
              <span className="text-muted-foreground font-medium">Пример:</span> ОИ-КД. Заступил на смену.
            </div>
          </li>

          <li className="flex items-start gap-2 text-sm text-foreground">
            <span className="shrink-0 font-medium text-muted-foreground">3.</span>
            <span>
              Что говорить в{" "}
              <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono">/rb</code>
              : Вся остальная информация (вопросы, общение) — только в{" "}
              <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono">/rb</code>.
            </span>
          </li>

          <li className="flex items-start gap-2 text-sm text-foreground">
            <span className="shrink-0 font-medium text-muted-foreground">4.</span>
            <span>
              <span className="font-semibold">Для интернов:</span> Сейчас рация Вам доступна только для докладов о заступлении на смену и об её сдаче.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
