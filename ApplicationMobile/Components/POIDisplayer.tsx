/*
Comprend l'affichage d'un indicateur de point d'intéret sur le MapScreen (la carte)
*/
import { Marker } from "react-native-maps";
import React from "react";
import { PointOfInterest } from "../types";
import POIIcon from "./POIIcon";

type Props = {
  poi: PointOfInterest;
  onPress: () => void;
  isSelected: boolean;
};

export default function POIDisplayer({
  poi,
  onPress,
  isSelected,
}: Props): JSX.Element {
  return (
    <Marker
      coordinate={poi.coordinate}
      anchor={{ x: 0.1, y: 0.1 }}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
    >
      <POIIcon type={poi.type} isSelected={isSelected} />
    </Marker>
  );
}
