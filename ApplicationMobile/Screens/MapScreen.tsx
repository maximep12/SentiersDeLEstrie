/*
Point central de l'application: la carte.
*/
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import MapInfoPreview from "../Components/MapInfoPreview";
import MapPoiPreview from "../Components/MapPoiPreview";
import MapTrailPreview from "../Components/MapTrailPreview";
import POIDisplayer from "../Components/POIDisplayer";
import Spinner from "../Components/Spinner";
import TrailDisplayer from "../Components/TrailDisplayer";
import { AppStackParamList } from "../Navigation";
import { PointOfInterest, Trail, UserMap } from "../types";
import { SENTIERS_GREY, SENTIERS_RED, WHITE } from "../Utils/Colors";
import { CalculateCentralPoint } from "./MapScreen.utils";
import { AntDesign } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../Utils/Constants";
import * as ExpoLocation from "expo-location";
import PointSearcher from "../Components/PointSearcher";

type MapScreenNavigationProp = StackNavigationProp<AppStackParamList, "Map">;

type MapListScreenRouteProp = RouteProp<AppStackParamList, "Map">;

type Props = {
  navigation: MapScreenNavigationProp;
  route: MapListScreenRouteProp;
};

export default function MapScreen({ navigation, route }: Props): JSX.Element {
  const map: UserMap = route.params.map;
  const [initialCentralPoint, setInitialCentralPoint] = useState<Region>();
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false);
  const [visibleRegion, setVisibleRegion] = useState<Region>();
  const [selectedTrail, setSelectedTrail] = useState<Trail>();
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest>();
  const [activePois, setActivePois] = useState<PointOfInterest[]>([]);
  const [activeTrails, setActiveTrails] = useState<Trail[]>([]);
  const DEFAULT_LATITUDE_DELTA = 0.2;
  const DEFAULT_LONGITUDE_DELTA = 0.2;

  // En utilisant la carte re??ue en props, on va indiquer la position initiale ?? afficher
  useEffect(() => {
    setInitialCentralPoint(CalculateCentralPoint(map));
    if (map.pointsOfInterest) {
      setActivePois(map.pointsOfInterest.filter((poi) => poi.active === true));
    }
    if (map.trails) {
      setActiveTrails(map.trails.filter((trail) => trail.active === true));
    }
  }, []);

  //Ce useEffect va permettre la gestion de l'ouverture ou la fermeture du bloc permettant la recherche d'un point par son code
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setOpenSearchBar(!openSearchBar);
          }}
          style={{ marginRight: 10 }}
        >
          <AntDesign
            name={openSearchBar ? "close" : "search1"}
            size={24}
            color={WHITE}
          />
        </TouchableOpacity>
      ),
    });
  });

  /*
  Ce useEffect demande la permission ?? l'utilisateur d'utiliser sa position. 
  Si il refuse, sa position ne sera pas affich??e sur la carte.
  */
  useEffect(() => {
    (async () => {
      await ExpoLocation.requestPermissionsAsync();
    })();
  }, []);

  //G??re lorsqu'un sentier est touch??
  function trailWasTouched(trail: Trail) {
    //D??s??lectionne un point d'int??r??t
    setSelectedPoi(undefined);

    //S??lectionne le sentier
    setSelectedTrail(trail);
  }

  //G??re lorsqu'un point d'int??r??t est touch??
  function poiWasTouched(point: PointOfInterest) {
    //D??s??lectionne un sentier
    setSelectedTrail(undefined);

    //S??lectionne le point d'int??r??t
    setSelectedPoi(point);
  }

  //En attendant le calcul du point central, va afficher un indicateur de travail
  if (!initialCentralPoint) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner color={SENTIERS_RED} backgroundColor={SENTIERS_GREY} />
      </View>
    );
  }

  return (
    /* Sans le KeyboardAvoidingView, sur IOS, lorsqu'on ouvre le clavier, il vient couvrir les champs */
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : null}>
      <View style={styles.map}>
        {/* Sur IOS, l'API de carte semble faire constamment des mises ?? jour de sa position 
        si on ne lui indique pas qu'il est dans un SafeAreaView. Jusqu'?? preuve du contraire, 
        ces balises doivent rester. */}
        {Platform.OS === "ios" ? (
          <SafeAreaView style={styles.container}>
            <MapView
              style={[
                styles.map,
                //On redimensionne la carte pour permettre l'acc??s au preview d'appara??tre
                { height: selectedPoi || selectedTrail ? "66%" : "100%" },
              ]}
              provider={"google"}
              mapType={"satellite"}
              onPress={() => {
                //Lorsqu'on clique sur la carte, on d??s??lectionne le point d'int??r??t et le sentier
                setSelectedPoi(undefined);
                setSelectedTrail(undefined);
              }}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton
              showsBuildings={false}
              showsScale
              moveOnMarkerPress={true}
              onMarkerPress={() => null}
              showsCompass
              onRegionChangeComplete={(region) => setVisibleRegion(region)}
              region={{
                latitude: visibleRegion
                  ? visibleRegion.latitude
                  : initialCentralPoint.latitude,
                longitude: visibleRegion
                  ? visibleRegion.longitude
                  : initialCentralPoint.longitude,
                latitudeDelta: visibleRegion
                  ? visibleRegion.latitudeDelta
                  : DEFAULT_LATITUDE_DELTA,
                longitudeDelta: visibleRegion
                  ? visibleRegion.longitudeDelta
                  : DEFAULT_LONGITUDE_DELTA,
              }}
              initialRegion={{
                latitude: initialCentralPoint.latitude,
                longitude: initialCentralPoint.longitude,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA,
              }}
            >
              {activePois.map((poi) => (
                <POIDisplayer
                  key={poi.name}
                  poi={poi}
                  onPress={() => {
                    poiWasTouched(poi);
                  }}
                  isSelected={
                    selectedPoi ? selectedPoi.name === poi.name : false
                  }
                />
              ))}
              {activeTrails.map((trail) => (
                <TrailDisplayer
                  key={trail.name}
                  mapTrail={trail}
                  onPress={() => trailWasTouched(trail)}
                  isSelected={
                    selectedTrail ? selectedTrail.name === trail.name : false
                  }
                />
              ))}
            </MapView>
            <MapInfoPreview>
              <>
                {selectedPoi ? <MapPoiPreview poi={selectedPoi} /> : null}
                {selectedTrail ? (
                  <MapTrailPreview trail={selectedTrail} />
                ) : null}
              </>
            </MapInfoPreview>
          </SafeAreaView>
        ) : (
          <>
            {/* Version Android de la carte. La seule diff??rence est qu'Android n'a pas besoin du SafeAreaView */}
            <MapView
              style={[
                styles.map,
                { height: selectedPoi || selectedTrail ? "66%" : "100%" },
              ]}
              provider={"google"}
              mapType={"satellite"}
              onPress={() => {
                setSelectedPoi(undefined);
                setSelectedTrail(undefined);
              }}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={false}
              showsBuildings={false}
              showsScale
              moveOnMarkerPress={true}
              onMarkerPress={() => null}
              showsCompass
              onRegionChangeComplete={(region) => setVisibleRegion(region)}
              region={{
                latitude: visibleRegion
                  ? visibleRegion.latitude
                  : initialCentralPoint.latitude,
                longitude: visibleRegion
                  ? visibleRegion.longitude
                  : initialCentralPoint.longitude,
                latitudeDelta: visibleRegion
                  ? visibleRegion.latitudeDelta
                  : DEFAULT_LATITUDE_DELTA,
                longitudeDelta: visibleRegion
                  ? visibleRegion.longitudeDelta
                  : DEFAULT_LONGITUDE_DELTA,
              }}
              initialRegion={{
                latitude: initialCentralPoint.latitude,
                longitude: initialCentralPoint.longitude,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA,
              }}
            >
              {map.pointsOfInterest.map((poi) => (
                <POIDisplayer
                  key={poi.name}
                  poi={poi}
                  onPress={() => {
                    poiWasTouched(poi);
                  }}
                  isSelected={
                    selectedPoi ? selectedPoi?.name === poi.name : false
                  }
                />
              ))}
              {map.trails &&
                map.trails.map((trail) => (
                  <TrailDisplayer
                    key={trail.name}
                    mapTrail={trail}
                    onPress={() => trailWasTouched(trail)}
                    isSelected={
                      selectedTrail ? selectedTrail.name === trail.name : false
                    }
                  />
                ))}
            </MapView>
            <MapInfoPreview>
              <>
                {selectedPoi ? <MapPoiPreview poi={selectedPoi} /> : null}
                {selectedTrail ? (
                  <MapTrailPreview trail={selectedTrail} />
                ) : null}
              </>
            </MapInfoPreview>
          </>
        )}
      </View>
      {/* Si l'utilisateur veut trouver un point (a pes?? sur la loupe dans le header) */}
      {openSearchBar && (
        <TouchableWithoutFeedback onPress={() => setOpenSearchBar(false)}>
          <View style={styles.searchSection}>
            <View style={styles.pointSearcherContainer}>
              <PointSearcher
                pointList={map.pointsOfInterest}
                onPointSelected={(touched) => {
                  setOpenSearchBar(false);
                  poiWasTouched(touched);
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: SENTIERS_RED,
  },
  map: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  spinnerContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  searchSection: {
    height: "100%",
    width: SCREEN_WIDTH,
    backgroundColor: "rgba(0,0,0,0.8)",
    top: 0,
    zIndex: 100,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  pointSearcherContainer: {
    backgroundColor: WHITE,
    padding: 10,
    width: "80%",
    height: "60%",
    borderRadius: 5,
  },
});
