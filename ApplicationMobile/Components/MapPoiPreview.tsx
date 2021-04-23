/*
Comprend le contenu d'un point d'intérêt passé en props. Va afficher tous les informations relatifs à celui-ci
*/
import React from "react";
import { PointOfInterest } from "../types";
import { StyleSheet, Text, View } from "react-native";
import { SENTIERS_RED, WHITE } from "../Utils/Colors";
import { t } from "i18n-js";
import { STRINGS_OPTIONS } from "../Utils/Strings";

type Props = {
  poi: PointOfInterest;
};

export default function MapPoiPreview({ poi }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.descriptionSection}>
        <Text style={styles.title}>{poi.name}</Text>
        <Text style={styles.description}>
          {t(STRINGS_OPTIONS.type) +
            ": " +
            t(poi.type.toString().toLocaleLowerCase())}
        </Text>
        <Text style={styles.description}>
          {t(STRINGS_OPTIONS.referenceNumber)}: {poi.code}
        </Text>
      </View>
      <View style={styles.descriptionSection}>
        <Text style={styles.subtitle}>{t(STRINGS_OPTIONS.description)}</Text>
        <Text style={styles.description}>{poi.description}</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>{t(STRINGS_OPTIONS.coordinates)}</Text>
        <View style={styles.splitterContainer}>
          <Text style={styles.description}>{t(STRINGS_OPTIONS.latitude)}:</Text>
          <Text style={styles.description}>
            {poi.coordinate.latitude.toString()}
          </Text>
        </View>
        <View style={styles.splitterContainer}>
          <Text style={styles.description}>
            {t(STRINGS_OPTIONS.longitude)}:
          </Text>
          <Text style={styles.description}>
            {poi.coordinate.longitude.toString()}
          </Text>
        </View>
        {poi.coordinate.altitude ? (
          <View style={styles.splitterContainer}>
            <Text style={styles.description}>
              {t(STRINGS_OPTIONS.altitude)}:
            </Text>
            <Text style={styles.description}>
              {poi.coordinate.altitude.toString()}
            </Text>
          </View>
        ) : null}
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
