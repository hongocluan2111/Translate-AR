import { useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { recognizeTextFromImage } from '../services/ocr.service';
import { translateText } from '../services/translate.service';
import { Loading } from './Loading';
import { ResultBox } from './ResultBox';

type CameraScannerProps = {
  selectedLanguage: string;
};

export const CameraScanner = ({ selectedLanguage }: CameraScannerProps) => {
  const {
    videoRef,
    scanAreaRef,
    isCameraOpen,
    openCamera,
    stopCamera,
    captureFrame,
  } = useCamera();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenCamera = async () => {
    try {
      setErrorMessage('');
      await openCamera();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Camera permission was denied or the camera is unavailable.',
      );
    }
  };

  const handleStopCamera = () => {
    stopCamera();
  };

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setErrorMessage('');
      setDetectedText('');
      setTranslatedText('');

      const imageData = captureFrame();
      const text = await recognizeTextFromImage(imageData);

      if (!text) {
        setErrorMessage('No text detected. Please try again.');
        return;
      }

      setDetectedText(text);

      const translated = await translateText(text, selectedLanguage);
      setTranslatedText(translated);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Scan failed. Please try again.',
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section className="grid gap-4">
      <div className="relative overflow-hidden rounded-lg bg-slate-950 shadow-sm">
        <video
          ref={videoRef}
          className="aspect-[3/4] w-full object-cover sm:aspect-video"
          playsInline
          muted
        />

        {!isCameraOpen && (
          <div className="absolute inset-0 grid place-items-center bg-slate-900 px-6 text-center text-slate-200">
            Camera preview will appear here
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 grid place-items-center p-8">
          <div
            ref={scanAreaRef}
            className="h-44 w-full max-w-md rounded-lg border-2 border-white/90 shadow-[0_0_0_999px_rgba(15,23,42,0.35)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {!isCameraOpen ? (
          <button className="primary-button sm:col-span-2" onClick={handleOpenCamera}>
            Open Camera
          </button>
        ) : (
          <>
            <button className="primary-button" disabled={isScanning} onClick={handleScan}>
              {detectedText || translatedText ? 'Scan Again' : 'Scan'}
            </button>
            <button
              className="secondary-button"
              disabled={isScanning}
              onClick={handleStopCamera}
            >
              Stop Camera
            </button>
          </>
        )}
      </div>

      {isScanning && <Loading label="Scanning text and translating..." />}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorMessage}
        </div>
      )}

      <ResultBox detectedText={detectedText} translatedText={translatedText} />
    </section>
  );
};
