import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import WarningIcon from "@material-ui/icons/Warning";

function ExtendedResult({ result, croppedImages, preventClick }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <React.Fragment>
      <div className="resultLabels" onClick={preventClick}>
        <div
          className={
            result.taxon.vernacularName.toLowerCase() ===
            result.taxon.name.toLowerCase()
              ? "vernacular italics"
              : "vernacular"
          }
        >
          {result.taxon.vernacularName.charAt(0).toUpperCase() +
            result.taxon.vernacularName.slice(1)}
        </div>
        <div className="scientific">{result.taxon.name}</div>
      </div>

      <div className="resultDescription" onClick={preventClick}>
        Artsorakelet gir {percentage} % treff for {result.taxon.vernacularName}{" "}
        basert på {n_pics === 1 ? "ditt bilde" : "dine " + n_pics + " bilder"}.
        Det er ikke sagt at det stemmer, du må selv kontrollere at det er
        riktig, særlig hvis du skal rapportere funnet.
        {result.taxon.groupName === "Sopper" && (
          <div className="danger" onClick={preventClick}>
            <WarningIcon /> ALDRI SPIS NOE BASERT PÅ ARTSORAKELETS SVAR
          </div>
        )}
      </div>
      <div className="resultActions">
        <a
          href={result.taxon.infoUrl}
          target={"_blank"}
          rel="noopener noreferrer"
          className="btn primary"
        >
          Om arten
        </a>
        <ReportButton
          reportResult={result}
          croppedImages={croppedImages}
          preventClick={preventClick}
        />
      </div>
    </React.Fragment>
  );
}

export default ExtendedResult;
