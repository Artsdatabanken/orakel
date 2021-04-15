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
      {!predictions.length && (
        <div className="hint">
          Her kommer hintene
        </div>
      )}

      {loading && (
        <div>
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
    </React.Fragment>
  );
}

export default UserFeedback;
