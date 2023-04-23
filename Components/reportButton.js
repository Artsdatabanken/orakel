import React, { useState } from "react";
import { Dimensions, Alert, Linking, Pressable, Text } from 'react-native';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


const ReportButton = ({ reportResult, croppedImages, styles, theme }) => {
    const [encryptionData, setEncryptionData] = useState(false);

    const openDialog = () => {
        saveImages(croppedImages);

        Alert.alert(
            'Har du bekreftet arten?',
            'Sjekk artsbestemmelsen selv før du rapporterer. Artsorakelet kan ta feil også ved høy treffprosent. Vil du fortsette?',
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: 'Fortsett',
                    onPress: () => redirectToArtsObs()
                },
            ]
        );
    }



    // const openDialogOld = (e) => {
    //     if (runningOnMobile()) {
    //         saveImages(croppedImages);
    //     } else {
    //         setDialogOpen(true);
    //     }
    // };

    function makeURL() {
        let probability = Math.round(reportResult.probability * 100);
        let percentage = `%7Cpercentage%3D${probability}`;
        let from = "meta=from%3Dorakel%7C";
        let platform = `platform%3Dapp`;
        let reporttype = `Report?`;

        reporttype = `?scientificname=${reportResult.taxon.scientificNameID}%26`;
        let url = "https://mobil.artsobservasjoner.no/#/orakel";

        return url + reporttype + from + platform + percentage;
    }

    function saveImages(croppedImages) {
        var formdata = new FormData();


        for (let image of croppedImages) {

            formdata.append('image', {
                uri: image.path,
                type: image.mime,
                name: image.filename || `${Date.now()}.jpg`,
            }
            );
        }

        let url = "https://ai.artsdatabanken.no";
        // url = "http://localhost:5000"; // For testing the ai server script locally

        fetch(url + "/save", {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formdata
        })
            .then((res) => {
                setEncryptionData(res.data);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    function redirectToArtsObs() {
        let url = makeURL(reportResult);
        if (encryptionData) {
            let id = encryptionData.id;
            let password = encryptionData.password;
            url += "&id=" + id + "&password=" + password;
        }
        Linking.openURL(url);
    }

    return (
        <Pressable
            style={[styles.button, theme.styles.button]}
            onPress={() => openDialog()}
        >
            <Text style={[styles.buttonText, theme.styles.button]}>Rapporter funn</Text>
        </Pressable>
    );
}

export default ReportButton;
