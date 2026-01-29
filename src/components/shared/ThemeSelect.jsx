import { THEMES, useTheme } from "../../context/theme.context";

export default function ThemeSelect() {
  const { theme, applyTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => applyTheme(e.target.value)}
      className="px-3 py-2 rounded bg-surface text-text border"
    >
      {THEMES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
