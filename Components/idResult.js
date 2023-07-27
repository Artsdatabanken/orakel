import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ResultGauge from "./resultGauge";
import TaxonImage from "./taxonImage";

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function IdResult({ result, openResult, theme, ranking }) {

    const openResultModal = () => {
        openResult(result);
    };

    return (
        <Pressable style={styles.result}
            onPress={() => openResultModal()}
        >
            <TaxonImage result={result} fullWidth={false} style={[styles.resultStats, theme.styles.content]}  />
            {/* <SvgXml xml={xml} style={[styles.resultStats, theme.styles.content]} width={vw * .18} height={vw * .18} /> */}
            <View style={[styles.resultText]}>
                <Text style={[styles.vernacularName, theme.styles.content]}>
                    {result.taxon.vernacularName.charAt(0).toUpperCase()}
                    &#8288;
                    {result.taxon.vernacularName.slice(1)}</Text>
                <Text style={[styles.scientific, theme.styles.content]}>
                    {result.taxon.name.charAt(0)}
                    &#8288;
                    {result.taxon.name.slice(1)}</Text>
                <Text style={[styles.groupName, theme.styles.content]}>{result.taxon.groupName}</Text>
                {result.taxon.groupName === "Sopper" && (
                    <Text style={[styles.warning, theme.styles.content_warning]}>ALDRI SPIS NOE PGA APPEN</Text>
                )}
                <ResultGauge result={result} theme={theme} ranking={ranking} />

            </View>

            <SvgXml style={[styles.chevron, theme.styles.content]} xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>`} />



        </Pressable>
    );
}



const styles = StyleSheet.create({

    resultStats: {
        maxWidth: vw * .18,
        flexGrow: 0,
        flexShrink: 0,
    },

    resultText: {
        paddingLeft: .05 * vw,
        flexGrow: 1,
        maxWidth: vw - 120,
    },

    vernacularName: {
        fontSize: .05 * vw,
    },

    scientific: {
        fontSize: .035 * vw,
        fontStyle: "italic",
    },

    groupName: {
        fontVariant: ['small-caps'],
        fontStyle: "normal",
    },

    result: {
        paddingVertical: .02 * vh,
        marginVertical:  .01 * vh,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },

    chevron: {
        width: vw * .12,
        height: vw * .12,
        flexGrow: 0,
        flexShrink: 0,
        opacity: .25
    },

    warning: {
        paddingHorizontal: .03 * vw,
        paddingVertical: 1,
        marginVertical: .02 * vw,
    }

}
)

export default IdResult;
