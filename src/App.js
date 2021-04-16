import React, { useState } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import ReplayIcon from "@material-ui/icons/Replay";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import AppleIcon from "@material-ui/icons/Apple";
import ShopOutlinedIcon from "@material-ui/icons/ShopOutlined";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import axios from "axios";

import "./App.css";

import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import UserFeedback from "./components/UserFeedback";
import ImageCropper from "./components/ImageCropper";

import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking,
} from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: "" });
var reactPlugin = new ReactPlugin();

if (
  window.location.hostname === "orakel.test.artsdatabanken.no" ||
  window.location.hostname === "orakel.artsdatabanken.no"
) {
  var appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: "a108a996-bb13-431c-a929-b70f8e15c1ea",
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: { history: browserHistory },
      },
    },
  });
  appInsights.loadAppInsights();
} else {
  console.log("Running on", window.location.hostname, "- not logging");
}

function App() {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [gotError, setError] = useState(false);
  const [useCamera, setUseCamera] = useState(true);

  const addImage = (img) => {
    setError(false);
    for (let i of img) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          setUncroppedImages([...uncroppedImages, reader.result]);
        },
        false
      );
      reader.readAsDataURL(i);
    }
  };

  const imageCropped = (img) => {
    if (img) {
      img.lastModifiedDate = new Date();
      img.name = new Date() + ".png";
      setCroppedImages([...croppedImages, img]);
      setPredictions([]);
    }
    setUncroppedImages([]);
  };

  const delImage = (name) => {
    setCroppedImages(croppedImages.filter((i) => i.name !== name));
    setPredictions([]);
    setError(false);
  };

  const preventClick = (e) => {
    e.preventDefault();
  };

  const resetImages = () => {
    setError(false);
    setCroppedImages([]);
    setPredictions([]);
  };

  const toggleMenu = () => {
    console.log("hops");
    setMenuVisible(!menuVisible);
  };

  const uploadMore = (sender) => {
    addImage(document.getElementById(sender).files);
    document.getElementById(sender).value = "";
  };

  const openGallery = (e) => {
    if (window.cordova) {
      e.preventDefault();
      setUseCamera(false);

      navigator.camera.getPicture(onSuccess, onFail, {
        destinationType: window.Camera.DestinationType.FILE_URI,
        sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: window.Camera.EncodingType.JPEG,
        mediaType: window.Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
        quality: 80,
      });

      function onSuccess(imageData) {
        setUncroppedImages([...uncroppedImages, imageData]);
      }
      function onFail(message) {
        console.log(message);
      }
    }
  };

  const openCamera = (e) => {
    if (window.cordova) {
      e.preventDefault();
      setUseCamera(true);

      navigator.camera.getPicture(onSuccess, onFail, {
        destinationType: window.Camera.DestinationType.FILE_URI,
        sourceType: window.Camera.PictureSourceType.CAMERA,
        encodingType: window.Camera.EncodingType.JPEG,
        mediaType: window.Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
        quality: 80,
        saveToPhotoAlbum: true,
      });

      function onSuccess(imageData) {
        setUncroppedImages([...uncroppedImages, imageData]);
      }
      function onFail(message) {
        console.log(message);
      }
    }
  };

  const getId = () => {
    setError(false);
    setLoading(true);

    var formdata = new FormData();
    for (let image of croppedImages) {
      formdata.append("image", image);
    }

    axios
      .post("https://ai.artsdatabanken.no/", formdata)
      .then((res) => {
        let predictions = res.data.predictions.filter(
          (pred) => pred.probability > 0.02
        );

        if (predictions.length > 5 || predictions.length === 0) {
          predictions = res.data.predictions.slice(0, 5);
        }

        setPredictions(predictions);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status) {
          setError(error.response.status);
        } else {
          setError(1);
        }

        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {!!uncroppedImages.length &&
        uncroppedImages.map((ucimg, index) => (
          <ImageCropper
            imgFile={ucimg}
            key={index}
            imageCropped={imageCropped}
            imgSize={500}
          />
        ))}

      <div className="App">
        <div id="menu" className={menuVisible ? "visible" : "invisible"}>
          <div className="content">
            <CloseIcon onClick={toggleMenu} id="closeMenu" />
            <div
              className="menuItem"
              onClick={() => {
                resetImages();
                toggleMenu();
              }}
            >
              <div>Slå på nattmodus</div>
              <Brightness4Icon />
            </div>

            <div
              className="menuItem"
              onClick={() => {
                toggleMenu();
              }}
            >
              <div>Restart appen</div>
              <ReplayIcon />
            </div>
            <div
              className="menuItem"
              onClick={() => {
                resetImages();
                toggleMenu();
              }}
            >
              <div>Artsorakelet på Google Play</div>
              <ShopOutlinedIcon />
            </div>
            <div
              className="menuItem"
              onClick={() => {
                toggleMenu();
              }}
            >
              <div>Artsorakelet i App Store</div>
              <AppleIcon />
            </div>

            <div
              className="menuItem"
              onClick={() => {
                toggleMenu();
              }}
            >
              <div>Om Artsorakelet</div>
              <InfoOutlinedIcon />
            </div>
          </div>
        </div>
        <div className="image-section">
          <MenuIcon
            className="menu-icon"
            style={{ fontSize: "2.2em" }}
            onClick={toggleMenu}
          />

          {!croppedImages.length && (
            <div className="placeholder-container">
              <h1 className="placeholder-title">Ta eller velg et bilde</h1>
              <p className="placeholder-body">
                Artsorakelet kjenner ikke igjen mennesker, husdyr, hageplanter,
                osv.
              </p>
            </div>
          )}

          {!!croppedImages.length && (
            <div className="images scrollbarless">
              {croppedImages.map((img, index) => (
                <UploadedImage img={img} key={index} delImage={delImage} />
              ))}
            </div>
          )}

          <input
            type="file"
            id="bigDropzone"
            onClick={preventClick}
            onChange={uploadMore.bind(this, "bigDropzone")}
          />
        </div>

        <div className="bottom-section scrollbarless">
          {!predictions.length &&
            !!croppedImages.length &&
            !loading &&
            !uncroppedImages.length && (
              <div
                variant="contained"
                className="id-btn"
                onClick={getId}
                tabIndex="0"
              >
                <span>Identifiser</span>
              </div>
            )}

          <UserFeedback
            predictions={predictions}
            croppedImages={croppedImages}
            uncroppedImages={uncroppedImages}
            gotError={gotError}
            loading={loading}
          />

          {!!predictions.length && !uncroppedImages.length && (
            <div>
              {predictions.map((prediction) => (
                <IdResult
                  result={prediction}
                  key={prediction.taxon.id}
                  croppedImages={croppedImages}
                />
              ))}
            </div>
          )}
          {!predictions.length && (
            <div className=" bottomButtons">
              {window.cordova &&
                !croppedImages.length &&
                !uncroppedImages.length && (
                  <div
                    className=" bottomButton galleryButton clickable"
                    onClick={openGallery}
                    tabIndex="0"
                  >
                    <PhotoLibraryIcon style={{ fontSize: ".8em" }} />
                  </div>
                )}

              <div className=" bottomButton NewImage clickable" tabIndex="0">
                <AddAPhotoIcon style={{ fontSize: ".8em" }} />
                <input
                  className="clickable"
                  type="file"
                  id="uploaderImages"
                  onClick={openCamera}
                  onChange={uploadMore.bind(this, "uploaderImages")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAITracking(reactPlugin, App);
