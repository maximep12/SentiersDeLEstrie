/*
Comprend un indicateur pour l'utliisateur que sa requête est en cours de traîtement.
On peut y passer sa couleur et la couleur de l'arrière plan
*/
import React from "react";
import { ActivityIndicator, View } from "react-native";

type Props = {
  color: string;
  backgroundColor: string;
};

export default function Spinner({
  color,
  backgroundColor: background,
}: Props): JSX.Element {
  return (
    <View style={{ backgroundColor: background }}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}
