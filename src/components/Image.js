import React from "react";
import "../App.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

function UploadedImage({ img, delImage }) {
  return (
    <div className="imgContainer">
      <img
        className="gridElement"
        src={URL.createObjectURL(img)}
        alt="Uploaded"
      />

      <DeleteForeverIcon
        className="removeLink clickable"
        onClick={delImage.bind(this, img.name)}
      />
    </div>
  );
}

export default UploadedImage;
