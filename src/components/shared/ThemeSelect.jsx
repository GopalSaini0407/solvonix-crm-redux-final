import { THEMES, useTheme } from "../../context/theme.context";

export default function ThemeSelect() {
  const { theme, applyTheme } = useTheme();

  return (
    <div className="relative inline-block w-48">
      <select
        value={theme}
        onChange={(e) => applyTheme(e.target.value)}
        className="
          w-full
          appearance-none
          px-4
          py-2
          pr-8
          rounded-lg
          bg-[var(--color-surface)]
          text-[var(--color-text)]
          border
          border-[var(--color-border)]
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-primary)]
          focus:border-[var(--color-primary)]
          transition
          duration-150
          ease-in-out
          hover:bg-[var(--color-bg)]
        "
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-text)]">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
