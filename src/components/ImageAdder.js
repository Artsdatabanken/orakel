import React from "react";
import "../App.css";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

function ImageAdder({ addImage }) {
  const uploadFile = () => {
    addImage(document.getElementById("uploader").files);
    document.getElementById("uploader").value = '';
  };

  return (
    <div className="gridElement NewImage clickable" tabIndex="0">
      <AddAPhotoIcon style={{ fontSize: ".8em" }} />
      <input
        className="clickable"
        type="file"
        id="uploader"
        onChange={uploadFile}
      />
    </div>
  );
}

export default ImageAdder;
