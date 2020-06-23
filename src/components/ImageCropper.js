import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import Grid from "@material-ui/core/Grid";
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
    this.state = { src: props.imgFile, cropResult: null, zoom: 0.7 };
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
      0.9
    );
  }

  cancel() {
    this.props.imageCropped();
  }

  slideZoom(event, newValue) {
    this.cropper.zoomTo(newValue);
  }

  doZoom(event) {
    this.setState({ zoom: event.detail.ratio });
  }

  render() {
    if(this.state.src.slice(0,10) !== "data:image") {
      this.props.imageCropped(undefined);
      return <div>Det er ikke et bilde</div>;
    }

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
            startIcon={<DoneIcon />}
            onClick={this.cropImage}
          >
            Ferdig
          </Button>{" "}
          <Button
            variant="contained"
            style={{ backgroundColor: "darkred", color: "white" }}
            size="large"
            startIcon={<CancelIcon />}
            onClick={this.cancel}
          >
            Avbryt
          </Button>
          <Grid container spacing={2}>
            <Grid item>
              <ZoomOutIcon />
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
              <ZoomInIcon />
            </Grid>
          </Grid>
        </div>
        <div className="cropper">
          <Cropper
            style={{ width: "100vw", height: "80vh" }}
            aspectRatio={1}
            viewMode={0}
            dragMode={"move"}
            zoom={this.doZoom}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            highlight={false}
            scalable={false}
            wheelZoomRatio={0.2}
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
