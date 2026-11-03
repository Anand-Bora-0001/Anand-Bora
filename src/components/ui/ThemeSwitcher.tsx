import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/** One button that flips between light and dark. Until it's pressed, the site follows the OS. */
export default function ThemeSwitcher() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      data-theme-shown={theme}
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Sun size={17} aria-hidden="true" className="theme-toggle-sun" />
      <Moon size={17} aria-hidden="true" className="theme-toggle-moon" />
    </button>
  );
}
