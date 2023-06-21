import React from 'react';
import { View, StyleSheet, Dimensions, Pressable, PermissionsAndroid, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ImagePicker from 'react-native-image-crop-picker';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;



async function hasAndroidPermission() {
    const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
}


async function savePicture(img) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        return;
    }
    CameraRoll.save(img, {type: 'Photo', album: 'Artsorakel'})
}

const CameraButtons = ({ setUncroppedImages, uncroppedImages, setCroppedImages, croppedImages, setUsedGallery, theme }) => {

    return (
        <View style={styles.camera_buttons} >
            <View
                accessible={true}
                accessibilityLabel="Velg bilde fra galleri"
            >
                <Pressable
                    onPress={() => {
                        ImagePicker.openPicker({
                            forceJpg: true,
                            cropping: false,
                            mediaType: "photo",
                        }).then(image => {
                            setUncroppedImages([...uncroppedImages, image])
                            ImagePicker.openCropper({
                                path: image["path"],
                                cropperToolbarTitle: "Zoom inn på arten",
                                showCropGuidelines: false,
                                width: 500,
                                height: 500,
                                cropperStatusBarColor: "#000000",
                                cropperToolbarColor: "#000000",
                                cropperToolbarWidgetColor: "#FFFFFF",
                                forceJpg: true
                            }).then(img => {
                                setUsedGallery(true)
                                setCroppedImages([...croppedImages, img])
                            });
                        });
                    }}
                    style={[styles.button, styles.galleryButton, theme.styles.button]}>

                    <SvgXml
                        xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6" /></svg>`}
                        style={[styles.galleryIcon, theme.styles.button]}
                    />

                </Pressable>
            </View>
            <View
                accessible={true}
                accessibilityLabel="Ta nytt bilde"
            >
                <Pressable
                    onPress={() => {
                        ImagePicker.openCamera({
                            forceJpg: true,
                            cropping: false,
                            mediaType: "photo",
                        }).then(image => {
                            setUncroppedImages([...uncroppedImages, image])
                            ImagePicker.openCropper({
                                path: image["path"],
                                cropperToolbarTitle: "Zoom inn på arten",
                                showCropGuidelines: false,
                                width: 500,
                                height: 500,
                                cropperStatusBarColor: "#000000",
                                cropperToolbarColor: "#000000",
                                cropperToolbarWidgetColor: "#FFFFFF",
                                forceJpg: true
                            }).then(img => {
                                savePicture(img.path)
                                setUsedGallery(false)
                                setCroppedImages([...croppedImages, img])
                            });
                        });
                    }}
                    style={[styles.button, styles.cameraButton, theme.styles.button]}>

                    <SvgXml
                        xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>`}
                        style={[styles.cameraIcon, theme.styles.button]}
                    />

                </Pressable>
            </View>
            <View style={styles.button_balancer}>

            </View >
        </View >
    )
}

const styles = StyleSheet.create({

    camera_buttons: {
        flexDirection: "row",
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "flex-end"
    },

    button: {
        marginTop: .02 * vh,
        marginBottom: .02 * vh,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: .11 * vw,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },

    cameraButton: {
        width: .22 * vw,
        height: .22 * vw,
    },

    galleryButton: {
        marginRight: .04 * vw,
        width: .15 * vw,
        height: .15 * vw,
    },

    button_balancer: {
        width: .15 * vw,
        marginRight: .04 * vw,
    },

    galleryIcon: {
        height: .075 * vw,
        width: .075 * vw,
    },

    cameraIcon: {
        height: .12 * vw,
        width: .12 * vw,
    },

}
)


export default CameraButtons;