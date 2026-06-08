import { useState } from 'react';
import { CameraScanner } from './components/CameraScanner';
import { LanguageSelector } from './components/LanguageSelector';
import { DEFAULT_LANGUAGE } from './constants/languages';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6">
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <header className="grid gap-2">
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            AR OCR Translator
          </h1>
          <p className="text-base leading-7 text-slate-600">
            Scan text with your camera and translate it instantly.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </section>

        <CameraScanner selectedLanguage={selectedLanguage} />
      </div>
    </main>
  );
};

export default App;
