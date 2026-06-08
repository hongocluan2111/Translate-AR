type TranslationResult = Array<{
  translation_text: string;
}>;

type Translator = (
  text: string,
  options: {
    src_lang: string;
    tgt_lang: string;
  },
) => Promise<TranslationResult>;

const NLLB_MODEL = 'Xenova/nllb-200-distilled-600M';

const LANGUAGE_MAP: Record<string, string> = {
  vi: 'vie_Latn',
  en: 'eng_Latn',
  ja: 'jpn_Jpan',
  ko: 'kor_Hang',
  zh: 'zho_Hans',
  fr: 'fra_Latn',
  de: 'deu_Latn',
};

let translatorPromise: Promise<Translator> | null = null;

const getTranslator = () => {
  translatorPromise ??= import('@huggingface/transformers').then(({ pipeline }) =>
    pipeline('translation', NLLB_MODEL),
  ) as Promise<Translator>;

  return translatorPromise;
};

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  const targetLanguageCode = LANGUAGE_MAP[targetLanguage] ?? LANGUAGE_MAP.vi;
  const translator = await getTranslator();
  const result = await translator(text, {
    src_lang: 'eng_Latn',
    tgt_lang: targetLanguageCode,
  });
  const translatedText = result[0]?.translation_text?.trim();

  if (!translatedText) {
    throw new Error('Translation model did not return translated text.');
  }

  return translatedText;
};
