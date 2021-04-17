import React from "react";
import "../App.css";

function UserFeedback({
  predictions,
  croppedImages,
  uncroppedImages,
  gotError,
}) {
  return (
    <React.Fragment>
      {!predictions.length && (
        <div className="manual">
          <div className="manual-item">
            <div className="manual-item-number">1.</div>
            <div className="manual-item-text">
              Ta eller velg et bilde av en art i norsk natur
            </div>
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3,13A9,9 0 0,0 12,22A9,9 0 0,0 3,13M12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,22M18,3V8A6,6 0 0,1 12,14A6,6 0 0,1 6,8V3C6.74,3 7.47,3.12 8.16,3.39C8.71,3.62 9.2,3.96 9.61,4.39L12,2L14.39,4.39C14.8,3.96 15.29,3.62 15.84,3.39C16.53,3.12 17.26,3 18,3Z"
              />
            </svg>
          </div>

          <div className="manual-item">
            <div className="manual-item-number">2.</div>
            <div className="manual-item-text">Zoom inn til motivet </div>
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,3H15V5H19V9H21V5C21,3.89 20.1,3 19,3M19,19H15V21H19A2,2 0 0,0 21,19V15H19M5,15H3V19A2,2 0 0,0 5,21H9V19H5M3,5V9H5V5H9V3H5A2,2 0 0,0 3,5Z"
              />
            </svg>
          </div>

          <div className="manual-item">
            <div className="manual-item-number">3.</div>
            <div className="manual-item-text">
              Gjenta for sikrere identifisering
            </div>
            <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z" />
</svg>
          </div>

          <div className="manual-item">
            <div className="manual-item-number">4.</div>
            <div className="manual-item-text">
              Trykk “identifiser” for å se hva det kan være!
            </div>
            <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M22,13A3,3 0 0,0 19,10H17.5V9.5A5.5,5.5 0 0,0 12,4C9.5,4 7.37,5.69 6.71,8H6A4,4 0 0,0 2,12A4,4 0 0,0 6,16H9V16.5C9,17 9.06,17.5 9.17,18H6A6,6 0 0,1 0,12C0,8.9 2.34,6.36 5.35,6.04C6.6,3.64 9.11,2 12,2C15.64,2 18.67,4.59 19.36,8.04C21.95,8.22 24,10.36 24,13C24,14.65 23.21,16.1 22,17V16.5C22,15.77 21.88,15.06 21.65,14.4C21.87,14 22,13.5 22,13Z" />
</svg>
          </div>
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
