import React from "react";
import "../App.css";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function About({ handleModalClose, modalOpen }) {
  return (
    <Dialog
      onClose={handleModalClose}
      aria-labelledby="dialog-title"
      open={modalOpen}
      fullWidth={true}
    >
      <DialogTitle id="simple-dialog-title">
        Om Artsorakelet
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          style={{ right: "15px", top: "0", position: "absolute" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialogContent">
        <p className="emphasis">
          Artsdatabankens Artsorakel prøver å artsbestemme bilder ved hjelp av
          maskinlæring. Artsorakelet kjenner kun viltlevende arter (ingen
          husdyr, hageplanter, osv.) og gir svar på artsnivå (og noen
          underarter).
        </p>

        <p className="quote">
          I likhet med andre orakler kan svaret være en åpenbaring, men det er
          alltid en sjanse for at svaret er feil, uklart, flertydig og/eller
          krever tolkning.
        </p>

        <p>
          Selv om svaret angis med høy treffprosent betyr det ikke at svaret
          nødvendigvis er riktig. Det er ikke like flink på arter der det er få
          bilder tilgjengelig på Artsobservasjoner, som:
        </p>
        <ul>
          <li>Store rovdyr og andre arter som er unntatt offentlighet</li>
          <li>Fisk</li>
          <li>
            Arter som er vanskelig å fotografere og/eller artsbestemme fra
            bilder
          </li>
        </ul>
        <p>
          Sjekk derfor alltid med relevant litteratur, for eksempel våre
          ekspertskrevne artsbeskrivelser og nøkler i{" "}
          <a href="https://www.artsdatabanken.no/arter-pa-nett">
            Arter på nett
          </a>
          .
        </p>

        <p className="quote">
          NB: Bruk aldri Artsorakelet til å vurdere om en art er spiselig eller
          giftig!
        </p>

        <p>
          Hvis du med stor sikkerhet vet hvilken art det er, vil vi gjerne at du
          rapporterer observasjonen i{" "}
          <a href="https://www.artsobservasjoner.no/">Artsobservasjoner.no</a>{" "}
          ved å trykke på "rapporter funn"-knappen . Slik hjelper du forskere og
          naturforvaltere. Hvis du laster opp bildene der kan de i tillegg
          brukes til å forbedre neste versjon av Artsorakelet.
        </p>

        {window.cordova && (
          <p>
            Artsorakelet er også tilgjengelig som nettversjon for pc og mobil på{" "}
            <a href="https://orakel.artsdatabanken.no">
              orakel.artsdatabanken.no
            </a>
            .
          </p>
        )}

        {!window.cordova && (
          <p>
            Artsorakelet er også tilgjengelig som Android og iOS app.
            <br />
            <a href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel">
              <img
                src="Google_Play_badge.png"
                alt="Tilgjengelig på Google Play"
                className="appStoreBadge"
              />
            </a>
            <a href="https://apps.apple.com/no/app/id1522271415">
              <img
                src="app_store_badge.png"
                alt="Last ned fra App Store"
                className="appStoreBadge"
              />
            </a>
          </p>
        )}

        <p>
          Du kan lese mer om Artsorakelet på{" "}
          <a href="https://www.artsdatabanken.no/Pages/299643">
            Artsdatabankens nettsider
          </a>
          . Spørsmål og tilbakemelding kan sendes til{" "}
          <a href="mailto:support@artsobservasjoner.no">
            support@artsobservasjoner.no
          </a>
          .
        </p>

        <p>
          <img
            src="Artsdatabanken_high.svg"
            alt="Artsdatabanken"
            className="aboutLogo"
          />
          <img src="Naturalis.svg" className="aboutLogo" alt="Naturalis" />
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default About;
