/// <reference types="vite/client" />

interface CloudinaryUploadWidgetResult {
  event?: string;
  info?: { secure_url?: string };
}

interface CloudinaryUploadWidgetInstance {
  open: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: { cloudName: string; uploadPreset: string },
        callback: (
          error: unknown,
          result?: CloudinaryUploadWidgetResult,
        ) => void,
      ) => CloudinaryUploadWidgetInstance;
    };
  }
}

export {};
