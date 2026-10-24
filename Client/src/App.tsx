import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import { useAppSelector } from "./store/hooks";

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <RouterProvider router={router} />;
}