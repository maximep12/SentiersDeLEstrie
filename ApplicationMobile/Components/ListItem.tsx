/*
Comprend l'affichage des éléments qui défilent sur le ZoneListScreen et le MapListScreen
*/
import { t } from "i18n-js";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PointOfInterest, Trail, UserMap } from "../types";
import { SENTIERS_GREY, SENTIERS_RED, WHITE } from "../Utils/Colors";
import { FONT_STYLE } from "../Utils/FontStyles";
import { STRINGS_OPTIONS } from "../Utils/Strings";
import ActionButton from "./ActionButton";
import RowItem from "./RowItem";

type Props = {
  title: string;
  destination: () => void;
  numberOfmaps?: number;
  trails?: Trail[];
  pointOfInterest?: PointOfInterest[];
};

export default function ListItem({
  title,
  destination,
  numberOfmaps,
  trails,
  pointOfInterest,
}: Props): JSX.Element {
  var activePois: PointOfInterest[];
  var activeTrails: Trail[];

  if (pointOfInterest) {
    activePois = pointOfInterest.filter((poi) => poi.active);
  }
  if (activeTrails) {
    activeTrails = trails.filter((trail) => trail.active);
  }

  return (
    <View style={styles.container}>
      <Text style={[FONT_STYLE.TITLE, { textAlign: "center" }]}>{title}</Text>
      {numberOfmaps !== undefined ? (
        <View style={styles.mapContainer}>
          <RowItem title={t(STRINGS_OPTIONS.maps)} value={numberOfmaps} />
        </View>
      ) : null}

      <View style={styles.mapContainer}>
        {activeTrails ? (
          <RowItem
            title={t(STRINGS_OPTIONS.trails)}
            value={activeTrails.length}
          />
        ) : null}
        {activePois ? (
          <RowItem
            title={t(STRINGS_OPTIONS.points_of_interests)}
            value={activePois.length}
          />
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonPositionner}>
          <ActionButton
            text={t(STRINGS_OPTIONS.see)}
            action={destination}
            color={SENTIERS_RED}
            textColor={WHITE}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SENTIERS_GREY,
    marginBottom: 20,
    width: "100%",
    padding: 10,
    borderRadius: 7,
  },
  buttonContainer: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonPositionner: {
    width: "100%",
    alignItems: "center",
  },
  mapContainer: {
    width: "100%",
    marginBottom: 20,
  },
});
