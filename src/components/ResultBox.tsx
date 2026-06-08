type ResultBoxProps = {
  detectedText: string;
  translatedText: string;
};

export const ResultBox = ({ detectedText, translatedText }: ResultBoxProps) => {
  if (!detectedText && !translatedText) {
    return null;
  }

  return (
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Detected Text
        </h2>
        <p className="min-h-16 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-base leading-7 text-slate-950">
          {detectedText}
        </p>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Translated Text
        </h2>
        <p className="min-h-16 whitespace-pre-wrap rounded-md bg-emerald-50 p-3 text-base leading-7 text-emerald-950">
          {translatedText}
        </p>
      </div>
    </section>
  );
};
