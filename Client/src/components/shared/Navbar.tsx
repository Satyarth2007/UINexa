
import { Menu, Search, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
};

function Navbar({
  theme,
  onToggleTheme,
  onOpenSidebar,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="rounded-lg border border-border p-2 hover:bg-accent/20 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 sm:flex">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="search"
          placeholder="Search workspace..."
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search workspace"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground md:inline">
          Ctrl K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="rounded-lg border border-border p-2 hover:bg-accent/20"
        >
          <Bell size={19} />
        </button>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-sm font-bold text-primary">
          U
        </div>
      </div>
    </header>
  );
}

export default Navbar;
