import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


const HelpItem = ({ text, icon }) => {
    return (
        <View style={styles.view}>
            <Icon name={icon} size={.1 * vw} style={styles.icon} />
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: .026 * vh,
        paddingLeft: vw * .08,
        color: "rgb(76, 74, 72)"
    },

    icon: {
        color: "rgb(76, 74, 72)"
    },

    view: {
        padding: vh * .02,
        width: vw * .7,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },

}
)


export default HelpItem;