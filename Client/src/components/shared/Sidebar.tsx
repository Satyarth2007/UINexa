
import {
  Activity,
  Blocks,
  ChartNoAxesCombined,
  FolderKanban,
  LayoutDashboard,
  ScanSearch,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "AI Generator", icon: Sparkles },
  { label: "UI Checker", icon: ScanSearch },
  { label: "Design System", icon: Blocks },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings },
];

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">UINexa</h1>
              <p className="text-xs text-muted-foreground">CYBER WORKSPACE</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-2 hover:bg-sidebar-accent lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <button
                  key={item.label}
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                    active
                      ? "bg-primary/15 font-semibold text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="rounded-xl border border-sidebar-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-primary" />
              <span className="text-sm font-semibold">AI Workspace</span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Create consistent interfaces with UINexa.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
