/*
Bouton de base qui sera utilisé dans l'application dans le but de généraliser le style des boutons de l'application
On y spécifie:
  Le texte affiché sur le bouton
  La couleur du bouton
  La couleur du texte
  L'action effectué lorsqu'on appuie sur ce bouton
*/
import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { PointOfInterest, Trail } from "../types";
import { FONT_STYLE } from "../Utils/FontStyles";

type Props = {
  text: string;
  color: string;
  textColor: string;
  action: () => void;
};

export default function ActionButton({
  text,
  color,
  textColor,
  action,
}: Props): JSX.Element {
  const RADIUS = 7;

  return (
    <TouchableHighlight
      style={{ width: "100%", borderRadius: RADIUS }}
      underlayColor={"black"}
      onPress={action}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: color, borderRadius: RADIUS },
        ]}
      >
        <Text style={[styles.text, { color: textColor }, FONT_STYLE.REGULAR]}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
  },
  text: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});
