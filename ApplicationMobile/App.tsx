import { Root } from "native-base";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Navigation from "./Navigation";

//Point d'entrée de l'application
export default function App(): JSX.Element {
  return (
    <View style={styles.container}>
      {/* Root est nécessaire pour utiliser les ToasMessage */}
      <Root>
        <Navigation />
      </Root>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
