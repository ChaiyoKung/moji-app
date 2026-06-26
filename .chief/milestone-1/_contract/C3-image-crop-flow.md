# Contract C3 — Image Selection & Crop Flow

## Library

`react-native-image-crop-picker` — handles both picking from library and taking a new photo, with a built-in cropper.

## Trigger Options

Show an action sheet (two options) when the attachment button is tapped:

| Option | Action |
|---|---|
| "Take Photo" | Open device camera via `ImagePicker.openCamera({ cropping: true, ... })` |
| "Choose from Library" | Open photo library via `ImagePicker.openPicker({ cropping: true, ... })` |

## Cropper Configuration

```ts
const CROP_OPTIONS = {
  cropping: true,
  freeStyleCropEnabled: true,   // Freeform bounding box (no fixed aspect ratio)
  includeBase64: false,
  mediaType: "photo",
  compressImageQuality: 0.8,
} satisfies Options;
```

## Output

On approval the library returns an `Image` object. Extract:

```ts
interface CroppedImageResult {
  uri: string;       // Local file:// URI of the cropped image
  mime: string;      // e.g. "image/jpeg"
  width: number;
  height: number;
}
```

Store `uri` as `ChatInputState.imageUri`. Display as a thumbnail (80×80 px) above the input bar. Include a dismiss (×) button to remove the image.

## Multipart Upload

When building the FormData payload:

```ts
formData.append("image", {
  uri: imageUri,
  name: "receipt.jpg",
  type: "image/jpeg",
} as any);  // React Native FormData hack — type cast required
```

## Permissions

`react-native-image-crop-picker` requests camera and photo library permissions internally on first use (iOS + Android). No manual permission prompting is required in app code.
