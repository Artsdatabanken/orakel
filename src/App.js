import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import "./App.css";
import ImageAdder from "./components/ImageAdder";
import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import ImageCropper from "./components/ImageCropper";

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
  };

  const resetImages = () => {
    setCroppedImages([]);
    setPredictions([]);
  };

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
      <div className="headerBar">
        <div className="headerLogo">
          <a href="//artsdatabanken.no">
            <img src="headerlogo.png" alt="Artsdatabanken" />
          </a>

          <div className="fabContainer">
            <div
              className="clickable"
              aria-label="Start på nytt"
              tabIndex="0"
              onClick={resetImages}
            >
              Restart
            </div>

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

      <div className="Container">
        <div className="images">
          {croppedImages.map((img, index) => (
            <UploadedImage img={img} key={index} delImage={delImage} />
          ))}
          <ImageAdder addImage={addImage} />
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
              <Button
                variant="contained"
                className="resultRow"
                style={{ backgroundColor: "#f57c00", color: "white" }}
                onClick={getId}
                tabIndex="0"
              >
                <ImageSearchIcon style={{ fontSize: "4em" }} />
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
                  når artsorakelet oppgir høy sikkerhet).
                </span>
              ) : (
                <span className="body">
                  Artsorakelet er for usikker på gjenkjenningen til å si hva
                  dette er.
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

        <img src="beta.svg" alt="beta" className="betaRibbon" />
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
        <DialogTitle id="simple-dialog-title">
          Om artsorakelet (beta v0.1)
        </DialogTitle>
        <DialogContent className="dialogContent">
          <p>
            Artsdatabankens Artsorakel prøver å artsbestemme bilder ved hjelp av
            maskinlæring. Appen er i beta og trenes ved hjelp av bilder fra{" "}
            <a href="https://www.artsobservasjoner.no/">Artsobservasjoner.no</a>
            , og utviklet i samarbeid med{" "}
            <a href="https://www.naturalis.nl/en">
              Naturalis Biodiversity Center
            </a>
            . Jo flere bilder av hver art appen får se, jo bedre blir den til å
            artsbestemme. Den vil derfor gradvis bli mer treffsikker over tid,
            etter hvert som den blir trent på flere og flere bilder.
          </p>

          <p>
            Last opp ett eller flere bilder ved å trykke på kamera-ikonet og
            zoome inn på arten. Klikk deretter på "Identifiser" for å se hva
            modellen tror det ser ut som. Artsorakelet gir kun svar på artsnivå
            (ikke underarter eller høyere taksa).
          </p>

          <p className="quote">
            I likhet med andre orakler kan svaret være en åpenbaring, men det er
            alltid en sjanse for at svaret er feil, uklart, flertydig og/eller
            krever tolkning.
          </p>

          <p>
            Resultatene er autogenererte, og selv om svaret angis med høy
            konfidens (høy prosent) betyr det ikke at svaret nødvendigvis er
            riktig. Sjekk derfor alltid med relevant litteratur, for eksempel
            våre ekspertskrevne artsbeskrivelser og nøkler i{" "}
            <a href="https://www.artsdatabanken.no/arter-pa-nett">
              Arter på nett
            </a>
            .
          </p>

          <p className="quote">
            NB: Bruk aldri artsorakelet til å vurdere om en art er spiselig
            eller giftig!
          </p>

          <p>
            Hvis du med stor sikkerhet vet hvilken art det er, vil vi gjerne at
            du rapporterer observasjonen i{" "}
            <a href="https://www.artsobservasjoner.no/">Artsobservasjoner.no</a>
            . Slik hjelper du forskere og naturforvaltere. I tillegg kan bildene
            brukes til å forbedre neste versjon av denne appen.
          </p>

          <p>
            Bilder som lastes opp blir ikke lagret på serveren. Både appen og
            tjenesten bak er åpen og gratis. Ta kontakt hvis du ønsker å bruke
            tjenesten i din applikasjon eller nettside.
          </p>

          <p>
            Spørsmål og tilbakemelding kan sendes til{" "}
            <a href="mailto:support@artsobservasjoner.no">
              support@artsobservasjoner.no
            </a>
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
