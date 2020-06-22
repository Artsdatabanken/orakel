import React from "react";
import "../App.css";

function IdResult({ result }) {
  const percentage = result.probability * 100;
  const strokes = percentage.toString() + " " + (100 - percentage).toString();

  let color;

  if (percentage > 80) {
    color = "#4caf50";
  } else if (percentage > 50) {
    color = "#ff9800";
  } else {
    color = "#dc004e";
  }

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
        <div className="vernacular">
          {result.taxon.vernacularName.charAt(0).toUpperCase() +
            result.taxon.vernacularName.slice(1)}
        </div>
        <div className="scientific">{result.taxon.name}</div>
        <div className="percentage">({Math.round(percentage)} % konfidens)</div>
        <div className="group">{result.taxon.groupName}</div>
      </div>
    </div>
  );
}

export default IdResult;
