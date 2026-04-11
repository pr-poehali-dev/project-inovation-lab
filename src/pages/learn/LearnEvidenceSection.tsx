import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnEvidenceSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnEvidenceSection({ go }: LearnEvidenceSectionProps) {
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
        <h1 className="text-3xl font-bold">Фиксация доказательств</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.2. Фиксация доказательств</p>

      <p className="text-base text-foreground leading-relaxed">
        Первым делом, чтобы подать отчет на повышение, давай научимся фиксировать твою работу.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-base text-foreground leading-relaxed">
          1. Мы всегда фиксируем свою работу, показывая чат, где видно как мы лечим пациента. Важно, чтобы была видна полная картина ситуации, а то есть:
        </p>
        <ul className="flex flex-col gap-2 ml-4 border-l-2 border-red-600/40 pl-4">
          {[
            "Приветствие с Вашим бейджем;",
            "Вопрос о том, чем Вы можете помочь пациенту;",
            "Проведение в палату для осмотра;",
            "Сделанный осмотр;",
            "Озвучивание диагноза и название препарата от этого диагноза;",
            "Называть стоимость в 500 рублей для всех препаратов;",
            "Спрашивание согласия на лечение у пациентов и только после этого передача препарата самому пациенту;",
            "Прощание «Всего доброго, не болейте!»",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-base text-foreground leading-relaxed">
          Для примера, возьмите этот скриншот №1:
        </p>
        <img
          src="https://1.downloader.disk.yandex.ru/preview/c849680e3587280c73ce0ef309c220afbadbb78026fe579aabdd4f4be51a1229/inf/di__oJU_tWGHC7fNKXbU7-e-7RAw1ehgr6VjW7YAUHilOEgx2XWCqkTVSnv2AMKQjRL6lzdcSPpYYx4h-Gt3LA%3D%3D?uid=1362692802&filename=mta-screen_2026-03-23_14-12-56.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1362692802&tknv=v3&size=1920x960"
          alt="Скриншот №1"
          className="w-full rounded-sm border border-border"
        />
        <p className="text-xs text-muted-foreground text-center">Скриншот №1: Лечение пациента в палате и захват всего чата.</p>
      </div>
    </div>
  );
}