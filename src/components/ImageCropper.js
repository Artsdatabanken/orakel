import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import Slider from "@material-ui/core/Slider";
import DoneIcon from "@material-ui/icons/Done";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";

import "../App.css";

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

        console.log("Using own toBlob");

        callback(new Blob([arr], { type: type || "image/png" }));
      });
    },
  });
}

export const ImageCropper = ({ imgFile, darkMode, imageCropped, imgSize }) => {
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();
  const [zoom, setZoom] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const reader = new FileReader();
  reader.onload = () => {
    setImage(reader.result);
    initCropper();
  };
  reader.readAsDataURL(imgFile);

  const initCropper = () => {
    if (!initialized && cropper && cropper.containerData) {
      setInitialized(true);

      let cropBoxSize =
        Math.min(cropper.containerData.width, cropper.containerData.height) *
        0.9;

      // this.cropper.setCropBoxData({
      //   width: cropBoxSize,
      //   left: (this.cropper.cropper.containerData.width - cropBoxSize) / 2,
      //   top: (this.cropper.cropper.containerData.height - cropBoxSize) / 2,
      // });

      // Set the initial zoom to fit the smallest dimension
      let zoomFactor = Math.max(
        cropBoxSize /
          Math.min(
            cropper.canvasData.naturalWidth,
            cropper.canvasData.naturalHeight
          )
      );
      setZoom(zoomFactor);
      cropper.zoomTo(zoomFactor);
    }
  };

  const getCropData = () => {
    if (cropper && cropper.containerData) {
      cropper
        .getCroppedCanvas({
          width: imgSize,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        })
        .toBlob(
          (blob) => {
            imageCropped(blob);
          },
          "image/jpeg",
          0.7
        );
    }
  };

  const cancel = () => {
    imageCropped();
  };

  const rotateLeft = () => {
    if (cropper && cropper.containerData) {
      cropper.rotate(-90);
    }
  };

  const rotateRight = () => {
    if (cropper && cropper.containerData) {
      cropper.rotate(90);
    }
  };

  const zoomIn = () => {
    if (cropper && cropper.containerData) {
      cropper.zoom(0.1);
    }
  };

  const zoomOut = () => {
    if (cropper && cropper.containerData) {
      cropper.zoom(-0.1);
    }
  };

  const doZoom = (event) => {
    setZoom(event.detail.ratio);
  };

  const slideZoom = (event, newValue) => {
    cropper.zoomTo(newValue);
    setZoom(newValue);
  };

  return (
    <div className={"cropContainer " + (darkMode ? "darkmode" : "lightmode")}>
      <div className="cropper">
        <Cropper
          style={{
            width: "100vw",
            height: window.innerHeight - 65 - 150 + "px",
          }}
          aspectRatio={1}
          viewMode={0}
          dragMode={"move"}
          zoom={doZoom}
          autoCropArea={0.9}
          cropBoxMovable={false}
          cropBoxResizable={false}
          toggleDragModeOnDblclick={false}
          highlight={false}
          scalable={false}
          rotatable={true}
          wheelZoomRatio={0.2}
          guides={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          ready={initCropper}
          src={image}
        />
      </div>
      <div className="editing">
        <RotateLeftIcon
          className="clickable imageEditButton"
          onClick={rotateLeft}
        />
        <ZoomOutIcon className="clickable imageEditButton" onClick={zoomOut} />
        <div className="slider">
          <Slider
            value={zoom}
            onChange={slideZoom}
            step={0.01}
            min={0}
            max={2}
            aria-labelledby="zoom-slider"
          />
        </div>
        <ZoomInIcon className="clickable imageEditButton" onClick={zoomIn} />
        <RotateRightIcon
          className="clickable imageEditButton"
          onClick={rotateRight}
        />
      </div>

      <div className="hint">Zoom og flytt til motivet fyller firkanten</div>

      <div className="buttons">
        <div onClick={cancel} className="btn danger">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
            />
          </svg>
        </div>{" "}
        <div onClick={getCropData} className="btn primary">
          <DoneIcon />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

// export default class ImageCropper extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { src: props.imgFile, cropResult: null, zoom: 0.2 };
//     this.cropImage = this.cropImage.bind(this);
//     this.cancel = this.cancel.bind(this);
//     this.doZoom = this.doZoom.bind(this);
//     this.slideZoom = this.slideZoom.bind(this);
//   }

//   cropImage() {
//     let canvas = this.cropper.getCroppedCanvas({
//       width: this.props.imgSize,
//       imageSmoothingEnabled: true,
//       imageSmoothingQuality: "high",
//     });

//     if (!canvas || typeof canvas === "undefined") {
//       this.props.imageCropped(undefined);
//       return;
//     }

//     canvas.toBlob(
//       (blob) => {
//         this.props.imageCropped(blob);
//       },
//       "image/jpeg",
//       1
//     );
//   }

//   cancel() {
//     this.props.imageCropped();
//   }

//   debounce(func, time = 100) {
//     var timer;
//     return function (event) {
//       if (timer) clearTimeout(timer);
//       timer = setTimeout(func, time, event);
//     };
//   }

//   initCropper() {
//     if (this.cropper) {
//       let cropBoxSize =
//         Math.min(
//           this.cropper.cropper.containerData.width,
//           this.cropper.cropper.containerData.height
//         ) * 0.9;

//       // this.cropper.setCropBoxData({
//       //   width: cropBoxSize,
//       //   left: (this.cropper.cropper.containerData.width - cropBoxSize) / 2,
//       //   top: (this.cropper.cropper.containerData.height - cropBoxSize) / 2,
//       // });

//       // Set the initial zoom to fit the smallest dimension
//       let zoomFactor = Math.max(
//         cropBoxSize /
//           Math.min(
//             this.cropper.cropper.canvasData.naturalWidth,
//             this.cropper.cropper.canvasData.naturalHeight
//           )
//       );
//       this.setState({ zoom: zoomFactor });
//       console.log(this.cropper);
//       this.cropper.zoomTo(zoomFactor);
//     }
//   }

//   slideZoom(event, newValue) {
//     this.cropper.zoomTo(newValue);
//   }

//   doZoom(event) {
//     this.setState({ zoom: event.detail.ratio });
//   }

//   rotateLeft = () => {
//     if (this.cropper) {
//       this.cropper.rotate(-90);
//     }
//   };

//   rotateRight = () => {
//     if (this.cropper) {
//       this.cropper.rotate(90);
//     }
//   };

//   zoomOut = () => {
//     if (this.cropper) {
//       this.cropper.zoom(-0.1);
//     }
//   };

//   zoomIn = () => {
//     if (this.cropper) {
//       this.cropper.zoom(0.1);
//     }
//   };

//   render() {
//     window.addEventListener(
//       "resize",
//       this.debounce(this.initCropper.bind(this), 500).bind(this)
//     );

//     // set the height of the cropper to the visible height, minus the heights of the header and the (actions) footer
//     return (
//       <div className={"cropContainer " + (this.props.darkMode ? "darkmode" : "lightmode")}>
//         <div className="cropper">
//           <Cropper
//             style={{
//               width: "100vw",
//               height: window.innerHeight - 65 - 150 + "px",
//             }}
//             aspectRatio={1}
//             viewMode={0}
//             dragMode={"move"}
//             zoom={this.doZoom}
//             autoCropArea={0.9}
//             ready={this.initCropper.bind(this)}
//             cropBoxMovable={false}
//             cropBoxResizable={false}
//             toggleDragModeOnDblclick={false}
//             highlight={false}
//             scalable={false}
//             rotatable={true}
//             wheelZoomRatio={0.2}
//             guides={false}
//             src={this.state.src}
//             ref={(cropper) => {
//               this.cropper = cropper;
//             }}
//           />
//         </div>
//         <div className="editing">
//           <RotateLeftIcon
//             className="clickable imageEditButton"
//             onClick={this.rotateLeft}
//           />
//           <ZoomOutIcon
//             className="clickable imageEditButton"
//             onClick={this.zoomOut}
//           />
//           <div className="slider">
//             <Slider
//               value={this.state.zoom}
//               onChange={this.slideZoom}
//               step={0.01}
//               min={0}
//               max={2}
//               aria-labelledby="zoom-slider"
//             />
//           </div>
//           <ZoomInIcon
//             className="clickable imageEditButton"
//             onClick={this.zoomIn}
//           />
//           <RotateRightIcon
//             className="clickable imageEditButton"
//             onClick={this.rotateRight}
//           />
//         </div>

//         <div className="hint">Zoom og flytt til motivet fyller firkanten</div>

//         <div className="buttons">
//           <div onClick={this.cancel} className="btn danger">
//             <svg viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
//               />
//             </svg>
//           </div>{" "}
//           <div onClick={this.cropImage} className="btn primary">
//             <DoneIcon />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
