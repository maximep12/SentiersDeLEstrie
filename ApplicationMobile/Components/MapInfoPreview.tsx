/*
Comprend un simple élément qui va permettre un scroll de ses éléments passés en props. Sera utilisé pour afficher les infos
relatives à un sentier ou un point d'intérêt sélectionné
*/
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SENTIERS_RED } from "../Utils/Colors";

type Props = {
  children: JSX.Element;
};

export default function MapInfoPreview({ children }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: SENTIERS_RED,
    padding: 5,
  },

  scrollContent: {
    flexGrow: 1,

    alignItems: "center",
  },

  scrollview: {
    flex: 1,
  },
});
