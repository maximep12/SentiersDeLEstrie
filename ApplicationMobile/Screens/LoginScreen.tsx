/*
Cet écran est le premier que l'utilisateur va voir en ouvrant son application. 
*/
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  View,
} from "react-native";
import { AppStackParamList } from "../Navigation";
import { images } from "../assets/images";
import { BLACK, SENTIERS_GREY, SENTIERS_RED } from "../Utils/Colors";
import {
  DEVICE_ID,
  HORIZONTAL_PADDING,
  SCREEN_WIDTH,
} from "../Utils/Constants";
import { calculateProportions } from "../Utils/ResizeImage";
import { t } from "i18n-js";
import { STRINGS_OPTIONS } from "../Utils/Strings";
import ActionButton from "../Components/ActionButton";
import ValidateEmail from "../Utils/ValidateEmail";
import { FONT_STYLE } from "../Utils/FontStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, RouteProp } from "@react-navigation/native";
import { AppAccessType, LoginStatus } from "../types";
import userPassIsStillAvailable from "./LoginScreen.utils";
import { storeLogInUser, storeLogInUserByDate } from "../Utils/Storage";
import GetHashKey from "../Fetches/GetHashKey";
import SendLoginToServer from "../Fetches/SendLoginInfosToServer";
import ConnectFirebase from "../ConnectFirebase";
import FullScreenSpinner from "../Components/FullScreenSpinner";
import ToastMessage from "../Utils/ToastMessage";

type LoginScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "Login"
>;

type LoginScreenRouteProp = RouteProp<AppStackParamList, "Login">;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};
//Constante pour modifier la largeur du logo en pourcentage. Rend facile la modification.
const LOGO_DESIRED_WIDTH_PERCENTAGE = 100;

export default function LoginScreen({ navigation, route }: Props): JSX.Element {
  const { loginType } = route.params;
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [connectionInProgress, setConnectionInProgress] = useState<boolean>(
    false
  );

  // Ce UseEffect permet de réduire la taille du logo et s'assure qu'il garde les bonnes proportions
  useEffect(() => {
    const { width, height } = Image.resolveAssetSource(images.logo);
    const { resizedWidth, resizedHeight } = calculateProportions(
      width,
      height,
      (SCREEN_WIDTH / 100) * LOGO_DESIRED_WIDTH_PERCENTAGE - HORIZONTAL_PADDING
    );
    setImageWidth(resizedWidth);
    setImageHeight(resizedHeight);
  }, []);

  /*
  Renvoie au prochain écran logique et empêche l'utilisateur de retourner en arrière. 
  La flèche arrière sera donc inutile autant sur IOS que Android
  */
  function navigateToZoneList(): void {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ZoneList" }],
      })
    );
  }

  async function loginUser(): Promise<void> {
    //Assure qu tous les champs de connexion requis sont présents
    if (!email || !password) {
      ToastMessage(t(STRINGS_OPTIONS.empty_field));
      return;
    }

    //Si le format de courriel est valide
    if (ValidateEmail(email)) {
      setConnectionInProgress(true);

      try {
        var hashKey: string = await GetHashKey(loginType);
        const validConnToken = await SendLoginToServer(
          email,
          password,
          hashKey,
          DEVICE_ID,
          loginType
        );

        // Enregistre dans la mémoire du téléphone que l'utilisateur s'est connecté
        await storeLogInUser(loginType, validConnToken);

        // Connecte l'utilisateur à Firebase. Inutile pour l'instant, mais sera utile dans l'avenir.
        await ConnectFirebase(validConnToken);

        //Enregistre l'état de la connexion dans le téléphone de l'utilisateur
        await storeLogInUser(loginType, validConnToken);

        //Envoie-le à la liste de zones
        navigateToZoneList();
      } catch (error) {
        ToastMessage(t(STRINGS_OPTIONS.login_failed));
      }
      setConnectionInProgress(false);

      //Envoie-le à la liste de zones
      //navigateToZoneList(); // rendu plus haut
    } else {
      ToastMessage(t(STRINGS_OPTIONS.invalid_email_format));
    }
  }

  if (connectionInProgress) {
    return <FullScreenSpinner />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : null}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              resizeMethod="resize"
              style={{ width: imageWidth, height: imageHeight }}
              source={images.logo}
            />
          </View>
          <View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputTitle, FONT_STYLE.REGULAR]}>
                {t(STRINGS_OPTIONS.email)}
              </Text>
              <TextInput
                textContentType={"emailAddress"}
                autoCompleteType={"email"}
                keyboardType={"email-address"}
                placeholder={t(STRINGS_OPTIONS.email)}
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputTitle, FONT_STYLE.REGULAR]}>
                {loginType === AppAccessType.membership
                  ? t(STRINGS_OPTIONS.password)
                  : t(STRINGS_OPTIONS.code)}
              </Text>
              <TextInput
                textContentType={
                  loginType === AppAccessType.membership ? "password" : "none"
                }
                autoCompleteType={
                  loginType === AppAccessType.membership ? "password" : "off"
                }
                secureTextEntry={
                  loginType === AppAccessType.membership ? true : false
                }
                placeholder={
                  loginType === AppAccessType.membership
                    ? t(STRINGS_OPTIONS.password)
                    : t(STRINGS_OPTIONS.code)
                }
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.buttonContainer}>
              <ActionButton
                action={() => loginUser()}
                color={SENTIERS_GREY}
                textColor={BLACK}
                text={t(STRINGS_OPTIONS.login)}
              />
            </View>
          </View>
          <View style={styles.partners}>{/* <Text>Partenaires</Text> */}</View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SENTIERS_RED,
    height: "100%",
    width: "100%",
    paddingTop: 30,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: "space-between",
  },

  logoContainer: {
    paddingTop: 20,
    width: "100%",
    alignItems: "center",
  },

  buttonContainer: {
    width: "70%",
    alignSelf: "center",
    marginTop: 10,
  },

  partners: {
    backgroundColor: SENTIERS_RED,
    width: SCREEN_WIDTH,
    alignSelf: "center",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },

  textInput: {
    backgroundColor: SENTIERS_GREY,
    padding: 7,
    marginVertical: 5,
  },

  inputContainer: {
    marginVertical: 5,
  },

  inputTitle: {
    color: "white",
    fontWeight: "bold",
  },
});
