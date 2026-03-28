import { CameraMode, CameraType, CameraView, FlashMode } from "expo-camera";
import { useEffect, useRef, useState } from "react";

export const useCamera = () => {
  const ref = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0)
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    return photo || null;
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlash((prev) => {
      if (prev === "off") {
        return "on";
      }
      if (prev === "on") {
        return "auto";
      }
      return "off";
    });
  };

  const startRecording = async () => {
    setIsRecording(true);
    const video = await ref.current?.recordAsync();
    setIsRecording(false);
    return video;
  };

  const stopRecording = () => {
    ref.current?.stopRecording();
  };

  return {
    ref,
    mode,
    facing,
    takePicture,
    toggleFacing,
    toggleMode,
    toggleFlashMode,
    flash,
    timer,
    startRecording,
    stopRecording,
    isRecording
  };
};
