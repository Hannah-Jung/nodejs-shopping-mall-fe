import { Component } from "react";
import { Button } from "@/components/ui/button";
import "../App.css";
import "../common/style/common.style.css";

const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_PRESET as string;
interface CloudinaryUploadWidgetProps {
  uploadImage: (url: string) => void;
}

class CloudinaryUploadWidget extends Component<CloudinaryUploadWidgetProps> {
  componentDidMount() {
    const { uploadImage } = this.props;
    const cloudinary = window.cloudinary;
    if (!cloudinary) {
      console.warn("Cloudinary not loaded");
      return;
    }
    const myWidget = cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (
        error: unknown,
        result?: { event?: string; info?: { secure_url?: string } },
      ) => {
        if (!error && result?.event === "success" && result.info?.secure_url) {
          const el = document.getElementById("uploadedimage");
          if (el) el.setAttribute("src", result.info.secure_url);
          uploadImage(result.info.secure_url);
        }
      },
    );
    const btn = document.getElementById("upload_widget");
    if (btn) {
      btn.addEventListener("click", () => myWidget.open(), false);
    }
  }

  render() {
    return (
      <Button id="upload_widget" type="button" size="sm" className="ml-2">
        Upload Image +
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
