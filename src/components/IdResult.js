import React from "react";
import "../App.css";

function IdResult({ result, openResult, croppedImages }) {
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
  const openResultModal = () => {
    openResult(result);
  }

  return (
    <div className="resultRow" onClick={openResultModal}>
      <div className="resultDonut">
        <svg width="100%" height="100%" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d2d3d4"
            strokeWidth="7"
          ></circle>

          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={strokes}
            strokeDashoffset="20"
          ></circle>
        </svg>
        <div className="percentage">{Math.round(percentage)}%</div>
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
        <div className="group">{result.taxon.groupName}</div>
        {result.taxon.groupName === "Sopper" && (
          <div className="danger">
            ALDRI SPIS NOE PGA APPEN
          </div>
        )}
      </div>

      <div className="chevron-right">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          />
        </svg>
      </div>
    </div>
  );
}

export default IdResult;
