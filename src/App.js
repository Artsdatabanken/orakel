import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import "./App.css";
import ImageAdder from "./components/ImageAdder";
import Image from "./components/Image";
import IdResult from "./components/IdResult";
import ImageCropper from "./components/ImageCropper";
import ReplayIcon from "@material-ui/icons/Replay";

function App() {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const addImage = (img) => {
    for (let i of img) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          // convert image file to base64 string
          setUncroppedImages([...uncroppedImages, reader.result]);
        },
        false
      );
      reader.readAsDataURL(i);
    }
  };

  const imageCropped = (img) => {
    img.lastModifiedDate = new Date();
    img.name = new Date() + ".png";
    setUncroppedImages([]);
    setCroppedImages([...croppedImages, img]);
    setPredictions([]);
  };

  const delImage = (name) => {
    setCroppedImages(croppedImages.filter((i) => i.name !== name));
    setPredictions([]);
  };

  const resetImages = () => {
    setCroppedImages([]);
    setPredictions([]);
  }

  const handleClickOpen = () => {
    setModalOpen(true);
    console.log("open");
  };

  const handleClose = () => {
    setModalOpen(false);
    console.log("close");
  };

  const getId = () => {
    setLoading(true);

    var formdata = new FormData();
    for (let image of croppedImages) {
      formdata.append("image", image);
    }

    axios
      .post("//ai.artsdatabanken.no/", formdata)
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
        console.log("error", error);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <div className="Container">
        <div className="images">
          {croppedImages.map((img, index) => (
            <Image img={img} key={index} delImage={delImage} />
          ))}
          <ImageAdder addImage={addImage} />
{ !!croppedImages.length &&
          <div className="gridElement Reset" onClick={resetImages}>
            <ReplayIcon style={{ fontSize: ".8em" }} />
          </div>
          }
        </div>

        {!predictions.length ? (
          !croppedImages.length ? (
            <div className="resultRow">
              <span className="body">
                Trykk på kamera-ikonet for å laste opp et bilde som du ønsker å
                artsbestemme. Det hjelper ofte å laste opp flere bilder fra
                forskjellige vinkler.
              </span>
            </div>
          ) : loading ? (
            <div className="buttonRow">
              <CircularProgress
                style={{ color: "#f57c00", width: 100, height: 100 }}
              />
            </div>
          ) : (
            <div className="buttonRow">
              <Button variant="contained" className="resultRow" onClick={getId}>
                <CloudUploadIcon style={{ fontSize: "4em" }} />
                <span className="title">Identifiser</span>
              </Button>
            </div>
          )
        ) : (
          <div>
            <div className="resultRow">
              {predictions[0].probability > 0.5 ? (
                <span className="body">
                  Husk at resultatene er autogenerert, og kan være feil (også
                  når orakelet oppgir høy sikkerhet).
                </span>
              ) : (
                <span className="body">
                  Orakelet er for usikker på gjenkjenningen til å si hva dette
                  er.
                </span>
              )}
            </div>

            {predictions[0].probability < 0.8 && (
              <div className="resultRow">
                <span className="body">
                  Det kan hjelpe å legge til flere bilder med ulike vinkler
                  eller detaljer. Zoom også inn til arten du vil gjenkjenne, når
                  det er flere arter kan resultatet gjenspeile det.
                </span>
              </div>
            )}

            {predictions.map((prediction) => (
              <IdResult result={prediction} key={prediction.taxon.id} />
            ))}
          </div>
        )}

        <div className="fabContainer">
          <Fab
            style={{ backgroundColor: "#f57c00", color: "white" }}
            aria-label="Om appen"
            onClick={handleClickOpen}
          >
            ?
          </Fab>
        </div>
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
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={modalOpen}
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">Om orakelet</DialogTitle>
        <DialogContent className="dialogContent">
          <p>
            Orakelet er Artsdatabankens app som prøver å artsbestemme bilder ved
            hjelp av maskinlæring. Det er trent ved hjelp av bilder fra{" "}
            <a href="https://www.artsobservasjoner.no/">Artsobservasjoner.no</a>
            , og utviklet i samarbeid med{" "}
            <a href="https://www.naturalis.nl/en">
              Naturalis Biodiversity Center
            </a>
            .
          </p>

          <p>
            Last opp ett eller flere bilder ved å trykke på kamera-ikonet og
            zoome inn på arten. Klikk deretter på "Identifiser" for å se hva
            modellen tror det ser ut som.
          </p>

          <p className="quote">
            I likhet med andre orakler kan svaret være en åpenbaring, men er det
            alltid en sjanse for at svaret er feil, uklart, flertydig og/eller
            krever tolkning.
          </p>

          <p>
            Resultatene er autogenerert, og selv om konfidensen er høy betyr det
            ikke at svaret er riktig. Sjekk derfor alltid med relevant
            litteratur, for eksempel våre ekspertskrevne artsbeskrivelser og
            nøkler på{" "}
            <a href="https://www.artsdatabanken.no/arter-pa-nett">
              Arter på nett
            </a>
            . Hvis du har bekreftet hvilken art det er, må du gjerne rapportere
            observasjonen på{" "}
            <a href="https://www.artsobservasjoner.no/">Artsobservasjoner.no</a>
            . Slik hjelper du forskere og forvaltere med din observasjon. I
            tillegg kan bildene brukes til å forbedre neste versjon av denne
            appen.
          </p>

          <p>
            Bilder som blir lastet opp blir ikke lagret. Både appen og tjenesten
            bak er åpen og gratis. Ta kontakt hvis du ønsker å bruke tjenesten i
            din applikasjon eller nettside.
          </p>

          <p>
            <img
              src="Artsdatabanken.png"
              alt="Artsdatabanken"
              className="aboutLogo"
            />
            <img src="Naturalis.svg" className="aboutLogo" alt="Naturalis" />
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
