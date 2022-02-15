import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { SvgXml } from 'react-native-svg';

import HelpItem from './Components/helpItem';
import TopSection from './Components/topSection';
import IdResult from "./Components/idResult";


const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


const App = () => {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(false);
  const [inputStage, setInputStage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resultStage, setResultStage] = useState(false);


  const editImage = (imgIndex) => {
    ImagePicker.openCropper({
      path: uncroppedImages[imgIndex]["path"],
      cropperToolbarTitle: "Zoom inn på arten",
      showCropGuidelines: false,
      width: 500,
      height: 500
    }).then(img => {
      setCroppedImages(
        croppedImages.slice(0, imgIndex).concat([img], croppedImages.slice(imgIndex + 1))
      );
    }
    ).catch(
      () => {setCroppedImages(croppedImages.slice(0, imgIndex).concat(croppedImages.slice(imgIndex + 1)))}
    )
  }

  const getId = () => {
    setError(false);
    setInputStage(false);
    setLoading(true);

    let formdata = new FormData();

    for (let image of croppedImages) {

      formdata.append('image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || `${Date.now()}.jpg`,
      }
      );
    }

    fetch('https://ai.artsdatabanken.no', {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formdata
    })
      .then((res) => {
        res.json().then(json => {
          let preds = json.predictions.filter(
            (pred) => pred.probability > 0.02
          );

          if (preds.length > 5 || preds.length === 0) {
            preds = preds.slice(0, 5);
          }

          setPredictions(preds);
          setLoading(false);
          setResultStage(true);
        });

      })
      .catch((e) => console.log(e))
      .done()
  };

  const reset = () => {
    setCroppedImages([]);
    setUncroppedImages([]);
    setResultStage(false);
    setInputStage(true);
    setPredictions([]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgb(221, 133, 8)"
      />

      <TopSection images={croppedImages} editImage={editImage} />

      {!!croppedImages.length && !predictions.length &&

        <Pressable
          onPress={() => {
            getId()
          }}
          style={styles.idButton}>
          <Text style={styles.idButtonText}>Identifiser</Text>
        </Pressable>
      }

      {!!croppedImages.length && !!predictions.length &&

        <Pressable
          onPress={() => {
            reset()
          }}
          style={styles.idButton}>
          <SvgXml xml={`<svg><path fill="#fff" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"></path></svg>`} width="25" height="25" />

        </Pressable>
      }






      <ScrollView style={styles.scrollView}>

        {!!predictions.length &&

          predictions.map((pred, i) => (
            <IdResult result={pred} key={i} />
          ))
        }

        {inputStage && (
          <View>
            <HelpItem icon={"flower-tulip"} text={"Ta eller velg et bilde av en art i norsk natur"} />
            <HelpItem icon={"crop-free"} text={"Zoom inn til arten på bildet"} />
            <HelpItem icon={"image-multiple-outline"} text={"Flere bilder gir sikrere gjenkjenning"} />
            <HelpItem icon={"cloud-search-outline"} text={"Trykk «identifiser» for å se hva det kan være!"} />
          </View>
        )}
      </ScrollView>

      {inputStage &&
        <View style={styles.bottom_bar} >
          <Pressable
            onPress={() => {

              ImagePicker.openCamera({
                forceJpg: true,
                cropping: false,
              }).then(image => {
                setUncroppedImages([...uncroppedImages, image])
                ImagePicker.openCropper({
                  path: image["path"],
                  cropperToolbarTitle: "Zoom inn på arten",
                  showCropGuidelines: false,
                  width: 500,
                  height: 500
                }).then(img => {
                  setCroppedImages([...croppedImages, img])
                });
              });
            }}
            style={styles.button}>
            <Icon name="camera-alt" size={60} color="#fff" />

          </Pressable>

        </View >
      }
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: "rgb(221, 133, 8)",
  },

  bottom_bar: {
    textAlign: "center",
    backgroundColor: "#f8f6f8",
    height: 120,
  },


  button: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: .02 * vh,
    marginBottom: .02 * vh,
    width: .25 * vw,
    height: .25 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: .125 * vw,
    backgroundColor: 'orange',
  },

  help_item_text: {
    fontSize: 20,
    width: 250
  },

  scrollView: {
    backgroundColor: "#f8f6f8",
    borderTopLeftRadius: .07 * vw,
    borderTopRightRadius: .07 * vw,
    paddingTop: .02 * vh,
    flexGrow: 1,
    paddingHorizontal: .055 * vw
  },

  help_item: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },

  idButton: {
    height: 40,
    width: .3 * vw,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#fff",
    position: "absolute",
    top: 140,
    backgroundColor: "rgb(221, 133, 8)",
    zIndex: 100,
    marginLeft: .35 * vw,
  },

  idButtonText: {
    color: "#fff",
    fontSize: 16,
  }

}
)


export default App;