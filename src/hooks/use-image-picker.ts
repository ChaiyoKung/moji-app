import ImagePicker, { Options } from "react-native-image-crop-picker";
import { useAppToast } from "./use-app-toast";

export function useImagePicker<O extends Options>(options: O) {
  const toast = useAppToast();

  const handleError = (error: unknown) => {
    if (error instanceof Error && "code" in error) {
      if (error.code === "E_PICKER_CANCELLED") {
        console.warn("Image picker cancelled");
        return;
      }

      if (error.code === "E_NO_IMAGE_DATA_FOUND") {
        toast.error("ไม่พบข้อมูลภาพ");
        return;
      }

      if (error.code === "E_NO_LIBRARY_PERMISSION") {
        toast.error("ไม่มีสิทธิ์เข้าถึงคลังภาพ");
        return;
      }

      if (error.code === "E_NO_CAMERA_PERMISSION") {
        toast.error("ไม่มีสิทธิ์เข้าถึงกล้อง");
        return;
      }

      if (error.code === "E_ERROR_WHILE_CLEANING_FILES") {
        toast.error("เกิดข้อผิดพลาดในการล้างไฟล์ชั่วคราว");
        return;
      }
    }

    console.error("Image picker error:", error);
    toast.error("เกิดข้อผิดพลาดในการเลือกภาพ");
  };

  const openLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker(options);
      return image;
    } catch (error) {
      handleError(error);
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera(options);
      return image;
    } catch (error) {
      handleError(error);
    }
  };

  return { openLibrary, openCamera };
}
