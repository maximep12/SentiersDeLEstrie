/*
Comprend l'affichage d'un indicateur de sentier sur le MapScreen (la carte)
*/
import React from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { Trail } from "../types";
import { SENTIERS_RED } from "../Utils/Colors";

type Props = {
  mapTrail: Trail;
  onPress: () => void;
  isSelected: boolean;
};

export default function TrailDisplayer({
  mapTrail,
  onPress,
  isSelected,
}: Props): JSX.Element {
  return (
    <View>
      <Polyline
        strokeWidth={isSelected ? 4 : 2}
        strokeColor={
          //Si aucune couleur n'est fournie, mettre le sentier en noir
          isSelected ? SENTIERS_RED : mapTrail.color ? mapTrail.color : "black"
        }
        coordinates={mapTrail.trailCoordinates}
        tappable={true}
        onPress={(event) => {
          event.stopPropagation();
          onPress();
        }}
      />
    </View>
  );
}
