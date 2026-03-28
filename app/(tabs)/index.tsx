import MediaPreview from "@/components/MediaPreview";
import PermissionGate from "@/components/PermissionGate";
import { useCamera } from "@/hooks/useCamera";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Screen = () => {
  const [status, requestPermission] = useCameraPermissions();
  const [gallerySelections, setGallerySelections] =
    useState<ImagePicker.ImagePickerAsset[]>();
  const [microphoneStatus, requestMicrophonePermissions] =
    useMicrophonePermissions();
  const [uri, setUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const {
    ref,
    mode,
    facing,
    takePicture,
    toggleFlashMode,
    toggleFacing,
    toggleMode,
    flash,
    timer,
    startRecording,
    stopRecording,
    isRecording,
  } = useCamera();
  const seconds = timer % 60;
  const minutes = Math.floor((timer / 60) % 60);
  const hours = Math.floor((timer / 3600) % 60);
  const format = (num: number) => String(num).padStart(2);
  const formattedTime = `${format(hours)}:${format(minutes)}:${format(seconds)}`;

  const handleShutterPress = async () => {
    if (mode === "picture") {
      const photo = await takePicture();
      if (photo) {
        setUri(photo.uri);
      }
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        const video = await startRecording();
        if (video) {
          setVideoUri(video.uri);
        }
      }
    }
  };

  const handleToggleMode = () => {
    if (mode === "picture") {
      if (
        microphoneStatus?.status === "undetermined" ||
        (microphoneStatus?.status === "denied" && microphoneStatus?.canAskAgain)
      ) {
        Alert.alert(
          "Microphone Permission",
          "We need access to your microphone to:\n\n• Record voice messages\n• Enable audio calls\n• Capture audio for features in the app",
          [
            {
              text: "Deny",
              style: "cancel",
            },
            {
              text: "Allow Microphone Access",
              onPress: async () => {
                const result = await requestMicrophonePermissions();
                if (result.status === "granted") {
                  toggleMode();
                }
              },
            },
          ],
        );
      } else if (
        microphoneStatus?.status === "denied" &&
        !microphoneStatus.canAskAgain
      ) {
        return Alert.alert(
          "Microphone Permission Required",
          "We need access to your microphone to record audio and enable voice features. Please enable microphone access in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      } else if (microphoneStatus?.granted) {
        toggleMode();
      }
    } else {
      toggleMode();
    }
  };

  const handleGalleryPick = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      setGallerySelections(result.assets);
    }
  };

  const renderCamera = () => {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={ref}
          mode={mode}
          facing={facing}
          flash={flash}
          responsiveOrientationWhenOrientationLocked
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            top: 20,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <View>
            {
              <Pressable onPress={toggleFlashMode}>
                {flash === "off" ? (
                  <Ionicons name="flash-off" />
                ) : flash === "on" ? (
                  <Ionicons name="flash" />
                ) : (
                  <Ionicons name="flash-outline" />
                )}
              </Pressable>
            }
          </View>
          {mode === "video" && isRecording && (
            <Text
              style={{
                color: "red",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {formattedTime}
            </Text>
          )}
          <View>
            <Pressable onPress={toggleFacing}>
              <Ionicons name="camera-reverse" />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 30,
          }}
        >
          <Pressable onPress={handleToggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={handleShutterPress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={handleGalleryPick}>
            <Ionicons name="images" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <PermissionGate status={status} requestPermission={requestPermission}>
      {uri ? (
        <MediaPreview
          uri={uri}
          mediaType={mode}
          onRetake={() => setUri(null)}
          onAccept={() => {}}
        />
      ) : (
        renderCamera()
      )}
    </PermissionGate>
  );
};

const styles = StyleSheet.create({
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});

export default Screen;
