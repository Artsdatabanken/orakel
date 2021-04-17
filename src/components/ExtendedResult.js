import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import Button from "@material-ui/core/Button";
import WarningIcon from "@material-ui/icons/Warning";

function ExtendedResult({ result, croppedImages }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <React.Fragment>
      <div className="resultLabels">
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
      <div className="resultDescription">
        Artsorakelet gir {percentage} % treff for {result.taxon.vernacularName}{" "}
        basert på {n_pics == 1 ? "ditt bilde" : "dine " + n_pics + " bilder"}.
        Det er ikke sagt at det stemmer, du må selv kontrollere at det er
        riktig, særlig hvis du skal rapportere funnet.
      </div>
      <div className="resultActions">
        <div className="btn">Om arten</div>
        <ReportButton reportResult={result} croppedImages={croppedImages} />
      </div>
    </React.Fragment>
  );
}

export default ExtendedResult;
