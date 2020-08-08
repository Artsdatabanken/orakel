import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import ReplayIcon from "@material-ui/icons/Replay";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import "./App.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import About from "./components/About";
import ImageCropper from "./components/ImageCropper";
import { runningOnMobile } from "./utils/utils";

import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking,
} from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: "" });
var reactPlugin = new ReactPlugin();
let device = { platform: "app" };

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
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportResult, setReportResult] = useState(false);

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

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const openReportDialog = (result) => {
    setReportResult(result);
    setDialogOpen(true);
  };

  const reportAO = () => {
    var URL;

    const prefix =
      window.location.hostname === "orakel.test.artsdatabanken.no"
        ? "test"
        : "www";

    if (runningOnMobile()) {
      if (prefix === "test") {
        URL = `https://utv.artsobservasjoner.no/a2m/#/report?meta=from%3Dorakel%7Cplatform%3D${
          window.cordova ? (device ? device.platform : "app") : "mobileweb"
        }%7Cpercentage%3D${Math.round(reportResult.probability * 100)}`;
      } else {
        URL = `https://mobil.artsobservasjoner.no/#/report?meta=from%3Dorakel%7Cplatform%3D${
          window.cordova ? (device ? device.platform : "app") : "mobileweb"
        }%7Cpercentage%3D${Math.round(reportResult.probability * 100)}`;
      }
    } else if (reportResult.taxon.scientificNameID) {
      URL = `https://${prefix}.artsobservasjoner.no/SubmitSighting/ReportByScientificName/${
        reportResult.taxon.scientificNameID
      }?meta=from%3Dorakel%7Cplatform%3Ddesktopweb%7Cpercentage%3D${Math.round(
        reportResult.probability * 100
      )}`;
    } else {
      URL = `https://${prefix}.artsobservasjoner.no/SubmitSighting/Report?meta=from%3Dorakel%7Cplatform%3Ddesktopweb%7Cpercentage%3D${Math.round(
        reportResult.probability * 100
      )}`;
    }

    window.open(URL, "_blank");
    setReportResult(false);
    setDialogOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
        destinationType: window.Camera.DestinationType.DATA_URL,
        sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: window.Camera.EncodingType.JPEG,
        mediaType: window.Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
        quality: 80,
      });

      function onSuccess(imageData) {
        setUncroppedImages([
          ...uncroppedImages,
          "data:image/jpeg;base64," + imageData,
        ]);
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
        setUncroppedImages([
          ...uncroppedImages,
          "data:image/jpeg;base64," + imageData,
        ]);
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
        if (predictions.length > 5) {
          predictions = predictions.slice(0, 5);
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
    <div className="App">
      <AppBar position="fixed" className="appBar">
        <div className="headerBar">
          <div className="headerLogo">
            <a href="//artsdatabanken.no">
              <img src="Artsdatabanken_long.svg" alt="Artsdatabanken" />
            </a>

            <div className="fabContainer">
              <div
                className="clickable"
                aria-label="Om appen"
                tabIndex="0"
                onClick={handleClickOpen}
              >
                Om
              </div>
            </div>
          </div>
        </div>
      </AppBar>

      <div className="Container">
        <input
          type="file"
          id="bigDropzone"
          onClick={preventClick}
          onChange={uploadMore.bind(this, "bigDropzone")}
        />
        <div className="images">
          {croppedImages.map((img, index) => (
            <UploadedImage img={img} key={index} delImage={delImage} />
          ))}
        </div>

        {!predictions.length &&
          !croppedImages.length &&
          !uncroppedImages.length && (
            <div className="hint">
              <div className="title">Artsorakel</div>

              <div className="body">
                Trykk på kamera-
                {window.cordova && " eller galleri-"}
                ikonet for å starte. Appen kan brukes på{" "}
                <span className="emphasis">viltlevende arter</span>.
              </div>
            </div>
          )}

        {loading && (
          <div className="buttonRow">
            <CircularProgress
              style={{ color: "#f57c00", width: 100, height: 100 }}
            />
          </div>
        )}

        {gotError === 503 && (
          <div className="hint">
            <div className="body emphasis">
              Artsorakelet opplever stor trafikk for tiden. Vennligst prøv
              igjen.
            </div>
          </div>
        )}

        {gotError && gotError !== 503 && (
          <div className="hint">
            <div className="body emphasis">
              Noe gikk galt, vennligst prøv igjen. Ta kontakt med{" "}
              <a href="mailto:support@artsobservasjoner.no">
                support@artsobservasjoner.no
              </a>{" "}
              hvis problemet vedvarer.
            </div>
          </div>
        )}

        {!!predictions.length && !uncroppedImages.length && (
          <div>
            <div className="hint">
              {predictions[0].probability > 0.5 ? (
                <div className="body">
                  Husk at resultatene er autogenererte, og kan være feil, også
                  når Artsorakelet oppgir høy treffprosent. Du må selv
                  kontrollere at artsbestemmelsen er riktig dersom du
                  rapporterer funn.
                </div>
              ) : (
                <div className="body emphasis">
                  Artsorakelet er for usikker på gjenkjenningen til å si hva
                  dette er. Du må selv kontrollere at artsbestemmelsen er riktig
                  dersom du rapporterer funn.
                </div>
              )}
            </div>

            {predictions[0].probability < 0.8 && (
              <div className="hint">
                <div className="body">
                  Prøv å legge til bilder med andre vinkler eller detaljer, og
                  zoom inn til (kun) arten du vil gjenkjenne.
                </div>
              </div>
            )}

            {predictions.map((prediction) => (
              <IdResult
                result={prediction}
                key={prediction.taxon.id}
                openDialog={openReportDialog}
              />
            ))}
          </div>
        )}

        {!!croppedImages.length && !loading && !uncroppedImages.length && (
          <div className="actionContainer">
            <div>
              <Button variant="contained" tabIndex="0">
                <AddAPhotoIcon />
              </Button>

              <p>Legg til bilde for sikrere identifikasjon</p>
              <input
                className="clickable"
                type="file"
                id="uploadMore"
                onChange={uploadMore.bind(this, "uploadMore")}
                onClick={useCamera ? openCamera : openGallery}
              />
            </div>
            <div onClick={resetImages}>
              <Button tabIndex="0" variant="contained">
                <ReplayIcon />
              </Button>
              <p>Identifiser noe annet</p>
            </div>
          </div>
        )}

        {!croppedImages.length && !uncroppedImages.length && (
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
        )}

        {window.cordova && !croppedImages.length && !uncroppedImages.length && (
          <div
            className=" bottomButton galleryButton clickable"
            onClick={openGallery}
            tabIndex="0"
          >
            <PhotoLibraryIcon style={{ fontSize: ".8em" }} />
          </div>
        )}

        {!predictions.length &&
          !!croppedImages.length &&
          !loading &&
          !uncroppedImages.length && (
            <div className="bottomButton identifyButton clickable">
              <Button
                variant="contained"
                style={{ backgroundColor: "#f57c00", color: "white" }}
                onClick={getId}
                tabIndex="0"
              >
                <ImageSearchIcon style={{ fontSize: "4em" }} />{" "}
                <span className="title">Identifiser</span>
              </Button>
            </div>
          )}
      </div>

      {!!uncroppedImages.length &&
        uncroppedImages.map((ucimg, index) => (
          <ImageCropper
            imgFile={ucimg}
            key={index}
            imageCropped={imageCropped}
            imgSize={500}
          />
        ))}

      <Dialog
        onClose={handleDialogClose}
        aria-labelledby="dialog-title"
        open={dialogOpen}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {"Har du bekreftet arten?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sjekk artsbestemmelsen selv før du rapporterer. Artsorakelet kan ta
            feil også ved høy treffprosent. Vil du fortsette?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Avbryt
          </Button>
          <Button onClick={reportAO} color="primary" autoFocus>
            Fortsett
          </Button>
        </DialogActions>
      </Dialog>
      
        <About modalOpen={modalOpen} handleModalClose={handleModalClose} />

    </div>
  );
}

export default withAITracking(reactPlugin, App);
