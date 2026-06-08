import Tesseract from 'tesseract.js';

export const recognizeTextFromImage = async (imageData: string): Promise<string> => {
  const result = await Tesseract.recognize(imageData, 'eng');
  return result.data.text.trim();
};
