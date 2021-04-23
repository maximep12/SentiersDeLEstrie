import { CommonActions, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Text,
} from "react-native";
import ListItem from "../Components/ListItem";
import { AppStackParamList } from "../Navigation";
import { ZoneSummary } from "../types";
import { SENTIERS_GREY, SENTIERS_RED, WHITE } from "../Utils/Colors";
import { HORIZONTAL_PADDING } from "../Utils/Constants";
import GetAllZones from "../Fetches/GetAllZones";
import Spinner from "../Components/Spinner";
import { logOutUser } from "../Utils/Storage";
import { Entypo } from "@expo/vector-icons";
import { STRINGS_OPTIONS } from "../Utils/Strings";
import { t } from "i18n-js";
import ActionButton from "../Components/ActionButton";
import ToastMessage from "../Utils/ToastMessage";

type ZoneListScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "ZoneList"
>;

type ZoneListScreenRouteProp = RouteProp<AppStackParamList, "ZoneList">;

type Props = {
  navigation: ZoneListScreenNavigationProp;
  route: ZoneListScreenRouteProp;
};

export default function ZoneListScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const [zones, setZones] = useState<ZoneSummary[]>([]);
  const [serverError, setServerError] = useState<boolean>(false);

  useEffect(() => {
    loadZones();
  }, []);

  function loadZones(): void {
    setServerError(false);
    GetAllZones()
      .then(setZones)
      .catch(() => setServerError(true));
  }

  useEffect(() => {
    (async () => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableHighlight
            underlayColor={"black"}
            onPress={async () => {
              await logOutUser();
              ToastMessage(t(STRINGS_OPTIONS.successfully_logout));
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Init" }],
                })
              );
            }}
          >
            <Entypo
              style={{ paddingRight: 10 }}
              name="log-out"
              size={30}
              color={WHITE}
            />
          </TouchableHighlight>
        ),
      });
    })();
  }, []);

  if (serverError || !zones) {
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
            action={() => loadZones()}
          />
        </View>
      </View>
    );
  } else if (zones.length === 0) {
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
        {zones
          ? zones.map((z) => (
              <ListItem
                key={z.name}
                title={z.name}
                destination={() =>
                  navigation.navigate("MapList", {
                    zoneName: z.name,
                  })
                }
                numberOfmaps={z.mapCount}
              />
            ))
          : null}
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
