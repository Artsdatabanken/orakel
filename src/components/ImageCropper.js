import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import Grid from "@material-ui/core/Grid";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";

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
    this.state = { src: props.imgFile, cropResult: null, zoom: 0.2 };
    this.cropImage = this.cropImage.bind(this);
    this.cancel = this.cancel.bind(this);
    this.doZoom = this.doZoom.bind(this);
    this.slideZoom = this.slideZoom.bind(this);
  }

  cropImage() {
    let canvas = this.cropper.getCroppedCanvas({
      width: this.props.imgSize,
      imageSmoothingQuality: "high",
    });

    if (!canvas || typeof canvas === "undefined") {
      this.props.imageCropped(undefined);
      return;
    }

    canvas.toBlob(
      (blob) => {
        this.props.imageCropped(blob);
      },
      "image/jpeg",
      0.8
    );
  }

  cancel() {
    this.props.imageCropped();
  }

  debounce(func, time = 100) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, time, event);
    };
  }

  initCropper() {
    if (this.cropper) {
      let cropBoxSize =
        Math.min(
          this.cropper.cropper.containerData.width,
          this.cropper.cropper.containerData.height
        ) * 0.9;

      this.cropper.setCropBoxData({
        width: cropBoxSize,
        left: (this.cropper.cropper.containerData.width - cropBoxSize) / 2,
        top: (this.cropper.cropper.containerData.height - cropBoxSize) / 2,
      });

      // Set the initial zoom to fit the smallest dimension
      let zoomFactor = Math.max(
        cropBoxSize /
          Math.min(
            this.cropper.cropper.canvasData.naturalWidth,
            this.cropper.cropper.canvasData.naturalHeight
          )
      );
      this.setState({ zoom: zoomFactor });
      this.cropper.zoomTo(zoomFactor);
    }
  }

  slideZoom(event, newValue) {
    this.cropper.zoomTo(newValue);
  }

  doZoom(event) {
    this.setState({ zoom: event.detail.ratio });
  }

  rotateLeft = () => {
    if (this.cropper) {
      this.cropper.rotate(-90);
    }
  };

  rotateRight = () => {
    if (this.cropper) {
      this.cropper.rotate(90);
    }
  };

  zoomOut = () => {
    if (this.cropper) {
      this.cropper.zoom(-.1);
    }
  };

  zoomIn = () => {
    if (this.cropper) {
      this.cropper.zoom(.1);
    }
  };

  render() {
    if (this.state.src.slice(0, 10) !== "data:image") {
      this.props.imageCropped(undefined);
      return <div>Det er ikke et bilde</div>;
    }

    window.addEventListener(
      "resize",
      this.debounce(this.initCropper.bind(this), 500).bind(this)
    );

    // set the height of the cropper to the visible height, minus the heights of the header and the (actions) footer
    return (
      <div className="cropContainer">
        <div className="cropper">
          <Cropper
            style={{
              width: "100vw",
              height: window.innerHeight - 65 - 140 + "px",
            }}
            aspectRatio={1}
            viewMode={0}
            dragMode={"move"}
            zoom={this.doZoom}
            autoCropArea={0.9}
            ready={this.initCropper.bind(this)}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            highlight={false}
            scalable={false}
            rotatable={true}
            wheelZoomRatio={0.2}
            guides={false}
            src={this.state.src}
            ref={(cropper) => {
              this.cropper = cropper;
            }}
          />
        </div>
        <div className="actions">
          <Grid container>
            <Grid item>
              <RotateLeftIcon className="clickable imageEditButton" onClick={this.rotateLeft} />
              <ZoomOutIcon className="clickable imageEditButton" onClick={this.zoomOut} />
            </Grid>
            <Grid item xs>
              <Slider
                value={this.state.zoom}
                onChange={this.slideZoom}
                step={0.01}
                min={0}
                max={2}
                aria-labelledby="zoom-slider"
              />{" "}
            </Grid>
            <Grid item>
              <ZoomInIcon  className="clickable imageEditButton" onClick={this.zoomIn} />
              <RotateRightIcon
                className="clickable imageEditButton"
                onClick={this.rotateRight}
              />
            </Grid>
          </Grid>

          <div className="cropButton">
            Zoom og flytt til motivet fyller firkanten
          </div>
          <div className="cropButton">
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={this.cancel}
            >
              Avbryt
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DoneIcon />}
              onClick={this.cropImage}
            >
              Ferdig
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
