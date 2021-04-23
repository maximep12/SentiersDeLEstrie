/*
Comprend l'affichage de toutes les cartes disponibles pour une zone précisée en Props.
*/
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { t } from "i18n-js";
import { Text } from "native-base";
import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ActionButton from "../Components/ActionButton";
import ListItem from "../Components/ListItem";
import Spinner from "../Components/Spinner";
import GetMapsByZone from "../Fetches/GetMapsByZone";
import { AppStackParamList } from "../Navigation";
import { UserMap } from "../types";
import { SENTIERS_GREY, SENTIERS_RED, WHITE } from "../Utils/Colors";
import { HORIZONTAL_PADDING } from "../Utils/Constants";
import { STRINGS_OPTIONS } from "../Utils/Strings";

type MapListScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "MapList"
>;

type MapListScreenRouteProp = RouteProp<AppStackParamList, "MapList">;

type Props = {
  navigation: MapListScreenNavigationProp;
  route: MapListScreenRouteProp;
};

export default function MapListScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const zoneName: string = route.params.zoneName;

  const [userMaps, setMaps] = useState<UserMap[]>([]);
  const [serverError, setServerError] = useState<boolean>(false);

  useEffect(() => {
    loadMaps();
  }, []);

  function loadMaps(): void {
    setServerError(false);
    GetMapsByZone(zoneName)
      .then(setMaps)
      .catch(() => setServerError(true));
  }

  if (serverError) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={styles.errorMessage}>
          {t(STRINGS_OPTIONS.error_occured)}
        </Text>
        <View style={styles.buttonContainer}>
          <ActionButton
            textColor={WHITE}
            color={SENTIERS_RED}
            text={t(STRINGS_OPTIONS.retry)}
            action={() => loadMaps()}
          />
        </View>
      </View>
    );
  } else if (userMaps.length === 0) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner color={SENTIERS_RED} backgroundColor={SENTIERS_GREY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.scrollContent}
      >
        {userMaps.map((map) => (
          <ListItem
            key={map.name}
            title={map.name}
            destination={() => navigation.navigate("Map", { map })}
            pointOfInterest={map.pointsOfInterest ? map.pointsOfInterest : []}
            trails={map.trails}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    height: "100%",
    width: "100%",
    paddingTop: 30,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: "space-between",
  },

  scrollContent: {
    flexGrow: 1,
  },

  scrollview: {
    flex: 1,
  },

  spinnerContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    color: "green",
  },

  errorMessage: {
    color: SENTIERS_RED,
    textAlign: "center",
  },
  buttonContainer: {
    width: "60%",
    marginTop: 10,
  },
});
