import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";

import "./App.css";
import ImageAdder from "./components/ImageAdder";
import Image from "./components/Image";
import IdResult from "./components/IdResult";
import ImageCropper from "./components/ImageCropper";

function App() {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getId = () => {
    setLoading(true);

    var formdata = new FormData();
    for (let image of croppedImages) {
      formdata.append("image", image);
    }

    axios
      .post("//ai.artsdatabanken.no/", formdata)
      .then((res) => {
        setPredictions(
          res.data.predictions.filter((pred) => pred.probability > 0.01)
        );
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="App">
      <div className="Container">
        <div className="images">
          {croppedImages.map((img, index) => (
            <Image img={img} key={index} delImage={delImage} />
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
              <Button variant="contained" className="resultRow" onClick={getId}>
                <CloudUploadIcon style={{ fontSize: "4em" }} />
                <span className="title">Identifiser</span>
              </Button>
            </div>
          )
        ) : (
          <div>
            <div className="resultRow">
              <span className="body">
                Husk at resultatene er autogenerert, og kan være feil (også når
                auto-id oppgir høy sikkerhet).
              </span>
            </div>
            {predictions.map((prediction) => (
              <IdResult result={prediction} key={prediction.taxon.id} />
            ))}
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
    </div>
  );
}

export default App;
