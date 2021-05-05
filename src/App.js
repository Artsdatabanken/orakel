import React, { useState } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

import axios from "axios";

import "./App.css";

import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import ExtendedResult from "./components/ExtendedResult";
import UserFeedback from "./components/UserFeedback";
import ImageCropper from "./components/ImageCropper";
import Menu from "./components/Menu";
import About from "./components/About";
import ExtendedManual from "./components/ExtendedManual";

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
  const [fullImages, setFullImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputStage, setInputStage] = useState(true);
  const [resultStage, setResultStage] = useState(false);
  const [chosenPrediction, setChosenPrediction] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [extendedManualVisible, setExtendedManualVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [gotError, setError] = useState(false);
  const [usedGallery, setUsedGallery] = useState(false);

  document.addEventListener("backbutton", onBackKeyDown, false);
  function onBackKeyDown() {
    // Handle the back button
    setMenuVisible(false);
    setChosenPrediction(false);
    setAboutVisible(false);
    setExtendedManualVisible(false);
  }

  const addImage = (images) => {
    setError(false);

    for (let i of images) {
      setUncroppedImages([...uncroppedImages, i]);
    }
  };

  const imageCropped = (img) => {
    if (img) {
      img.lastModifiedDate = new Date();
      img.name = new Date() + ".png";
      setCroppedImages([...croppedImages, img]);
      setFullImages([...fullImages, ...uncroppedImages]);
      setPredictions([]);
    }
    setUncroppedImages([]);
  };

  const editImage = (index) => {
    setUncroppedImages([fullImages[index]]);
    setFullImages(
      fullImages.slice(0, index).concat(fullImages.slice(index + 1))
    );
    setCroppedImages(
      croppedImages.slice(0, index).concat(croppedImages.slice(index + 1))
    );
    setInputStage(true);
    setResultStage(false);
  };

  const resetImages = () => {
    setMenuVisible(false);
    setError(false);
    setCroppedImages([]);
    setPredictions([]);
    setFullImages([]);
    setInputStage(true);
    setResultStage(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDarkMode = () => {
    if (window.cordova) {
      StatusBar.backgroundColorByHexString(darkMode ? "#dd8508" : "#121212");
    }
    setDarkMode(!darkMode);
  };

  const closeModal = () => {
    setChosenPrediction(false);
    setAboutVisible(false);
    setExtendedManualVisible(false);
  };

  const goToInput = () => {
    setResultStage(false);
    setPredictions([]);
    setInputStage(true);
    if (usedGallery) {
      document.getElementById("galleryOpener").click();
    } else {
      document.getElementById("uploaderImages").click();
    }
  };

  const uploadMore = (sender) => {
    addImage(document.getElementById(sender).files);
    document.getElementById(sender).value = "";
  };

  const openGallery = (e) => {
    if (window.cordova) {
      e.preventDefault();
      setUsedGallery(true);

      navigator.camera.getPicture(onSuccess, onFail, {
        // destinationType: window.Camera.DestinationType.FILE_URI,
        destinationType: window.Camera.DestinationType.DATA_URL,
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
      setUsedGallery(false);

      navigator.camera.getPicture(onSuccess, onFail, {
        // destinationType: window.Camera.DestinationType.FILE_URI,
        destinationType: window.Camera.DestinationType.DATA_URL,
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
        setResultStage(false);
        setInputStage(true);
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
            darkMode={darkMode}
          />
        ))}

      <div
        className={
          "App" +
          (window.cordova ? " fullscreen" : "") +
          (darkMode ? " darkmode" : " lightmode")
        }
      >
        <div
          id="modal"
          className={
            "modal " +
            (!!chosenPrediction | aboutVisible | extendedManualVisible
              ? "visible"
              : "invisible")
          }
          onClick={closeModal}
        >
          <div
            className="content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CloseIcon onClick={closeModal} />

            {!!chosenPrediction && (
              <ExtendedResult
                result={chosenPrediction}
                croppedImages={croppedImages}
              />
            )}

            {aboutVisible && <About />}

            {extendedManualVisible && <ExtendedManual />}
          </div>
        </div>

        <div
          id="menu"
          className={"modal " + (menuVisible ? "visible" : "invisible")}
          onClick={toggleMenu}
        >
          <Menu
            resetImages={resetImages}
            toggleDarkMode={toggleDarkMode}
            toggleAbout={setAboutVisible}
            toggleManual={setExtendedManualVisible}
            darkMode={darkMode}
          />
        </div>

        <div className="image-section">
          <div className="topBar">
            <MenuIcon
              className={
                "menu-icon" + (!inputStage && !resultStage ? " hidden" : "")
              }
              style={{ fontSize: "2em" }}
              onClick={toggleMenu}
            />

            <img
              src="Artsdatabanken_notext_mono_white.svg"
              alt="Artsdatabanken"
              className={
                "logo" + (!inputStage && !resultStage ? " hidden" : "")
              }
            />
          </div>
          <div
            className={
              "topContent" + (!inputStage && !resultStage ? " expanded" : "")
            }
          >
            {!croppedImages.length && (
              <div className="placeholder-container">
                <h1 className="placeholder-title">
                  Ta eller velg et bilde for å starte
                </h1>
                <p className="placeholder-body">
                  Artsorakelet kjenner ikke igjen mennesker, husdyr,
                  hageplanter, osv.
                </p>
              </div>
            )}

            <div
              className={"images scrollbarless" + (loading ? " loading" : "")}
            >
              {croppedImages.map((img, index) => (
                <UploadedImage
                  img={img}
                  key={index}
                  imgIndex={index}
                  editImage={editImage}
                />
              ))}

              {!!croppedImages.length && (inputStage || resultStage) && (
                <div className="goToInput" onClick={goToInput}></div>
              )}
            </div>
          </div>
        </div>

        <div
          className={
            "bottom-section scrollbarless " +
            (inputStage || resultStage ? "" : "hidden")
          }
        >
          {inputStage && !!croppedImages.length && (
            <div className="top-btn" onClick={getId} tabIndex="0">
              <div className="btn id primary">Identifiser</div>
            </div>
          )}

          {resultStage && (
            <div className="top-btn">
              <div
                className="btn reset primary"
                onClick={resetImages}
                tabIndex="0"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                  />
                </svg>
                {/* <ReplayIcon /> */}
              </div>
            </div>
          )}

          {resultStage && !!predictions.length && (
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

          {inputStage && (
            <UserFeedback
              inputStage={inputStage}
              gotError={gotError}
              loading={loading}
            />
          )}

          <div className={"bottomButtons " + (inputStage ? "" : "hidden")}>
            {window.cordova && (
              <div
                className="bottomButton galleryButton clickable primary"
                id="galleryOpener"
                onClick={openGallery}
                tabIndex="0"
              >
                <PhotoLibraryIcon style={{ fontSize: ".8em" }} />
              </div>
            )}

            <div
              className="bottomButton newImageButton primary clickable"
              tabIndex="0"
            >
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
      </div>
    </React.Fragment>
  );
}

export default withAITracking(reactPlugin, App);
