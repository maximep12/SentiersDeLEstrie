/*
Comprend le contenu d'un sentier passé en props. Va afficher tous les informations relatifs à celui-ci
*/
import React from "react";
import { Trail } from "../types";
import { StyleSheet, Text, View } from "react-native";
import { SENTIERS_RED, WHITE } from "../Utils/Colors";
import { t } from "i18n-js";
import { STRINGS_OPTIONS } from "../Utils/Strings";

type Props = {
  trail: Trail;
};

export default function MapTrailPreview({ trail }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.descriptionSection}>
        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.description}>
          {t(STRINGS_OPTIONS.difficulty)}: {trail.difficulty}/10
        </Text>
      </View>
      <View style={styles.descriptionSection}>
        <Text style={styles.subtitle}>{t(STRINGS_OPTIONS.description)}</Text>
        <Text style={styles.description}>{trail.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: SENTIERS_RED,
  },
  title: {
    color: WHITE,
    fontSize: 25,
  },
  subtitle: {
    color: WHITE,
    fontSize: 21,
  },
  description: {
    color: WHITE,
    fontSize: 16,
  },
  splitterContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  descriptionSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: WHITE,
  },
});
