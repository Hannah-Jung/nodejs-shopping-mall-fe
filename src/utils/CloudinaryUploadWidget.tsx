// import React, { Component } from "react";
// import { Button } from "react-bootstrap";
// import "../App.css";
// import "../common/style/common.style.css";

// const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

// class CloudinaryUploadWidget extends Component {
//   componentDidMount() {
//     var myWidget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: CLOUDNAME,
//         uploadPreset: UPLOADPRESET,
//       },
//       (error, result) => {
//         if (!error && result && result.event === "success") {
//           console.log("Done! Here is the image info: ", result.info);
//           document
//             .getElementById("uploadedimage")
//             .setAttribute("src", result.info.secure_url);
//           this.props.uploadImage(result.info.secure_url);
//         }
//       }, //https://cloudinary.com/documentation/react_image_and_video_upload
//     );
//     document.getElementById("upload_widget").addEventListener(
//       "click",
//       function () {
//         myWidget.open();
//       },
//       false,
//     );
//   }

//   render() {
//     return (
//       <Button id="upload_widget" size="sm" className="ml-2">
//         Upload Image +
//       </Button>
//     );
//   }
// }

// export default CloudinaryUploadWidget;

import { Component } from "react";
import { Button } from "react-bootstrap";
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
