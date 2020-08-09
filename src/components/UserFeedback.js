import React from "react";
import "../App.css";
import CircularProgress from "@material-ui/core/CircularProgress";

function UserFeedback({
  predictions,
  croppedImages,
  uncroppedImages,
  loading,
  gotError,
}) {
  return (
    <React.Fragment>
      {!predictions.length && !croppedImages.length && !uncroppedImages.length && (
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
            Artsorakelet opplever stor trafikk for tiden. Vennligst prøv igjen.
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
                Husk at resultatene er autogenererte, og kan være feil, også når
                Artsorakelet oppgir høy treffprosent. Du må selv kontrollere at
                artsbestemmelsen er riktig dersom du rapporterer funn.
              </div>
            ) : (
              <div className="body emphasis">
                Artsorakelet er for usikker på gjenkjenningen til å si hva dette
                er. Du må selv kontrollere at artsbestemmelsen er riktig dersom
                du rapporterer funn.
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
        </div>
      )}
    </React.Fragment>
  );
}

export default UserFeedback;
