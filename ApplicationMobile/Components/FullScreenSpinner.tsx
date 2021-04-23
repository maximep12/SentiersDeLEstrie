/*
Comprend le contenu d'un point d'intérêt passé en props. Va afficher tous les informations relatifs à celui-ci
*/
import React from "react";
import { PointOfInterest } from "../types";
import { StyleSheet, View } from "react-native";
import { SENTIERS_GREY, SENTIERS_RED } from "../Utils/Colors";
import Spinner from "./Spinner";

export default function FullScreenSpinner(): JSX.Element {
  return (
    <View style={styles.container}>
      <Spinner color={SENTIERS_GREY} backgroundColor={SENTIERS_RED} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: SENTIERS_RED,
    justifyContent: "center",
    alignItems: "center",
  },
});
