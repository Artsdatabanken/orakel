import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import UploadedImage from './uploadedImage';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


const TopSection = ({ images, editImage, repeatLastAction, loading }) => {

    return (
        <View style={styles.view}>
            {!!images.length &&
                <ScrollView horizontal style={styles.images}>
                    {images.map((img, index) => (
                        <UploadedImage
                            img={img}
                            key={index}
                            imgIndex={index}
                            editImage={editImage}
                            loading={loading}
                        />
                    ))}

                    {!loading &&
                        <UploadedImage
                            editImage={repeatLastAction}
                        />

                    }

                </ScrollView>
            }

            {!images.length &&
                <Text style={styles.title}>Ta eller velg et bilde for å starte</Text>
            }
            {!images.length &&
                <Text style={styles.info}>Artsorakelet kjenner ikke igjen mennesker, husdyr, hageplanter, osv.</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: .026 * vh,
        color: "#fff",
        textAlign: 'center',
        width: .8 * vw,
        flex: 1,
    },

    info: {
        fontSize: .02 * vh,
        color: "#fff",
        textAlign: 'center',
        width: .8 * vw,
        flex: 1,
    },

    icon: {
        color: "rgb(76, 74, 72)"
    },

    view: {
        width: vw,
        alignContent: "center",
        alignItems: "center",
        justifyContent: 'center',
        color: "#fff",
        padding: .04 * vw,
        flexGrow: 1,
        minHeight: .2 * vh,
        display: "flex"
    },

    images: {
        color: "#fff",
        flexGrow: 0,
        paddingBottom: .015 * vh
    },

}
)


export default TopSection;