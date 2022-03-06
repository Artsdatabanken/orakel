import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar, Pressable, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import { SvgXml } from 'react-native-svg';

import HelpItem from './Components/helpItem';
import TopSection from './Components/topSection';
import IdResult from "./Components/idResult";
import ModalResult from "./Components/ModalResult";

import About from "./Components/about";
import Manual from "./Components/manual";




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
  const viewSizeAnim = useRef(new Animated.Value(vh - 160 - 120)).current;

  const [modalContent, setModalContent] = useState(false);


  const [showMenu, setShowMenu] = useState(false);

  const hideView = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(viewSizeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const resultView = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(viewSizeAnim, {
      toValue: vh - 160,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const inputView = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(viewSizeAnim, {
      toValue: vh - 160 - 120,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

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
      () => { setCroppedImages(croppedImages.slice(0, imgIndex).concat(croppedImages.slice(imgIndex + 1))) }
    )
  }

  const openResult = (result) => {
    setModalContent(<ModalResult result={result} />);
  }

  const getId = () => {
    setInputStage(false);
    hideView();
    setError(false);
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
          resultView();
        });

      })
      .catch((e) => {
        console.log(e);
        inputView();
      })
      .done()
  };

  const reset = () => {
    setCroppedImages([]);
    setUncroppedImages([]);
    setResultStage(false);
    setInputStage(true);
    setPredictions([]);
    inputView();
  };

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="rgb(221, 133, 8)"
      />


      <Modal
        isVisible={!!modalContent}
        coverScreen={true}
        onBackdropPress={() => setModalContent(false)}
        style={{ margin: 0 }}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setModalContent(false)}>
            <View style={{ backgroundColor: "#000", top: -50, height: vh + 200 }} />
          </TouchableWithoutFeedback>
        }
      >
        <View style={styles.modalContent}>
          {modalContent}
        </View>
      </Modal>

      <Modal
        isVisible={showMenu}
        coverScreen={true}
        onBackdropPress={() => setShowMenu(false)}
        style={{ margin: 0 }}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
            <View style={{ backgroundColor: "#000", top: -50, height: vh + 200 }} />
          </TouchableWithoutFeedback>
        }
      >

        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Slå på nattmodus</Text>
            <SvgXml xml={`<svg><path fill="#000" d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>`} width="25" height="25" />
          </View>

          <Pressable style={styles.menuItem} onPress={() => {
            reset();
            setShowMenu(false);
          }}>
            <Text style={styles.menuText}>Restart appen</Text>
            <SvgXml xml={`<svg><path fill="#000" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>`} width="25" height="25" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {
            setModalContent(<Manual />)
            setShowMenu(false)
          }}>
            <Text style={styles.menuText}>Bruksanvisning</Text>
            <SvgXml xml={`<svg><path fill="#000" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path><path fill="#000" d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83zM17.5 14.33c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"></path></svg>`} width="25" height="25" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {
            setModalContent(<About />)
            setShowMenu(false)
          }}>
            <Text style={styles.menuText}>Om Artsorakelet</Text>
            <SvgXml xml={`<svg><path fill="#000" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>`} width="25" height="25" />
          </Pressable>

        </View>

      </Modal>

      <View style={styles.menu_bar}>
        <SvgXml xml={`<svg width="169.74" height="169.74" version="1.1" viewBox="0 0 169.74 169.74"><g transform="matrix(1.3333 0 0 -1.3333 -98.307 249.8)"><g transform="scale(.1)"><path d="m1952 1237c0-319.36-258.87-578.16-578.17-578.16v-58.383h636.5s0.05 498.55 0.05 636.54h-58.38" fill="#fffffe"/><path d="m1373.8 658.85c-319.3 0-578.18 258.8-578.18 578.16 0 319.28 258.88 578.16 578.18 578.16 170.53 0 323.86-73.85 429.66-191.35 92.29-102.46 148.51-238.07 148.51-386.81h58.38c0 95.03-21.01 185.17-58.35 266.18-31.95 69.15-75.9 131.57-129.15 184.67-115.05 114.74-273.71 185.66-449.05 185.66-351.53 0-636.52-284.98-636.52-636.51 0-351.56 284.94-636.54 636.52-636.54v58.383" fill="#fff"/><path d="m1580.6 1420c-13.12 0.03-23.81-10.63-23.81-23.85v-116.65c-0.05-13.2 10.69-23.86 23.85-23.89 13.19 0.03 23.82 10.66 23.82 23.89l0.07 116.65c0 13.19-10.7 23.85-23.93 23.85" fill="#fff"/></g></g></svg>`} width="25" height="25" />
        <Pressable
          onPress={() => {
            setShowMenu(true);
          }}>
          <SvgXml xml={`<svg><path fill="#fff" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`} width="25" height="25" />
        </Pressable>
      </View>

      <TopSection images={croppedImages} editImage={editImage} />

      {!!croppedImages.length && !predictions.length && inputStage &&

        <Pressable
          onPress={() => {
            getId()
          }}
          style={styles.idButton}>
          <Text style={styles.idButtonText}>Identifiser</Text>
        </Pressable>
      }

      {!!croppedImages.length && !!predictions.length && resultStage &&

        <Pressable
          onPress={() => {
            reset()
          }}
          style={styles.idButton}>
          <SvgXml xml={`<svg><path fill="#fff" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"></path></svg>`} width="25" height="25" />

        </Pressable>
      }

      <Animated.ScrollView style={[styles.scrollView, {
        height: viewSizeAnim
      }]}>


        {!!predictions.length &&

          predictions.map((pred, i) => (
            <IdResult result={pred} openResult={openResult} key={i} />
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
      </Animated.ScrollView>

      {inputStage &&
        <View style={styles.bottom_bar} >
          <View style={styles.camera_buttons} >
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
                    height: 500
                  }).then(img => {
                    setCroppedImages([...croppedImages, img])
                  });
                });
              }}
              style={styles.galleryButton}>

              <SvgXml xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6" /></svg>`} style={styles.gallery} />

            </Pressable>


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
                    height: 500
                  }).then(img => {
                    setCroppedImages([...croppedImages, img])
                  });
                });
              }}
              style={styles.button}>

              <SvgXml xml={`<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>`} style={styles.camera} />

            </Pressable>

            <View style={styles.button_balancer}>

            </View >
          </View >



        </View>
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

  menu_bar: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 25,
    flexGrow: 0,
  },

  menu: {
    marginTop: 100,
    marginHorizontal: 10,
    marginBottom: 50,
    backgroundColor: "#fff",
    opacity: 1,
    padding: 20,
    borderRadius: 20,
  },

  menuItem: {
    padding: .035 * vw,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  menuText: {
    fontSize: .055 * vw,

  },

  bottom_bar: {
    textAlign: "center",
    backgroundColor: "#f8f6f8",
    height: 120,
    flex: 1,
    flexDirection: "row"
  },


  camera_buttons: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "flex-end"
  },

  button: {
    marginTop: .02 * vh,
    marginBottom: .02 * vh,
    width: .25 * vw,
    height: .25 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: .125 * vw,
    backgroundColor: 'orange',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  galleryButton: {
    marginTop: .02 * vh,
    marginBottom: .02 * vh,
    width: .15 * vw,
    height: .15 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: .125 * vw,
    backgroundColor: 'orange',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  button_balancer: {
    width: .15 * vw,
  },


  gallery: {
    width: 30,
    height: 30,
    color: 'white'
  },

  camera: {
    width: 60,
    height: 60,
    color: 'white'
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
    flexGrow: 0,
    paddingHorizontal: .055 * vw,
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

  modalContent: {
    marginTop: 100,
    marginHorizontal: 10,
    marginBottom: 50,
    backgroundColor: "#fff",
    opacity: 1,
    padding: 20,
    flex: 1,
    borderRadius: 20,
  }

}
)


export default App;