/*
Comprend le contenu de la boîte blanche qui apparaît lorsq'on clique sur la loupe sur le MapScreen. Contient:
  Un champ à remplir
  Un bouton de soumission
*/
import { t } from "i18n-js";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

import { PointOfInterest } from "../types";
import { SENTIERS_GREY, BLACK } from "../Utils/Colors";
import { FONT_STYLE } from "../Utils/FontStyles";
import { STRINGS_OPTIONS } from "../Utils/Strings";
import ToastMessage from "../Utils/ToastMessage";
import ActionButton from "./ActionButton";

type Props = {
  pointList: PointOfInterest[];
  onPointSelected: (point: PointOfInterest) => void;
};

export default function PointSearcher({
  pointList,
  onPointSelected,
}: Props): JSX.Element {
  const [code, setCode] = useState<string>("");

  //Lorsque le bouton de soumission est pesé
  function handleNewCode(): void {
    {
      //Si il n'y a pas de champs entré
      if (!code) {
        ToastMessage(t(STRINGS_OPTIONS.empty_field));
        return;
      }
      // Sinon
      Keyboard.dismiss();
      const poi = pointList.find((point) => point.code === code);
      //Si un point est trouvé
      if (poi) {
        //Renvoie ce point au MapScreen pour qu'il soit le nouveau point sélectionné
        onPointSelected(poi);
      } else {
        //Affiche un message indiquant que le code n'existe pas
        ToastMessage(t(STRINGS_OPTIONS.invalid_code));
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={[FONT_STYLE.TITLE, { textAlign: "center" }]}>
          {t(STRINGS_OPTIONS.codeHelp)}
        </Text>
        <TextInput
          keyboardType={"default"}
          placeholder={t(STRINGS_OPTIONS.code)}
          value={code}
          style={styles.textInput}
          onChangeText={setCode}
        />
        <ActionButton
          action={handleNewCode}
          color={SENTIERS_GREY}
          textColor={BLACK}
          text={t(STRINGS_OPTIONS.search)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    backgroundColor: SENTIERS_GREY,
    width: "90%",
    padding: 10,
  },
});
