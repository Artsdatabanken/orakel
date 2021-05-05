import React, { useState } from "react";
import "../App.css";
import { runningOnMobile } from "../utils/utils";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

function ReportButton({ reportResult, croppedImages }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [encryptionData, setEncryptionData] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  let device = { platform: "app" };

  const openDialog = (e) => {
    if (!runningOnMobile()) {
      saveImages(croppedImages);
    } else {
      setDialogOpen(true);
    }
  };

  function makeURL() {
    let prefix =
      window.location.hostname === "orakel.test.artsdatabanken.no"
        ? "test"
        : "www";

    let probability = Math.round(reportResult.probability * 100);
    let percentage = `%7Cpercentage%3D${probability}`;
    let url = `https://${prefix}.artsobservasjoner.no/SubmitSighting/`;
    let from = "meta=from%3Dorakel%7C";
    let platform = `platform%3Ddesktopweb`;
    let reporttype = `Report?`;

    if (runningOnMobile()) {
      // TODO: Await update from artsobsmobile before update, to ensure we don't redirect user to nonexistent page
      platform = `platform%3D${
        window.cordova ? (device ? device.platform : "app") : "mobileweb"
      }`;
      reporttype = `?scientificname=${reportResult.taxon.scientificNameID}%26`;
      if (prefix === "test") {
        url = "https://utv.artsdatabanken.no/a2m/#/";
      } else if (window.location.hostname === "localhost") {
        // When testing with artsobs mobile, run artsobsmobile on localhost:3000
        // And run this on any other port. Artsobs mobile has issues when run on other ports.
        // url= 'http://localhost:3000/#/'
        url = "https://utv.artsdatabanken.no/a2m/#/";
      } else {
        url = "https://mobil.artsobservasjoner.no/#/";
      }
      // REDIRECT TO THIS ONE
      // url += "report";
      url += "orakel";
    } else if (reportResult.taxon.scientificNameID) {
      reporttype = `ReportByScientificName/${reportResult.taxon.scientificNameID}?`;
    }
    return url + reporttype + from + platform + percentage;
  }

  function saveImages(croppedImages) {
    setUploadingImages(true);
    // Only use if on mobile for now
    var formdata = new FormData();
    for (let image of croppedImages) {
      formdata.append("image", image);
    }
    let url = "https://ai.artsdatabanken.no";
    // url = "http://localhost:5000"; // For testing the ai server script locally
    axios
      .post(url + "/save", formdata)
      .then((res) => {
        setEncryptionData(res.data);
        setDialogOpen(true);
        setUploadingImages(false);
      })
      .catch((error) => {
        console.log("error");
      });
  }

  function redirectToArtsObs() {
    let url = makeURL(reportResult);
    if (encryptionData) {
      let id = encryptionData.id;
      let password = encryptionData.password;
      url += "&id=" + id + "&password=" + password;
    }
    window.open(url, "_blank");
    setDialogOpen(false);
  }

  return (
    <React.Fragment>
      <div className="btn primary" onClick={openDialog.bind(this)}>
        Rapporter funn
        {uploadingImages && <span className="littleSpinner"></span>}
      </div>

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

          <form action="" method="post" enctype="multipart/form-data"></form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Avbryt
          </Button>
          <Button
            onClick={(e) => {
              redirectToArtsObs();
            }}
            color="primary"
            autoFocus
          >
            Fortsett
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ReportButton;
