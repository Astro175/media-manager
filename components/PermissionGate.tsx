import { PermissionResponse } from "expo-camera";
import React from "react";
import { ActivityIndicator, Button, Linking, Text, View } from "react-native";

const PermissionGate = ({
  children,
  status,
  requestPermission,
}: {
  children: React.ReactNode;
  status: PermissionResponse | null;
  requestPermission: () => Promise<PermissionResponse>;
}) => {
  if (!status) {
    return <ActivityIndicator size={48} />;
  }

  if (
    status.status === "undetermined" ||
    (status.status === "denied" && status.canAskAgain)
  ) {
    return (
      <View>
        <Text>We need access to your camera to:</Text>
        <Text>• Take profile photos</Text>
        <Text>• Scan QR codes</Text>
        <Text>• Upload documents</Text>
        <Button onPress={requestPermission} title="Allow Camera Access" />
      </View>
    );
  } else if (status.status === "denied" && !status.canAskAgain) {
    return (
      <View>
        <Text>Permission Required</Text>
        <Text>We need camera access to take photos</Text>
        <Button title="Enable" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default PermissionGate;
