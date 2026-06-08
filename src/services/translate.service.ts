const API_URL = import.meta.env.VITE_TRANSLATE_API_URL;

type TranslateResponse = {
  translatedText?: string;
};

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  if (!API_URL) {
    throw new Error('VITE_TRANSLATE_API_URL is not configured');
  }

  const response = await fetch(`${API_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: targetLanguage,
      format: 'text',
    }),
  });

  if (!response.ok) {
    throw new Error('Translate failed');
  }

  const data = (await response.json()) as TranslateResponse;

  if (!data.translatedText) {
    throw new Error('Translate response is missing translatedText');
  }

  return data.translatedText;
};
