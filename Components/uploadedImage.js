import React from "react";
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';


const vw = Dimensions.get('window').width;

const UploadedImage = ({ img, imgIndex, editImage, loading }) => {

    const doEdit = () => {
        editImage(imgIndex);
    };

    if (!img) {
        return (
            <Pressable style={[styles.img, styles.add]} onPress={editImage}>
                <SvgXml
                    xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`}
                    style={styles.icon}
                />
            </Pressable>
        );
    }



    return (
        <TouchableWithoutFeedback onPress={doEdit}>
            <Image
                source={{ uri: img["path"] }}
                style={[
                    styles.img,
                    ]}
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
    },

    add: {
        borderWidth: .006 * vw,
        borderColor: "white",
        borderStyle: "dotted",
        color: "white",
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .5

    },
    icon: {
        width: .1 * vw,
        height: .1 * vw,
        color: 'white'
    },
})

export default UploadedImage;
