/*
Cet écran est le premier que l'utilisateur va voir en ouvrant son application. 
*/
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { AppStackParamList } from "../Navigation";
import { images } from "../assets/images";
import { BLACK, SENTIERS_GREY, SENTIERS_RED } from "../Utils/Colors";
import { HORIZONTAL_PADDING, SCREEN_WIDTH } from "../Utils/Constants";
import { calculateProportions } from "../Utils/ResizeImage";
import { t } from "i18n-js";
import { STRINGS_OPTIONS } from "../Utils/Strings";
import ActionButton from "../Components/ActionButton";

import { FONT_STYLE } from "../Utils/FontStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { AppAccessType, LoginStatus, Partner } from "../types";
import userPassIsStillAvailable from "./LoginScreen.utils";
import { storeLogInUser, storeLogInUserByDate } from "../Utils/Storage";
import GetPartners from "../Fetches/GetPartners";

type InitScreenNavigationProp = StackNavigationProp<AppStackParamList, "Init">;

type Props = {
  navigation: InitScreenNavigationProp;
};
//Constante pour modifier la largeur du logo en pourcentage. Rend facile la modification.
const LOGO_DESIRED_WIDTH_PERCENTAGE = 100;

export default function InitScreen({ navigation }: Props): JSX.Element {
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      //Va chercher la valeur associée au loginState
      const value = await AsyncStorage.getItem("loginState");
      //Récupère le statut de la connexion
      const status: LoginStatus = value ? JSON.parse(value) : null;

      //Si l'application a déjà été ouverte par l'utilisateur
      if (status !== null) {
        //Si l'utilisateur est encore connecté
        if (status.isLogged) {
          //Si l'utilisateur s'est connecté avec son compte de membre des Sentiers de l'Estrie
          if (status.loginType === AppAccessType.membership) {
            //Reconnecte le automatiquement
            await storeLogInUser(AppAccessType.membership, status.customToken);
            //Envoie-le à la liste de zones
            navigateToZoneList();
          } else {
            //Si l'utilisateur est encore connecté, mais qu'il s'est connecté avec une passe journalière
            //Vérifie si son accès est encore valide
            if (userPassIsStillAvailable(new Date(), status.lastLogin)) {
              //Si son code est encore valide, reconnecte l'utilisateur avec la même date que lors de l'activation du code
              await storeLogInUserByDate(status.lastLogin, status.customToken);
              //Envoie-le à la liste de zones
              navigateToZoneList();
            }
          }
        } else {
          //Va chercher tous les partenaires des Sentiers de l'Estrie
          GetPartners().then(setPartners);
        }
      }
      //Si une de ces conditions est rencontréem va chercher les partenaires.
      //Il faut s'assurer de ne pas aller chercher les partenaires si l'utilisateur s'est déjà connecter.
      //Autrement, les fetchs s'empilent et le système va crasher.
      else {
        //Va chercher tous les partenaires des Sentiers de l'Estrie
        GetPartners().then(setPartners);
      }
    })();
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

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          resizeMethod="resize"
          style={{ width: imageWidth, height: imageHeight }}
          source={images.logo}
        />
      </View>
      <View>
        <View style={styles.buttonContainer}>
          <ActionButton
            action={() =>
              navigation.navigate("Login", {
                loginType: AppAccessType.membership,
              })
            }
            color={SENTIERS_GREY}
            textColor={BLACK}
            text={t(STRINGS_OPTIONS.i_am_member)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ActionButton
            action={() =>
              navigation.navigate("Login", {
                loginType: AppAccessType.code,
              })
            }
            color={SENTIERS_GREY}
            textColor={BLACK}
            text={t(STRINGS_OPTIONS.i_have_a_code)}
          />
        </View>
      </View>
      {/*Si il y a des partenaires, va afficher une boîte grise dans le bas de l'écran*/}
      {partners.length > 0 ? (
        <View style={styles.partners}>
          <View style={styles.partnersContent}>
            <Text style={[FONT_STYLE.TITLE, styles.partnersTitle]}>
              {t(STRINGS_OPTIONS.partners)}
            </Text>
            <ScrollView>
              {partners.map((p) => (
                <Text
                  key={p.name}
                  style={[styles.partnersName, FONT_STYLE.REGULAR]}
                >
                  {p.name}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View />
      )}
    </View>
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
    backgroundColor: SENTIERS_GREY,
    width: SCREEN_WIDTH,
    alignSelf: "center",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  partnersContent: {
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    height: "100%",
  },

  partnersTitle: { textAlign: "center" },
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
  partnersName: {
    paddingBottom: 5,
  },
});
