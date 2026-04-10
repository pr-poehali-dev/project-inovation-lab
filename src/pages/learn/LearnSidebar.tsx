import Icon from "@/components/ui/icon";
import { SectionId, NAV } from "./learnConfig";

interface LearnSidebarProps {
  active: SectionId;
  go: (id: SectionId) => void;
}

export default function LearnSidebar({ active, go }: LearnSidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-border flex flex-col py-6 sticky top-0 h-screen overflow-y-auto">
      <p className="px-5 text-xs uppercase tracking-widest text-muted-foreground mb-3">Разделы</p>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const isChild = !!item.parent;
          return (
            <div key={item.id}>
              {item.divider && (
                <p className="px-3 pt-3 pb-1 text-xs text-zinc-500 uppercase tracking-widest select-none">
                  {item.divider}
                </p>
              )}
              <button
                onClick={() => go(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left rounded-none
                  ${isChild ? "ml-4 pl-3 text-xs" : ""}
                  ${isActive
                    ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                  }`}
              >
                <Icon name={item.icon as "Flag"} size={isChild ? 14 : 16} className={isActive ? "text-red-500" : ""} />
                {item.label}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
