import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, Animated, StatusBar, Pressable,
  Dimensions, TouchableWithoutFeedback, BackHandler, Appearance
} from 'react-native';
import Modal from "react-native-modal";
import { SvgXml } from 'react-native-svg';
import ImagePicker from 'react-native-image-crop-picker';

import HelpItem from './Components/helpItem';
import TopSection from './Components/topSection';
import IdResult from "./Components/idResult";
import ModalResult from "./Components/ModalResult";

import About from "./Components/about";
import Manual from "./Components/manual";
import CameraButtons from "./Components/cameraButtons";


const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

const accent = "hsl(35, 93%, 45%)"
const accent_pale = "hsl(35, 93%, 68%)"
const accent_dark1 = "hsl(33, 14%, 15%)"
const accent_dark2 = "hsl(30, 3%, 29%)"

const danger = "hsl(14, 46%, 48%)"
const danger_pale = "hsl(14, 46%, 68%)"

const light1 = "#fff"
const light2 = "#eee"
const dark1 = "#000"
const dark2 = "#121212"


const light_theme = StyleSheet.create({
  accent: {
    backgroundColor: accent,
    color: light2
  },

  content: {
    backgroundColor: light2,
    color: dark2
  },

  content_warning: {
    backgroundColor: danger,
    color: light1
  },

  button: {
    backgroundColor: accent,
    color: light1,
    borderColor: light1
  },

  link: {
    color: accent
  }
})

const dark_theme = StyleSheet.create({
  accent: {
    backgroundColor: dark2,
    color: light2,
  },

  content: {
    backgroundColor: accent_dark1,
    color: light2
  },

  content_warning: {
    backgroundColor: danger_pale,
    color: dark2
  },

  button: {
    backgroundColor: accent_pale,
    color: dark2,
    borderColor: dark1
  },

  link: {
    color: accent_pale
  }
})

const logo = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg id="a" viewBox="0 0 68.96 68.959999" version="1.1" width="68.959999" height="68.959999" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> <path d="M 34.479285,68.96 C 15.468305,68.96 0,53.493124 0,34.479285 0,15.465446 15.468305,0 34.479285,0 53.490266,0 68.96,15.468305 68.96,34.479285 h -8.703065 c 0,-14.212148 -11.562644,-25.7762201 -25.776221,-25.7762201 -14.213577,0 -25.7776491,11.5640721 -25.7776491,25.7762201 0,14.212148 11.5626431,25.77765 25.7762201,25.77765 z" id="path829" style="stroke-width:0.142907" style="fill:currentColor;stroke-width:0.142907" /> <path style="fill:currentColor;stroke-width:0.142907" d="M 60.339821,60.339821 V 45.304526 H 68.96 V 68.96 H 45.304526 v -8.620179 z" /> <path style="fill:currentColor;stroke-width:0.142907" d="m 49.614615,34.480714 a 5.4119057,5.4119057 0 0 1 -5.411905,5.411906 5.4119057,5.4119057 0 0 1 -5.411906,-5.411906 5.4119057,5.4119057 0 0 1 5.411906,-5.411906 5.4119057,5.4119057 0 0 1 5.411905,5.411906 z" /> </svg>'

const colorScheme = Appearance.getColorScheme();

