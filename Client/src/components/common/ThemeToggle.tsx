import { Moon, Sun } from "lucide-react";
import { setTheme } from "../../store/uiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button } from "../ui/Button";

export function ThemeToggle() {
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}