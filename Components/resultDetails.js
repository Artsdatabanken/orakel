import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Linking } from 'react-native';
import ReportButton from "./reportButton";

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;



function ResultDetails({ result, croppedImages, theme}) {
    const percentage = result.probability * 100;

    return (
        <View style={styles.result}
        >
            <View style={styles.resultText}>
                <Text style={[styles.vernacularName, theme.styles.content]}>
                    {result.taxon.vernacularName.charAt(0).toUpperCase() + result.taxon.vernacularName.slice(1)}</Text>
                <Text style={[styles.scientific, theme.styles.content]}>
                    {result.taxon.name.charAt(0)}
                    &#8288;
                    {result.taxon.name.slice(1)}</Text>
                <Text style={[styles.groupName, theme.styles.content]}>{result.taxon.groupName}</Text>
                {result.taxon.groupName === "Sopper" && (
                    <Text style={[theme.styles.content_warning]}>ALDRI SPIS NOE PGA APPEN</Text>
                )}
            </View>

            <Text style={[styles.infoText, theme.styles.content]}>
                Artsorakelet gir {Math.round(percentage)} % treff for {result.taxon.vernacularName} basert
                på {croppedImages.length > 1 ? "bildene dine" : "bildet ditt"}. Det er ikke sagt at det stemmer, du må selv kontrollere at det er riktig,
                særlig hvis du skal rapportere funnet.
            </Text>

            <View style={styles.actionButtons}>
                <Pressable
                    style={[styles.button, theme.styles.button]}
                    onPress={ ()=>{ Linking.openURL(result.taxon.infoUrl)}}
                    >
                    <Text style={[styles.buttonText, theme.styles.button]}>Om arten</Text>
                </Pressable>


                <ReportButton croppedImages={croppedImages} reportResult={result} styles={styles} theme={theme}/>
{/* 
                <Pressable
                    style={styles.idButton}>
                    <Text style={styles.idButtonText}>Rapporter funn</Text>
                </Pressable> */}




            </View>



        </View>
    );
}



const styles = StyleSheet.create({
    resultText: {
        flexGrow: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: .02 * vh,
        marginVertical: .02 * vh,
    },

    vernacularName: {
        fontSize: .075 * vw,
    },

    scientific: {
        fontSize: .05 * vw,
        fontStyle: "italic"
    },

    groupName: {
        fontVariant: ['small-caps'],
        fontStyle: "normal"

    },

    result: {
        flexDirection: "column",
        flex: 1,
        paddingHorizontal: .06 *vw,
        paddingBottom: .06 * vw,
    },

    infoText: {
        fontSize: .04 * vw,
        flexGrow: 1,
    },

    actionButtons: {
        flexDirection: "row",
        flexGrow: 0,
        justifyContent: "space-around",
    },

    button: {
        height: .10 * vw,
        width: .37 * vw,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 2.5,
        borderColor: "#fff",
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },

    buttonText: {
        fontSize: .04 * vw
    },

}
)

export default ResultDetails;
