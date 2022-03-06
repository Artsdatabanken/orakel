import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;



function ModalResult({ result, openResult, croppedImages }) {
    const percentage = result.probability * 100;

    const openResultModal = () => {
        openResult(result);
    };

    return (
        <View style={styles.result}
        >
            <View style={styles.resultText}>
                <Text style={styles.vernacularName}>
                    {result.taxon.vernacularName.charAt(0).toUpperCase() + result.taxon.vernacularName.slice(1)}</Text>
                <Text style={styles.scientific}>
                    {result.taxon.name.charAt(0)}
                    &#8288;
                    {result.taxon.name.slice(1)}</Text>
                <Text style={styles.groupName}>{result.taxon.groupName}</Text>
                {result.taxon.groupName === "Sopper" && (
                    <Text >ALDRI SPIS NOE PGA APPEN</Text>
                )}
            </View>

            <Text style={styles.infoText}>
                Artsorakelet gir {Math.round(percentage)} % treff for {result.taxon.vernacularName} basert
                på bildet ditt. Det er ikke sagt at det stemmer, du må selv kontrollere at det er riktig,
                særlig hvis du skal rapportere funnet.
            </Text>

            <View style={styles.actionButtons}>
                <Pressable

                    style={styles.idButton}>
                    <Text style={styles.idButtonText}>Om arten</Text>
                </Pressable>

                <Pressable
                    style={styles.idButton}>
                    <Text style={styles.idButtonText}>Rapporter funn</Text>
                </Pressable>




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
        flex: 1
    },

    infoText: {
        fontSize: .04 * vw,
        flexGrow: 1,
    },

    actionButtons: {
        flexDirection: "row",
        flexGrow: 0,
    },


    idButton: {
        height: 40,
        width: .4 * vw,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 2.5,
        borderColor: "#fff",
        backgroundColor: "rgb(221, 133, 8)",
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

    idButtonText: {
        color: "#fff",
        fontSize: 16,
    },

}
)

export default ModalResult;
