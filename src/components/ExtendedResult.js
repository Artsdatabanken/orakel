import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import WarningIcon from "@material-ui/icons/Warning";

function ExtendedResult({ result, croppedImages, preventClick }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <React.Fragment>
      <div
        className="resultLabels"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={
            result.taxon.vernacularName.toLowerCase() ===
            result.taxon.name.toLowerCase()
              ? "hyphenate vernacular italics"
              : "hyphenate vernacular"
          }
        >
          {result.taxon.vernacularName.charAt(0).toUpperCase()}
          &#8203;
          {result.taxon.vernacularName.slice(1)}
        </div>
        <div className="scientific hyphenate">
          {result.taxon.name.charAt(0)}
          &#8203;
          {result.taxon.name.slice(1)}
        </div>
      </div>

      <div className="resultDescription">
        Artsorakelet gir {percentage} % treff for{" "}
        <span
          className={
            result.taxon.vernacularName.toLowerCase() ===
            result.taxon.name.toLowerCase()
              ? "italics"
              : ""
          }
        >
          {result.taxon.vernacularName}
        </span>{" "}
        basert på {n_pics === 1 ? "bildet ditt" : "dine " + n_pics + " bilder"}.
        Det er ikke sagt at det stemmer, du må selv kontrollere at det er
        riktig, særlig hvis du skal rapportere funnet.
        {result.taxon.groupName === "Sopper" && (
          <div className="danger">
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
