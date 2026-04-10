import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnScheduleSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnScheduleSection({ go }: LearnScheduleSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-commands")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к командам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Устав и правила</p>
        <h1 className="text-3xl font-bold">График работы</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.1. График работы</p>

      <div className="flex flex-col gap-3">
        <p className="text-base text-foreground leading-relaxed">
          С понедельника по пятницу:{" "}
          <span className="text-red-500 font-medium">с 10:00 до 19:00</span>.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          В субботу:{" "}
          <span className="text-red-500 font-medium">с 11:00 до 18:00</span>.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Перерыв ежедневно:{" "}
          <span className="text-red-500 font-medium">с 14:00 до 15:00</span>.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Воскресенье: выходной для сотрудников без наказаний.
        </p>
      </div>

      {/* Важно */}
      <div className="flex items-start gap-3 bg-orange-950/30 border border-orange-700/50 rounded-sm px-5 py-4">
        <Icon name="AlertTriangle" size={18} className="text-orange-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-orange-400 uppercase tracking-wide">ВАЖНО:</p>
          <p className="text-sm text-foreground leading-relaxed">
            Время указано московское!
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Сотрудники с наказаниями работают в{" "}
            <span className="font-bold underline">воскресенье по субботнему графику</span>.{" "}
            Отсутствие таковых на рабочем месте расценивается как прогул смены.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Отсутствие сотрудника на рабочем месте без уважительной причины (перерыва, отпуска или отгула) в рабочее время автоматически расценивается как прогул смены.
          </p>
        </div>
      </div>
    </div>
  );
}
