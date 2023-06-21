import React, { useState, useRef } from "react";
import { View, Animated, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

const vw = Dimensions.get('window').width;


function ResultGauge({ result, theme, ranking }) {
    const percentageWidthAnim = useRef(new Animated.Value(0)).current;
    const percentage = result.probability * 100;
    // =POWER(B2,1.75)*(100/POWER(100,1.75))*(A$2/100)
    let gaugeWidth = vw * .57
    let gaugeHeight = vw * .02

    const animatePercentage = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(percentageWidthAnim, {
            toValue: gaugeHeight / 1.5 + percentage ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100),
            duration: 300,
            delay: 400 + ranking * 200,
            useNativeDriver: false
        }).start();
    };


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



    // let xml = `<svg width="${gaugeWidth}" height="${gaugeHeight}" viewBox="0 0 ${gaugeWidth} ${gaugeHeight}">
    //     <rect x="0" y="0" width="${gaugeWidth}" height="${gaugeHeight}" rx="${gaugeHeight / 2}" ry="${gaugeHeight / 2}" fill="${color}" opacity="0.15" />
    //     <rect x="0" y="0" width="${gaugeHeight / 1.5 + percentage ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100)}" height="${gaugeHeight}" rx="${gaugeHeight / 2}" ry="${gaugeHeight / 2}" fill="${color}"/>`

    ticks = []

    for (let i = 10; i < 100; i = i + 10) {
        // xml = xml + `<rect x="${gaugeHeight / 2 + i ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100)}" y="0" width="${gaugeHeight / 3.5}" height="${gaugeHeight}" fill="${bg}"/>`
        ticks = ticks.concat([i])
    }

    // xml = xml + `</svg>`;

    animatePercentage();

    return (
        <>
            {/* <SvgXml style={{ height: 6, width: 5, marginBottom: 2 }} xml={xml} /> */}

            <View style={{
                width: gaugeWidth,
                height: gaugeHeight,
                backgroundColor: color,
                opacity: 0.15,
                borderRadius: gaugeHeight / 2,
            }} />



            <Animated.View style={{
                width: percentageWidthAnim,
                height: gaugeHeight,
                backgroundColor: color,
                borderRadius: gaugeHeight / 2,
                marginTop: - gaugeHeight
            }} />




            {ticks.map(t =>
                <View key={t} style={{
                    width: gaugeHeight / 4,
                    height: gaugeHeight,
                    backgroundColor: bg,
                    marginTop: - gaugeHeight,
                    marginLeft: gaugeHeight / 2 + t ** 1.75 * (100 / 100 ** 1.75) * ((gaugeWidth - gaugeHeight) / 100)
                }} />

            )}






        </>
    );
}



export default ResultGauge;
