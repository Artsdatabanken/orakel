import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

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

        return `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`;
    };

    let color = getColor(percentage);

    const xml = `<svg width="100%" height="100%" viewBox="0 0 42 42">
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
      stroke="${color}"
      strokeWidth="7"
      strokeDasharray="${strokes}"
      strokeDashoffset="20"
    ></circle>


    <text
    y="25"
    x="22"
  style="font-size:10;text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;">${Math.round(percentage)}%</text>




  </svg>`;


    const openResultModal = () => {
        openResult(result);
    };

    return (
        <View style={styles.result}>
            <SvgXml xml={xml} width="70" height="70" />
            <View style={styles.resultText}>
                <Text style={styles.vernacularName}>
                    {result.taxon.vernacularName.charAt(0).toUpperCase()}
                    &#8288;
                    {result.taxon.vernacularName.slice(1)}</Text>
                <Text style={styles.scientific}>
                    {result.taxon.name.charAt(0)}
                    &#8288;
                    {result.taxon.name.slice(1)}</Text>
                <Text style={styles.groupName}>{result.taxon.groupName}</Text>
                {result.taxon.groupName === "Sopper" && (
                    <Text >ALDRI SPIS NOE PGA APPEN</Text>
                )}
            </View>

            <SvgXml style={styles.chevron} xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>`} />



        </View>
    );
}



const styles = StyleSheet.create({
    resultText: {
        paddingLeft: .055 * vw,
        flexGrow: 1
    },

    vernacularName: {
        fontSize: .065 * vw,
    },

    scientific: {
        fontSize: .04 * vw,
        fontStyle: "italic"
    },

    groupName: {
        fontVariant: [ 'small-caps' ],
        fontStyle: "normal"

    },

    result: {
        paddingVertical: .02 * vh,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },

    chevron: {
        color: "#ccc",
        width: 60,
        height: 60,
        flexGrow: 0
    }

}
)

export default IdResult;
