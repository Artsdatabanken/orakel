import React from "react";
import "../App.css";

function Image({ img, delImage }) {
  return (
    <div className="imgContainer">
      <img className="gridElement" src={URL.createObjectURL(img)} alt="Uploaded" />
      < span className="removeLink" onClick={delImage.bind(this, img.name)}>Fjern</span>
    </div>
  );
}

export default Image;
