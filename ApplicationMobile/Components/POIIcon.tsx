/*
Comprend le contenu qui permet de faire varier l'affichage d'un point d'intérêt dépendamment de ses attributs.
*/
import React, { useEffect, useState } from "react";
import { InterestType } from "../types";
import { StyleSheet, Text, View } from "react-native";
import { getPOIInfosByType } from "./POIIcon.utils";
import { SENTIERS_RED, WHITE } from "../Utils/Colors";

type Props = {
  type: InterestType;
  isSelected: boolean;
};

export default function POIIcon({ type, isSelected }: Props): JSX.Element {
  const [iconInfos, setIconInfos] = useState({
    color: " ",
    icon: "I",
  });

  /*
  C'est ici qu'on va venir indiquer l'icône et la couleur du point d'intérêt
  */
  useEffect(() => {
    setIconInfos(getPOIInfosByType(type));
  }, []);

  return (
    <View
      style={[
        isSelected ? styles.isSelected : styles.isNotSelected,
        !isSelected && { backgroundColor: iconInfos.color },
        styles.container,
      ]}
    >
      <Text style={styles.icon}>{iconInfos.icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 99,
    width: 25,
    height: 25,
  },
  icon: {
    color: WHITE,
  },
  isSelected: {
    backgroundColor: SENTIERS_RED,
    borderColor: SENTIERS_RED,
  },
  isNotSelected: {
    borderColor: WHITE,
  },
});
