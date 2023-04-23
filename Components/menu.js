import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import About from "./about";
import Manual from "./manual";


const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


function Menu({ theme, setShowPage, toggleTheme, reset }) {

    return (
        <ScrollView style={[styles.content]}>

            <Pressable style={styles.menuItem} onPress={() => {
                toggleTheme();
                setShowPage(false);
            }}>
                <View style={[styles.menuIcon]} >
                    <SvgXml style={[theme.styles.content, styles.menuIcon]} xml={`<svg viewBox="0 0 25 25"><path fill="currentColor" d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>`} />
                </View>
                <Text style={[styles.menuText, theme.styles.content]}>
                    Slå på {theme.opposite === "dark" ? "mørkt" : "lyst"} tema
                </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => {
                reset();
                setShowPage(false);
            }}>
                <View style={[styles.menuIcon]} >
                    <SvgXml
                        style={[theme.styles.content, styles.menuIcon]}
                        xml={`<svg viewBox="0 0 25 25"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>`}
                    />
                </View>
                <Text style={[styles.menuText, theme.styles.content]}>
                    Restart appen
                </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => {
                setShowPage(
                    {
                        "title": "Bruksanvisning",
                        "content": <Manual theme={theme} />
                    })
            }}>
                <View style={[styles.menuIcon]} >
                    <SvgXml
                        style={[theme.styles.content, styles.menuIcon]}
                        xml={`<svg viewBox="0 0 25 25"><path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path><path fill="#000" d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83zM17.5 14.33c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"></path></svg>`}
                    />
                </View>
                <Text style={[styles.menuText, theme.styles.content]}>
                    Bruksanvisning
                </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => {
                setShowPage(
                    {
                        "title": "Om Artsorakelet",
                        "content": <About theme={theme} />
                    })
            }}>
                <View style={[styles.menuIcon]} >
                    <SvgXml
                        style={[theme.styles.content, styles.menuIcon]}
                        xml={`<svg viewBox="0 0 25 25"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>`}
                    />
                </View>
                <Text style={[styles.menuText, theme.styles.content]}>
                    Om Artsorakelet
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: .06 * vw,
      },

    menuItem: {
        padding: .025 * vw,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center"
    },

    menuText: {
        fontSize: .045 * vw,
        marginTop: "auto",
        marginBottom: "auto",
    },

    menuIcon: {
        width: .05 * vw,
        height: .05 * vw,
        marginTop: "auto",
        marginBottom: "auto",
        marginRight: .05 * vw,

    },

})

export default Menu;
