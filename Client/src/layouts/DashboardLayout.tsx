
import { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import Navbar from "../components/shared/Navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("uinexa-theme");

    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("uinexa-theme", theme);
  }, [theme]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Navbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => current === "dark" ? "light" : "dark")
          }
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
