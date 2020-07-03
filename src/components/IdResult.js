import React from "react";
import "../App.css";
import Button from "@material-ui/core/Button";
import WarningIcon from "@material-ui/icons/Warning";
import { runningOnMobile } from "../utils/utils";

function IdResult({ result }) {
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
            className="donut-hole"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="#fff"
          ></circle>
          <circle
            className="donut-ring"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d2d3d4"
            strokeWidth="8"
          ></circle>

          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={strokes}
            strokeDashoffset="0"
          ></circle>
        </svg>
      </div>

      <div className="resultLabels">
        <a
          href={`https://artsdatabanken.no/Taxon/${result.taxon.name}/${result.taxon.scientificNameID}`}
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
        </a>
        <div className="percentage">
          <span className="number">({Math.round(percentage)} % treff)</span>
          {percentage > 0 && (
            <a
              href={
                runningOnMobile()
                  ? `https://mobil.artsobservasjoner.no/#/report`
                  : result.taxon.scientificNameID
                  ? `https://www.artsobservasjoner.no/SubmitSighting/ReportByScientificName/${result.taxon.scientificNameID}`
                  : `https://www.artsobservasjoner.no/SubmitSighting/Report`
              }
              target="_blank"
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
                Rapporter funn
              </Button>
            </a>
          )}
        </div>
        <div className="group">
          {result.taxon.groupName}{" "}
          {result.taxon.groupName === "Sopper" && (
            <span className="danger">
              <WarningIcon /> ALDRI SPIS NOE BASERT PÅ ARTSORAKELETS SVAR
            </span>
          )}
          {result.taxon.groupName === "Fisker" && (
            <span className="warning">
              (Orakelet er ikke flink på fisker pga lite treningsdata)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default IdResult;
