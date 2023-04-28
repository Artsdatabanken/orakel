import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

const vw = Dimensions.get('window').width;


function ResultGauge({ result, theme }) {
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
    let bg = theme.styles.content.backgroundColor

    // =POWER(B2,1.75)*(100/POWER(100,1.75))*(A$2/100)
    let gaugeWidth = vw * .57
    let gaugeHeight = vw * .02

    let ticks = [
        gaugeHeight / 2 + 10 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 20 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 30 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 40 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 50 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 60 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 70 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 80 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
        gaugeHeight / 2 + 90 ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
    ]

    let xml = `<svg width="${gaugeWidth}" height="${gaugeHeight}" viewBox="0 0 ${gaugeWidth} ${gaugeHeight}">
        <rect x="0" y="0" width="${gaugeWidth}" height="${gaugeHeight}" rx="${gaugeHeight / 2}" ry="${gaugeHeight / 2}" fill="${color}" opacity="0.15" />
        <rect x="0" y="0" width="${gaugeHeight / 1.5 + percentage ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100)}" height="${gaugeHeight}" rx="${gaugeHeight / 2}" ry="${gaugeHeight / 2}" fill="${color}"/>`

    for (let i = 10; i < 100; i = i + 10) {
        xml = xml + `<rect x="${gaugeHeight / 2 + i ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100)}" y="0" width="${gaugeHeight / 3.5}" height="${gaugeHeight}" fill="${bg}"/>`
    }

    xml = xml + `</svg>`;


    return (
        <SvgXml style={{ height: 6, width: 50 }} xml={xml} />
    );
}



export default ResultGauge;
