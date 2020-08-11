import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";

import Button from "@material-ui/core/Button";
import WarningIcon from "@material-ui/icons/Warning";

function IdResult({ result, openDialog }) {
  const percentage = result.probability * 100;
  const strokes = percentage.toString() + " " + (100 - percentage).toString();

  const colors = [
    [170, 0, 0],
    [220, 214, 43],
    [76, 175, 80],
  ];

  const getColor = (percent) => {
    const colorIndex = (percent / 100.0) * (colors.length - 1);
    const lowFactor = 1 - (colorIndex % 1);
    const lowIndex = Math.floor(colorIndex);
    const highIndex = Math.min(lowIndex + 1, colors.length - 1);

    const r =
      colors[lowIndex][0] * lowFactor + colors[highIndex][0] * (1 - lowFactor);
    const g =
      colors[lowIndex][1] * lowFactor + colors[highIndex][1] * (1 - lowFactor);
    const b =
      colors[lowIndex][2] * lowFactor + colors[highIndex][2] * (1 - lowFactor);

    return `rgb(${r},${g},${b})`;
  };

  let color = getColor(percentage);

  return (
    <div className="resultRow">
      <div className="resultDonut">
        <svg width="100%" height="100%" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d2d3d4"
            strokeWidth="6"
          ></circle>

          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={strokes}
            strokeDashoffset="0"
          ></circle>
        </svg>
      </div>

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
        <div className="percentage">
          <span className="number">({Math.round(percentage)} % treff)</span>
        </div>
        <div className="group">
          {result.taxon.groupName}{" "}
          {result.taxon.groupName === "Sopper" && (
            <span className="danger">
              <WarningIcon /> ALDRI SPIS NOE BASERT PÅ ARTSORAKELETS SVAR
            </span>
          )}
        </div>
        <div className="actions">
          <a
            href={result.taxon.infoUrl}
            target={"_blank"}
            onClick={
              result.taxon.scientificNameID
                ? () => {
                    return;
                  }
                : (e) => {
                    e.preventDefault();
                  }
            }
            rel="noopener noreferrer"
          >
            <Button
              style={{
                fontSize: "9px",
                lineHeight: "10px",
              }}
              variant="contained"
              color="primary"
            >
              Les mer
            </Button>
          </a>

          <ReportButton reportResult={result} />
        </div>
      </div>
    </div>
  );
}

export default IdResult;
