import React from "react";
import "../App.css";

function UploadedImage({ img, imgIndex, editImage }) {

  const doEdit = () => {
    editImage(imgIndex);
  };

  return (
    <div className="imgContainer" onClick={doEdit}>
      <img
        className="uploadedImage"
        src={URL.createObjectURL(img)}
        alt="Uploaded"
      />
    </div>
  );
}

export default UploadedImage;
