import React, { useState } from "react";
import "../App.css";
import { runningOnMobile } from "../utils/utils";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

function ReportButton({ reportResult }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  let device = { platform: "app" };

  const reportAO = () => {
    var URL;

    const prefix =
      window.location.hostname === "orakel.test.artsdatabanken.no"
        ? "test"
        : "www";

    if (runningOnMobile()) {
      if (prefix === "test") {
        URL = `https://utv.artsdatabanken.no/a2m/#/report?scientificname=${reportResult.taxon.scientificNameID}%26meta=from%3Dorakel%7Cplatform%3D${
          window.cordova ? (device ? device.platform : "app") : "mobileweb"
        }%7Cpercentage%3D${Math.round(reportResult.probability * 100)}`;
      } else {
        URL = `https://mobil.artsobservasjoner.no/#/report?scientificname=${reportResult.taxon.scientificNameID}%26meta=from%3Dorakel%7Cplatform%3D${
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
    setDialogOpen(false);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  return (
    <React.Fragment>
      {" "}
      <Button
        style={{
          fontSize: "9px",
          lineHeight: "10px",
        }}
        variant="contained"
        color="primary"
        onClick={openDialog.bind(this)}
      >
        Rapporter funn
      </Button>
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
    </React.Fragment>
  );
}

export default ReportButton;
