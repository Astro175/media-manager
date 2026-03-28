import { Image } from "expo-image";
import React from "react";
import { Button, View } from "react-native";

const MediaPreview = ({
  uri,
  mediaType,
  onRetake,
  onAccept,
}: {
  uri: string;
  mediaType: "picture" | "video";
  onRetake: () => void;
  onAccept: () => void;
}) => {
  return (
    <View>
      {mediaType === "picture" ? (
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: 300, aspectRatio: 1 }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="Take another picture" onPress={onRetake} />
            <Button title="Proceed " onPress={onAccept} />
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default MediaPreview;
