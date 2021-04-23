/*
Comprend les fonctions nécessaires au bon fonctionnement du MapScreen
*/
import { Region } from "react-native-maps";
import { Coordinate, Trail, UserMap } from "./../types";

//En bref: trouve le poin moyen des 4 coordonnées de coin d'une carte
export function CalculateCentralPoint(map: UserMap): Region {
  const latitude =
    (map.topLeftCoordinate.latitude +
      map.topRightCoordinate.latitude +
      map.bottomLeftCoordinate.latitude +
      map.bottomRightCoordinate.latitude) /
    4;
  const longitude =
    (map.topLeftCoordinate.longitude +
      map.topRightCoordinate.longitude +
      map.bottomLeftCoordinate.longitude +
      map.bottomRightCoordinate.longitude) /
    4;
  return { latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.05 };
}
