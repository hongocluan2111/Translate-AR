import { useCallback, useEffect, useRef, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  }, []);

  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Your browser does not support camera access.');
    }

    stopCamera();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
      audio: false,
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setIsCameraOpen(true);
  }, [stopCamera]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      throw new Error('Camera is not ready yet.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to prepare image capture.');
    }

    // Capture the current camera frame for OCR processing.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  return {
    videoRef,
    isCameraOpen,
    openCamera,
    stopCamera,
    captureFrame,
  };
};
