import { useCallback, useEffect, useRef, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanAreaRef = useRef<HTMLDivElement | null>(null);
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
    const scanArea = scanAreaRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      throw new Error('Camera is not ready yet.');
    }

    const videoRect = video.getBoundingClientRect();
    const scanRect = scanArea?.getBoundingClientRect();
    const visibleVideoRatio = videoRect.width / videoRect.height;
    const sourceVideoRatio = video.videoWidth / video.videoHeight;
    const scale =
      visibleVideoRatio > sourceVideoRatio
        ? video.videoWidth / videoRect.width
        : video.videoHeight / videoRect.height;
    const renderedSourceWidth = videoRect.width * scale;
    const renderedSourceHeight = videoRect.height * scale;
    const hiddenSourceX = (renderedSourceWidth - video.videoWidth) / 2;
    const hiddenSourceY = (renderedSourceHeight - video.videoHeight) / 2;
    const cropX = scanRect
      ? Math.max(0, (scanRect.left - videoRect.left) * scale - hiddenSourceX)
      : video.videoWidth * 0.1;
    const cropY = scanRect
      ? Math.max(0, (scanRect.top - videoRect.top) * scale - hiddenSourceY)
      : video.videoHeight * 0.35;
    const cropWidth = scanRect
      ? Math.min(video.videoWidth - cropX, scanRect.width * scale)
      : video.videoWidth * 0.8;
    const cropHeight = scanRect
      ? Math.min(video.videoHeight - cropY, scanRect.height * scale)
      : video.videoHeight * 0.3;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cropWidth * 2);
    canvas.height = Math.round(cropHeight * 2);

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to prepare image capture.');
    }

    // Capture and upscale only the visible scan area so OCR ignores background text/noise.
    context.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < imageData.data.length; index += 4) {
      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];
      const gray = red * 0.299 + green * 0.587 + blue * 0.114;
      const contrasted = gray > 150 ? 255 : 0;

      imageData.data[index] = contrasted;
      imageData.data[index + 1] = contrasted;
      imageData.data[index + 2] = contrasted;
    }

    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  return {
    videoRef,
    scanAreaRef,
    isCameraOpen,
    openCamera,
    stopCamera,
    captureFrame,
  };
};
