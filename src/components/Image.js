import React from "react";
import "../App.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

function UploadedImage({ img, delImage }) {
  return (
    <div className="imgContainer">
      <img
        className="uploadedImage"
        src={URL.createObjectURL(img)}
        alt="Uploaded"
      />
    </div>
  );
}

export default UploadedImage;
