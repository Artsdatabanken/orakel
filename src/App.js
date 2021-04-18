import React, { useState } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import ReplayIcon from "@material-ui/icons/Replay";

import axios from "axios";

import "./App.css";

import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import ExtendedResult from "./components/ExtendedResult";
import UserFeedback from "./components/UserFeedback";
import ImageCropper from "./components/ImageCropper";
import Menu from "./components/Menu";

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
  const [inputStage, setInputStage] = useState(true);
  const [resultStage, setResultStage] = useState(false);
  const [chosenPrediction, setChosenPrediction] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const [gotError, setError] = useState(false);

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
    e.stopPropagation();
    e.preventDefault();
  };

  const resetImages = () => {
    setMenuVisible(false);
    setError(false);
    setCroppedImages([]);
    setPredictions([]);
    setInputStage(true);
    setResultStage(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  const closeModal = () => {
    setChosenPrediction(false);
  };

  const goToInput = () => {
    setResultStage(false);
    setPredictions([]);
    setInputStage(true);
  }

  const uploadMore = (sender) => {
    addImage(document.getElementById(sender).files);
    document.getElementById(sender).value = "";
  };

  const openGallery = (e) => {
    if (window.cordova) {
      e.preventDefault();

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
    setInputStage(false);
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
        setResultStage(true);
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
            darkMode= {darkMode}
          />
        ))}

      <div className={"App" + (!!window.cordova ? " fullscreen" : "") + (darkMode ? " darkmode" : " lightmode")}>
        <div
          id="resultModal"
          className={"modal " + (!!chosenPrediction ? "visible" : "invisible")}
          onClick={closeModal}
        >
          <div className="content">
            <CloseIcon />

            {!!chosenPrediction && (
              <ExtendedResult
                result={chosenPrediction}
                croppedImages={croppedImages}
                preventClick={preventClick}
              />
            )}
          </div>
        </div>

        <div
          id="menu"
          className={"modal " + (menuVisible ? "visible" : "invisible")}
          onClick={toggleMenu}
        >
          <Menu resetImages={resetImages} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
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

          <div className={"images scrollbarless" + (loading ? " loading" : "")}>
            {croppedImages.map((img, index) => (
              <UploadedImage img={img} key={index} delImage={delImage} />
            ))}

            {resultStage && <div className="goToInput" onClick={goToInput}></div>}
          </div>

          <input
            type="file"
            id="bigDropzone"
            onClick={preventClick}
            onChange={uploadMore.bind(this, "bigDropzone")}
          />
        </div>

        <div
          className={
            "bottom-section scrollbarless " + (inputStage ? "" : "hidden")
          }
        >
          {!!inputStage && !!croppedImages.length && (
            <div className="top-btn" onClick={getId} tabIndex="0">
              <div className="btn id primary">Identifiser</div>
            </div>
          )}

          <UserFeedback
            predictions={predictions}
            croppedImages={croppedImages}
            uncroppedImages={uncroppedImages}
            gotError={gotError}
            loading={loading}
          />

          <div className=" bottomButtons">
            {window.cordova && (
              <div
                className="bottomButton galleryButton clickable primary"
                onClick={openGallery}
                tabIndex="0"
              >
                <PhotoLibraryIcon style={{ fontSize: ".8em" }} />
              </div>
            )}

            <div className="bottomButton NewImage primary clickable" tabIndex="0">
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
        </div>
        <div
          className={
            "bottom-section scrollbarless " + (resultStage ? "" : "hidden")
          }
        >
          {resultStage && (
            <div className="top-btn" onClick={resetImages} tabIndex="0">
              <div className="btn reset primary">
                <ReplayIcon />
              </div>
            </div>
          )}

          {!!predictions.length && (
            <div>
              {predictions.map((prediction) => (
                <IdResult
                  result={prediction}
                  key={prediction.taxon.id}
                  croppedImages={croppedImages}
                  openResult={setChosenPrediction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAITracking(reactPlugin, App);
