import { LANGUAGES } from '../constants/languages';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onChange: (language: string) => void;
};

export const LanguageSelector = ({
  selectedLanguage,
  onChange,
}: LanguageSelectorProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-800">
      Translate to
      <select
        className="h-12 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        value={selectedLanguage}
        onChange={(event) => onChange(event.target.value)}
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
};
