import { useMemo } from "react";
import { Palette } from "lucide-react";
import { openThemePicker } from "@/components/ThemePicker";
import { useTheme } from "@/lib/theme";

/** Opens the theme picker; shows the current theme and the shortcut. */
export default function ThemeSwitcher() {
  const { info } = useTheme();
  const mac = useMemo(() => /Mac|iPhone|iPad/.test(navigator.platform), []);
  return (
    <button
      type="button"
      className="theme-button"
      onClick={openThemePicker}
      aria-label={`Change theme (current: ${info.name}). Shortcut ${mac ? "Command" : "Control"} K`}
      title={`Themes and shortcuts (${mac ? "⌘" : "Ctrl"} K)`}
    >
      <Palette size={16} aria-hidden="true" />
      <span className="theme-button-name">{info.name}</span>
      <kbd aria-hidden="true">{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}