const App = () => {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const viewSizeAnim = useRef(new Animated.Value(.67 * vh)).current;
  const [modalContent, setModalContent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [usedGallery, setUsedGallery] = useState(false);
  const [theme, setTheme] = useState({ 
    "name": colorScheme, 
    "opposite": (colorScheme === "dark" ? "light" : "dark"), 
    "styles": (colorScheme === "dark" ? dark_theme : light_theme)});



  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      if (!!predictions.length) {
        reset();
        return true;
      }
      else if (!!croppedImages.length) {
        editImage(croppedImages.length - 1)
        return true;
      }
      BackHandler.exitApp();
      return true;
    },
  );

  const toggleTheme = () => {
    setTheme({
      "name": theme.opposite,
      "opposite": theme.name,
      "styles": (theme.name === "dark" ? light_theme : dark_theme)
    })
  }

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
      // no camera buttons, top section is .18 vh
      toValue: .82 * vh,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const inputView = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(viewSizeAnim, {
      // camera buttons are .15 vh, top section is .18 vh
      toValue: .67 * vh,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const editImage = (imgIndex) => {
    setPredictions(false);
    setLoading(false);

    ImagePicker.openCropper({
      path: uncroppedImages[imgIndex]["path"],
      cropperToolbarTitle: "Zoom inn på arten",
      showCropGuidelines: false,
      width: 500,
      height: 500,
      cropperStatusBarColor: "#000000",
      cropperToolbarColor: "#000000",
      cropperToolbarWidgetColor: "#FFFFFF",
      forceJpg: true
    }).then(img => {
      setCroppedImages(
        croppedImages.slice(0, imgIndex).concat([img], croppedImages.slice(imgIndex + 1))
      );
    }
    ).catch(
      () => { setCroppedImages(croppedImages.slice(0, imgIndex).concat(croppedImages.slice(imgIndex + 1))) }
    )
  }

  const repeatLastAction = () => {
    if (usedGallery) {

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
          setPredictions(false)
        });
      });
    }
    else {
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
          setUsedGallery(false)
          setCroppedImages([...croppedImages, img])
          setPredictions(false)
        });
      });
    }
  }


  const openResult = (result) => {
    setModalContent(<ModalResult result={result} croppedImages={croppedImages} theme={theme} />);
  }

  const getId = () => {
    hideView();
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
          resultView();
        });

      })
      .catch((e) => {
        console.log(e);
        inputView();
      })
  };

  const reset = () => {
    setCroppedImages([]);
    setUncroppedImages([]);
    setPredictions([]);
    inputView();
  };

  return (
    <View style={[styles.container, theme.styles.accent]}>
      <StatusBar
        backgroundColor={(theme.name === "dark" ? dark2 : accent)}
      />

      <Modal
        isVisible={!!modalContent}
        coverScreen={true}
        onBackdropPress={() => setModalContent(false)}
        onRequestClose={() => setModalContent(false)}
        style={{ margin: 0 }}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setModalContent(false)}>
            <View style={{ backgroundColor: "#000", top: -50, height: vh + 200 }} />
          </TouchableWithoutFeedback>
        }
      >
        <View style={[styles.modalContent, theme.styles.content]}>
          {modalContent}
        </View>
      </Modal>

      <Modal
        isVisible={showMenu}
        coverScreen={true}
        onBackdropPress={() => setShowMenu(false)}
        onRequestClose={() => setShowMenu(false)}
        style={{ margin: 0 }}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
            <View style={{ backgroundColor: "#000", top: -50, height: vh + 200 }} />
          </TouchableWithoutFeedback>
        }
      >

        <View style={[styles.menu, theme.styles.content]}>
          <Pressable style={styles.menuItem} onPress={() => {
            toggleTheme();
            setShowMenu(false);
          }}>
            <Text style={[styles.menuText, theme.styles.content]}>Slå på {theme.opposite === "dark" ? "mørkt" : "lyst"} tema  </Text>
            <SvgXml style={theme.styles.content} xml={`<svg><path fill="currentColor" d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>`} width="25" height="25" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {
            reset();
            setShowMenu(false);
          }}>
            <Text style={[styles.menuText, theme.styles.content]}>Restart appen</Text>
            <SvgXml style={theme.styles.content} xml={`<svg><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>`} width="25" height="25" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {
            setModalContent(<Manual theme={theme} />)
            setShowMenu(false)
          }}>
            <Text style={[styles.menuText, theme.styles.content]}>Bruksanvisning</Text>
            <SvgXml style={theme.styles.content} xml={`<svg><path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path><path fill="#000" d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83zM17.5 14.33c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"></path></svg>`} width="25" height="25" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {
            setModalContent(<About theme={theme} />)
            setShowMenu(false)
          }}>
            <Text style={[styles.menuText, theme.styles.content]}>Om Artsorakelet</Text>
            <SvgXml style={theme.styles.content} xml={`<svg><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>`} width="25" height="25" />
          </Pressable>
        </View>

      </Modal >

      <View style={styles.menu_bar}>
        <SvgXml style={theme.styles.accent} xml={logo} width="21" height="25" />
        <Pressable
          onPress={() => {
            setShowMenu(true);
          }}>
          <SvgXml xml={`<svg><path fill="#fff" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`} width="25" height="25" />
        </Pressable>
      </View>

      <TopSection images={croppedImages} editImage={editImage} repeatLastAction={repeatLastAction} loading={loading} />

      {
        !!croppedImages.length && !predictions.length && !loading &&

        <Pressable
          onPress={() => {
            getId()
          }}
          style={[styles.idButton, theme.styles.button]}>
          <Text style={[styles.idButtonText, theme.styles.button]}>Identifiser</Text>
        </Pressable>
      }

      {
        !!croppedImages.length && !!predictions.length &&

        <Pressable
          onPress={() => {
            reset()
          }}
          style={[styles.idButton, theme.styles.button]}>
          <SvgXml style={theme.styles.button} xml={`<svg><path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"></path></svg>`} width="25" height="25" />

        </Pressable>
      }

      <Animated.ScrollView style={[styles.scrollView, theme.styles.content, {
        height: viewSizeAnim
      }]}>


        {!!predictions.length &&
          predictions.map((pred, i) => (
            <IdResult result={pred} openResult={openResult} key={i} theme={theme} />
          ))
        }

        {!predictions.length && (
          <View>
            <HelpItem icon={"flower-tulip"} text={"Ta eller velg et bilde av en art i norsk natur"} theme={theme} />
            <HelpItem icon={"crop-free"} text={"Zoom inn til arten på bildet"} theme={theme} />
            <HelpItem icon={"image-multiple-outline"} text={"Flere bilder gir sikrere gjenkjenning"} theme={theme} />
            <HelpItem icon={"cloud-search-outline"} text={"Trykk «identifiser» for å se hva det kan være!"} theme={theme} />
          </View>
        )}
      </Animated.ScrollView>

      {
        !predictions.length && !loading &&
        <View style={[styles.bottom_bar, theme.styles.content]} >
          <CameraButtons
            setUncroppedImages={setUncroppedImages}
            uncroppedImages={uncroppedImages}
            setCroppedImages={setCroppedImages}
            croppedImages={croppedImages}
            setUsedGallery={setUsedGallery}
            theme={theme}
          />
        </View>
      }

    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch"
  },

  menu_bar: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: .04 * vw,
    paddingVertical: .025 * vh,
    flexGrow: 0,
    minHeight: .05 * vh,
  },

  menu: {
    marginTop: .12 * vh,
    marginHorizontal: .03 * vw,
    marginBottom: .06 * vh,
    opacity: 1,
    padding: .06 * vw,
    borderRadius: .06 * vw,
  },

  menuItem: {
    padding: .025 * vw,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  menuText: {
    fontSize: .053 * vw,
  },

  bottom_bar: {
    textAlign: "center",
    flex: 1,
    flexDirection: "row",
    minHeight: .15 * vh
  },

  scrollView: {
    borderTopLeftRadius: .07 * vw,
    borderTopRightRadius: .07 * vw,
    paddingTop: .03 * vh,
    paddingHorizontal: .055 * vw,
    flexGrow: 0
  },

  help_item: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },

  idButton: {
    height: .10 * vw,
    width: .3 * vw,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: .05 * vw,
    borderWidth: .007 * vw,
    position: "absolute",
    top: .205 * vh,
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
    fontSize: .04 * vw
  },

  modalContent: {
    marginTop: .150 * vh,
    marginHorizontal: .025 * vw,
    marginBottom: .075 * vh,
    opacity: 1,
    padding: .06 * vw,
    flex: 1,
    borderRadius: .06 * vw,
  }
}
)


export default App;