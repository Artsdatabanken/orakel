import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, Animated, StatusBar, Pressable, SafeAreaView,
  Dimensions, BackHandler, Appearance, Platform
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import ImagePicker from 'react-native-image-crop-picker';

import HelpItem from './Components/helpItem';
import TopSection from './Components/topSection';
import IdResult from "./Components/idResult";
import ResultDetails from "./Components/resultDetails";

import Menu from "./Components/menu";
import Page from "./Components/page";


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

let controller = new AbortController();

const light_theme = StyleSheet.create({
  accent: {
    backgroundColor: accent,
    color: light2
  },

  content: {
    backgroundColor: light2,
    color: dark2
  },

  content_text: {
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

  content_text: {
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
  const viewSizeAnim = useRef(new Animated.Value(.65 * vh)).current;
  const [showPage, setShowPage] = useState(false);
  const [usedGallery, setUsedGallery] = useState(false);
  const [theme, setTheme] = useState({
    "name": colorScheme,
    "opposite": (colorScheme === "dark" ? "light" : "dark"),
    "styles": (colorScheme === "dark" ? dark_theme : light_theme)
  });

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      if (loading) {
        controller.abort();
        controller = new AbortController();
        return true;
      }
      else if (!!predictions.length) {
        reset();
        return true;
      }
      else if (!!croppedImages.length) {
        editImage(croppedImages.length - 1)
        setLoading(false);
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
      // no camera buttons, top section is .2 vh
      toValue: .8 * vh,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const inputView = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(viewSizeAnim, {
      // camera buttons are .15 vh, top section is .2 vh
      toValue: .65 * vh,
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
    setShowPage(
      {
        "title": "Resultat",
        "content": <ResultDetails result={result} croppedImages={croppedImages} theme={theme} />
      }
    );
  }

  const getId = () => {
    hideView();
    setLoading(true);

    let formdata = new FormData();

    formdata.append('application', 'Artsorakel 3.1.1 (' + Platform.OS + ')')

    for (let image of croppedImages) {
      formdata.append('image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || `${Date.now()}.jpg`,
      }
      );
    }

    fetch('https://ai.test.artsdatabanken.no', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formdata
    })
      .then((res) => {
        res.json().then(json => {

          let preds = json.predictions[0].taxa.items.filter(
            (pred) => pred.probability > 0.02
          );

          if (preds.length === 0) {
            preds = json.predictions.slice(0, 5);
          }
          else if (preds.length > 5) {
            preds = preds.slice(0, 5);
          }

          setPredictions(preds);
          setLoading(false);
          resultView();

        });
      })
      .catch((e) => {
        console.log(e);
        setPredictions([]);
        setLoading(false);
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
    <>
      <StatusBar
        backgroundColor={(theme.name === "dark" ? dark2 : accent)}
      />
      <SafeAreaView style={[{ flex: 0 }, theme.styles.accent]} />
      <SafeAreaView style={[styles.container, theme.styles.content]}>
        <View style={[theme.styles.accent, styles.container]} >

          <Page
            theme={theme}
            page={showPage}
            setShowPage={setShowPage}
          />

          <View style={styles.menu_bar}>
            <SvgXml style={theme.styles.accent} xml={logo} width="21" height="25" />
            <Pressable
              onPress={() => {
                setShowPage(
                  {
                    "title": "Artsorakel",
                    "content": <Menu theme={theme} setShowPage={setShowPage} toggleTheme={toggleTheme} reset={reset} />
                  }
                );
              }}
              hitSlop={15}
            >
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


            {!!predictions.length && !!croppedImages.length &&
              predictions.map((pred, i) => (
                <IdResult result={pred} openResult={openResult} ranking={i} key={i} theme={theme} />
              ))
            }

            {(!predictions.length || !croppedImages.length) && (
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
        </View>
      </SafeAreaView >
    </>
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
    zIndex: 100
  },

  menu: {
    marginTop: .12 * vh,
    marginBottom: .08 * vh,
    opacity: 1,
    padding: .106 * vw,
    borderRadius: .06 * vw,
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
    marginTop: -.10 * vw,
    width: .3 * vw,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: .05 * vw,
    borderWidth: .007 * vw,
    position: "relative",
    top: .05 * vw,
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

}
)


export default App;