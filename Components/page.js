import React from "react";
import {
    View, Text, StyleSheet, Pressable, Dimensions, Modal, SafeAreaView
} from 'react-native';
import { SvgXml } from 'react-native-svg';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function Page({ theme, page, setShowPage }) {

    return (
        <Modal
            visible={!!page}
            animationType="slide"
            onRequestClose={() => setShowPage(false)}
        >
            <SafeAreaView style={[theme.styles.content, styles.content]}>
                <View
                    style={styles.header}
                >
                    <Pressable style={[styles.icon]} onPress={() => {
                        setShowPage(false);
                    }} >
                        <SvgXml
                            style={[theme.styles.content]}
                            xml={`<svg viewBox="0 0 25 25"><path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path></svg>`}
                        />
                    </Pressable>
                    <Text style={[styles.title, theme.styles.content]}>
                        {page && page.title}
                    </Text>
                </View>

                {page && page.content}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    content: {
        opacity: 1,
        padding: .06 * vw,
        flex: 1,
    },

    title: {
        fontSize: .06 * vw,
        marginTop: "auto",
        marginBottom: "auto",
    },

    icon: {
        height: .06 * vw,
        width: .06 * vw,
        marginTop: "auto",
        marginBottom: "auto",
        marginRight: .025 * vw,
    },

    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: .035 * vw,
        paddingBottom: .040 * vw,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
      },
})

export default Page;
