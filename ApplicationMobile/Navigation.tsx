/*
Comprend l'outil de navigation de l'application. Chaque nouveau screen doit être déclaré dans ce fichier
*/
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import LoginScreen from "./Screens/LoginScreen";
import { t } from "i18n-js";
import { STRINGS_OPTIONS } from "./Utils/Strings";
import { SENTIERS_RED, WHITE } from "./Utils/Colors";
import ZoneListScreen from "./Screens/ZoneListScreen";
import { AppAccessType, PointOfInterest, Trail, UserMap } from "./types";
import MapListScreen from "./Screens/MapListScreen";
import MapScreen from "./Screens/MapScreen";
import InitScreen from "./Screens/InitScreen";

/*
Spécifie pour chaque nouveau screen les paramètres qui seront passés par la route lors de l'appel de ce screen
*/
export type AppStackParamList = {
  Init: undefined;
  Login: { loginType: AppAccessType };
  ZoneList: undefined;
  MapList: { zoneName: string };
  Map: { map: UserMap };
};

export type TypedRouteName = keyof AppStackParamList;

const Stack = createStackNavigator<AppStackParamList>();

/*
Chaque nouveau screen doit être identifié ici. Un nouveau Stack.Screen doit être fourni avec:
  Le nom par lequel il sera appelé pour naviguer vers celui-ci
  Le component qui le décrit
  Les options relatives à celui-ci (souvent le titre, mais possibilité d'en mettre plus) 
*/

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: SENTIERS_RED,
            shadowColor: "none",
          },
          headerTitleStyle: { color: "white" },
          headerTintColor: WHITE,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen
          name="Init"
          component={InitScreen}
          options={{ title: t(STRINGS_OPTIONS.login) }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={({ route }) => ({
            title:
              route.params.loginType === AppAccessType.membership
                ? t(STRINGS_OPTIONS.i_am_member)
                : t(STRINGS_OPTIONS.i_have_a_code),
          })}
        />

        <Stack.Screen
          name="ZoneList"
          component={ZoneListScreen}
          options={{
            title: t(STRINGS_OPTIONS.zone),
          }}
        />
        <Stack.Screen
          name="MapList"
          component={MapListScreen}
          options={{ title: t(STRINGS_OPTIONS.map) }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={({ route }) => ({ title: route.params.map.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
