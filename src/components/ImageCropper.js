import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import "cropperjs/dist/cropper.css";
import "../App.css";

import Cropper from "react-cropper";

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function () {
        var binStr = atob(canvas.toDataURL(type, quality).split(",")[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || "image/png" }));
      });
    },
  });
}

export default class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = { src: props.imgFile, cropResult: null };
    this.cropImage = this.cropImage.bind(this);
  }

  cropImage() {
    let canvas = this.cropper.getCroppedCanvas({
      width: 500,
      imageSmoothingQuality: "high",
    });

    if (typeof canvas === "undefined") {
      return;
    }

    canvas.toBlob(
      (blob) => {
        this.props.imageCropped(blob);
      },
      "image/jpeg",
      0.9
    );
  }

  render() {
    return (
      <div className="cropContainer">
        <div className="cropButton">
          Zoom og flytt til motivet fyller firkanten
        </div>
        <div className="cropButton">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            onClick={this.cropImage}
          >
            OK
          </Button>
        </div>
        <div className="cropper">
          <Cropper
            style={{ width: "100vw", height: "80vh" }}
            aspectRatio={1}
            dragMode={"move"}
            cropBoxMovable={false}
            cropBoxResizable={false}
            highlight={false}
            scalable={false}
            wheelZoomRatio={0.3}
            guides={false}
            src={this.state.src}
            ref={(cropper) => {
              this.cropper = cropper;
            }}
          />
        </div>
      </div>
    );
  }
}
