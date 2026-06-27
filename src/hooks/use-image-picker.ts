import { ActionSheetIOS, Alert, Platform } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

const CROP_OPTIONS = {
  cropping: true,
  freeStyleCropEnabled: true,
  includeBase64: false,
  mediaType: "photo" as const,
  compressImageQuality: 0.8,
};

export interface PickedImage {
  uri: string;
  mime: string;
}

async function openCamera(): Promise<PickedImage | null> {
  try {
    const image = await ImagePicker.openCamera(CROP_OPTIONS);
    return { uri: image.path, mime: image.mime };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code: string }).code === "E_PICKER_CANCELLED"
    ) {
      return null;
    }
    throw err;
  }
}

async function openLibrary(): Promise<PickedImage | null> {
  try {
    const image = await ImagePicker.openPicker(CROP_OPTIONS);
    return { uri: image.path, mime: image.mime };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code: string }).code === "E_PICKER_CANCELLED"
    ) {
      return null;
    }
    throw err;
  }
}

export function useImagePicker(onPick: (image: PickedImage) => void) {
  const pickImage = () => {
    const options = ["Take Photo", "Choose from Library", "Cancel"];
    const cancelIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancelIndex },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            const result = await openCamera();
            if (result) onPick(result);
          } else if (buttonIndex === 1) {
            const result = await openLibrary();
            if (result) onPick(result);
          }
        }
      );
    } else {
      Alert.alert("Attach Image", undefined, [
        {
          text: "Take Photo",
          onPress: async () => {
            const result = await openCamera();
            if (result) onPick(result);
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const result = await openLibrary();
            if (result) onPick(result);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return pickImage;
}
