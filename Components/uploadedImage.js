import React from "react";
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';

const vw = Dimensions.get('window').width;

const UploadedImage = ({ img, imgIndex, editImage }) => {

    const doEdit = () => {
        editImage(imgIndex);
    };

    return (

        <TouchableWithoutFeedback onPress={doEdit}>
            <Image
                source={{ uri: img["path"] }}
                style={styles.img}
                onPr
            />
        </TouchableWithoutFeedback>




    );
}

const styles = StyleSheet.create({
    img: {
        width: .17 * vw,
        height: .17 * vw,
        borderRadius: .04 * vw,
        marginRight: .04 * vw,

    }
})

export default UploadedImage;
