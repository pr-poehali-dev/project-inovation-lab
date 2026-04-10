import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";

const staff = [
  {
    role: "Куратор Отделения Интернатуры",
    name: "Ksenia Donskaya",
    nickname: "Ksenia_Donskaya",
    href: "https://vk.ru/soul__shu",
    badge: "Куратор",
    badgeColor: "bg-red-600",
  },
  {
    role: "Заместитель Заведующего ОИ",
    name: "Egor Maslow",
    nickname: "Egor_Maslow",
    href: "https://vk.ru/cccuvigon",
    badge: "Зам. Зав.",
    badgeColor: "bg-zinc-700",
  },
  {
    role: "Заместитель Заведующего ОИ",
    name: "Andrei Schmidt",
    nickname: "Andrei_Schmidt",
    href: "https://vk.com/id392167605",
    badge: "Зам. Зав.",
    badgeColor: "bg-zinc-700",
  },
];

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-2xl mx-auto px-6 py-16 w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">Руководящий состав ОИ</h1>

        <div className="flex flex-col gap-4">
          {staff.map((person) => (
            <div
              key={person.nickname}
              className="border border-border overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Цветная вертикальная полоса */}
                <div className={`w-1 shrink-0 ${person.badgeColor}`} />

                <div className="flex-1 px-6 py-5 flex flex-col gap-2">
                  {/* Должность */}
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {person.role}
                  </p>

                  {/* Имя */}
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {person.name}
                  </p>

                  {/* Кнопка перехода */}
                  <div className="mt-2">
                    <a
                      href={person.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className={`inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white px-4 py-2 ${person.badgeColor} hover:opacity-80 transition-opacity duration-200 font-semibold`}
                    >
                      <Icon name="ExternalLink" size={13} />
                      Перейти на страницу
                    </a>
                  </div>
                </div>

                {/* Бейдж справа */}
                <div className="flex items-center pr-6">
                  <span className={`text-xs uppercase tracking-wider text-white px-2.5 py-1 ${person.badgeColor} font-semibold`}>
                    {person.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}