/*
Plutôt simple, utilisé principalement pour donner un effet de liste. 
Attribut au début d'une ligne et valeur associée à la fin de celle-ci.
*/
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONT_STYLE } from "../Utils/FontStyles";

type Props = {
  title: string;
  value: string | number;
};

export default function RowItem({ title, value }: Props): JSX.Element {
  return (
    <View style={styles.infoIntem}>
      <Text style={FONT_STYLE.REGULAR}>{title + ":"}</Text>
      <Text style={FONT_STYLE.REGULAR}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoIntem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
});
