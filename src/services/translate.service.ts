const API_URL = import.meta.env.VITE_TRANSLATE_API_URL;

type TranslateResponse = {
  translatedText?: string;
};

const getTranslateEndpoint = () => {
  if (!API_URL) {
    throw new Error('VITE_TRANSLATE_API_URL is not configured');
  }

  const normalizedUrl = API_URL.replace(/\/+$/, '');
  return normalizedUrl.endsWith('/translate')
    ? normalizedUrl
    : `${normalizedUrl}/translate`;
};

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  let response: Response;

  try {
    response = await fetch(getTranslateEndpoint(), {
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
  } catch {
    throw new Error(
      'Translate API is unreachable. Check VITE_TRANSLATE_API_URL and make sure LibreTranslate is running.',
    );
  }

  if (!response.ok) {
    throw new Error(`Translate failed with status ${response.status}`);
  }

  const data = (await response.json()) as TranslateResponse;

  if (!data.translatedText) {
    throw new Error('Translate response is missing translatedText');
  }

  return data.translatedText;
};
