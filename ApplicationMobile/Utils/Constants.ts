import { InterestType, Zone } from "./../types";
import { Dimensions } from "react-native";
import Constants from "expo-constants";
//import { getDeviceId } from 'react-native-device-info';

//Fonctions qui retournent les dimensions du téléphones
export const SCREEN_WIDTH = Math.round(Dimensions.get("window").width);
export const SCREEN_HEIGHT = Math.round(Dimensions.get("window").height + 30);

//Valeur permettant de rapprocher ou éloigner le contenu des bordures des appareils
export const HORIZONTAL_PADDING = 15;
//L'appareil a un id bien à lui, va aider à gérer les appels au serveur
export const DEVICE_ID = Constants.deviceId;

export const ERROR = {
  server_is_unreeachable: "Server is unreachable",
  wrong_credentials: "Wrong credentials",
  unknown_error: "Unknown error",
};

export const EXEMPLE: Zone[] = [
  {
    name: "Estrie 1",
    userMaps: [
      {
        name: "Parc du Mont Hatley",
        trails: [
          {
            name: "Le sentier de test",
            description: "Sentier utilisé pour les tests",
            difficulty: 7,
            trailCoordinates: [
              { latitude: 45.303421075112105, longitude: -71.9401984565521 },
              { latitude: 45.30426461885767, longitude: -71.9388715405068 },
              { latitude: 45.30473125468639, longitude: -71.93897361097181 },
              { latitude: 45.30530557043344, longitude: -71.93836118818167 },
              { latitude: 45.30632855594538, longitude: -71.93920326951812 },
              { latitude: 45.30665160016644, longitude: -71.93742979518834 },
              { latitude: 45.30635547636744, longitude: -71.93653667861938 },
              { latitude: 45.3056914355581, longitude: -71.93540114469599 },
              { latitude: 45.30561067330747, longitude: -71.93401043461004 },
              { latitude: 45.30561067330747, longitude: -71.93395939937753 },
              { latitude: 45.305485042911144, longitude: -71.93264524214035 },
            ],
            color: "blue",
          },

          {
            name: "Le deuxième sentier de test",
            description: "Semblable au prermier sentier, mais plus difficile!",
            difficulty: 8,
            trailCoordinates: [
              { latitude: 45.30036637995227, longitude: -71.93724630734854 },
              { latitude: 45.301209496761224, longitude: -71.93624489823183 },
              { latitude: 45.301807141589116, longitude: -71.93642697261667 },
              { latitude: 45.302340747718986, longitude: -71.9351979705189 },
              { latitude: 45.30254351673152, longitude: -71.93328618947791 },
              { latitude: 45.30337592928851, longitude: -71.93275513918876 },
              { latitude: 45.30422967306098, longitude: -71.93120750691747 },
            ],
            color: "yellow",
          },
        ],
        pointsOfInterest: [
          {
            name: "Point #1",
            coordinate: { latitude: 45.305057, longitude: -71.938688 },
            description: "Placeholder du point #1",
            type: InterestType.nature,
            code: "1",
          },
          {
            name: "Point #2",
            coordinate: {
              latitude: 45.30531126636648,
              longitude: -71.93838555483072,
            },
            description: "Placeholder du point #2",
            type: InterestType.nature,
            code: "2",
          },
          {
            name: "Point #3",
            coordinate: {
              latitude: 45.306239404387696,
              longitude: -71.9357248036198,
            },
            description: "Placeholder du point #3",
            type: InterestType.nature,
            code: "3",
          },
          {
            name: "Point #4",
            coordinate: {
              latitude: 45.30665442053733,
              longitude: -71.93853575852812,
            },
            description: "Placeholder du point #4",
            type: InterestType.nature,
            code: "4",
          },
          {
            name: "Point #5",
            coordinate: {
              latitude: 45.30614130921746,
              longitude: -71.93522054832354,
            },
            description: "Placeholder du point #5",
            type: InterestType.nature,
            code: "5",
          },
          {
            name: "Point #6",
            coordinate: {
              latitude: 45.30643559423494,
              longitude: -71.93675477188445,
            },
            description: "Placeholder du point #6",
            type: InterestType.nature,
            code: "6",
          },
          {
            name: "Point #7",
            coordinate: {
              latitude: 45.30097470599807,
              longitude: -71.93724630734854,
            },
            description: "Placeholder du point #7",
            type: InterestType.nature,
            code: "7",
          },
          {
            name: "Point #8",
            coordinate: {
              latitude: 45.30151899219071,
              longitude: -71.9358352308659,
            },
            description: "Placeholder du point #8",
            type: InterestType.nature,
            code: "8",
          },
          {
            name: "Point #9",
            coordinate: {
              latitude: 45.30240478011708,
              longitude: -71.93560763788483,
            },
            description: "Placeholder du point #9",
            type: InterestType.nature,
            code: "9",
          },
          {
            name: "Point #10",
            coordinate: {
              latitude: 45.30230873149282,
              longitude: -71.93334688093952,
            },
            description: "Placeholder du point #10",
            type: InterestType.nature,
            code: "10",
          },
          {
            name: "Point #11",
            coordinate: {
              latitude: 45.303557350915916,
              longitude: -71.93189028586069,
            },
            description: "Placeholder du point #11",
            type: InterestType.nature,
            code: "11",
          },
          {
            name: "Point #12",
            coordinate: {
              latitude: 45.304154970994176,
              longitude: -71.93185994012987,
            },
            description: "Placeholder du point #12",
            type: InterestType.nature,
            code: "12",
          },

          {
            name: "Stationnement principal",
            coordinate: {
              latitude: 45.300093574543816,
              longitude: -71.93583419859225,
            },
            description: "Placeholder du point #12",
            type: InterestType.service,
            code: "13",
          },

          {
            name: "Sommet du Mont Hatley",
            coordinate: {
              latitude: 45.305034737527286,
              longitude: -71.94028751680732,
            },
            description: "Placeholder du point #12",
            type: InterestType.summit,
            code: "14",
          },
        ],
        bottomLeftCoordinate: {
          latitude: 45.303421075112105,
          longitude: -71.9401984565521,
        },
        bottomRightCoordinate: {
          latitude: 45.30422967306098,
          longitude: -71.93120750691747,
        },
        topLeftCoordinate: {
          latitude: 45.30036637995227,
          longitude: -71.93724630734854,
        },
        topRightCoordinate: {
          latitude: 45.305485042911144,
          longitude: -71.93264524214035,
        },
      },
      {
        name: "Parc du Mont-Bellevue",
        trails: [
          {
            description: "Sentier principal de Sherbrooke",
            difficulty: 7,
            name: "Sentier Principal",
            color: "blue",
            trailCoordinates: [
              { latitude: 45.37719480267951, longitude: -71.90882274470378 },
              { latitude: 45.377680620554266, longitude: -71.91109212702807 },
              { latitude: 45.37860669931616, longitude: -71.91424764911706 },
              { latitude: 45.38050435431225, longitude: -71.91902415858053 },
              { latitude: 45.38141520608796, longitude: -71.91936996922041 },
              { latitude: 45.38467718586721, longitude: -71.91578650347317 },
              { latitude: 45.38436807716183, longitude: -71.90864120004582 },
              { latitude: 45.383167992051824, longitude: -71.91151485468508 },
              { latitude: 45.38036769439106, longitude: -71.91146307712401 },
              { latitude: 45.37825828768507, longitude: -71.90990975029197 },
              { latitude: 45.37719480267951, longitude: -71.90882274470378 },
            ],
          },
          {
            description:
              "Sentier menant aux résidences de l'Université de Sherbrooke",
            difficulty: 4,
            name: "Sentier des résidences",
            color: "yellow",
            trailCoordinates: [
              { latitude: 45.37721644891243, longitude: -71.90857620544125 },
              { latitude: 45.37680257614479, longitude: -71.91090197178924 },
              { latitude: 45.3748856522419, longitude: -71.91040580830166 },
              { latitude: 45.37325185898852, longitude: -71.91294864617548 },
              { latitude: 45.372445836930446, longitude: -71.91763118908946 },
              { latitude: 45.372794388419315, longitude: -71.9198019043476 },
              { latitude: 45.37510348777613, longitude: -71.92178655829788 },
              { latitude: 45.376606530092296, longitude: -71.92321302832464 },
              { latitude: 45.378937255832774, longitude: -71.9214144356822 },
              { latitude: 45.38030950736244, longitude: -71.92023604739921 },
              { latitude: 45.38033128886425, longitude: -71.92160049699004 },
            ],
          },
        ],
        pointsOfInterest: [
          {
            name: "Croix du Mont-Bellevue",
            type: InterestType.summit,
            description: "Croix située au sommet du Mont-Bellevue",
            coordinate: {
              latitude: 45.38040580043592,
              longitude: -71.91262420995935,
            },
            code: "14",
          },
          {
            name: "Première remontée",
            type: InterestType.service,
            description: "Premier remonte-pente pour les skieurs",
            coordinate: {
              latitude: 45.38449975973854,
              longitude: -71.90942031547833,
            },
            code: "15",
          },
          {
            name: "Deuxième remontée",
            type: InterestType.service,
            description: "Deuxième remonte-pente pour les skieurs",
            coordinate: {
              latitude: 45.3849495649114,
              longitude: -71.91168808645538,
            },
            code: "16",
          },
          {
            name: "Entrée du parc du Mont-Bellevue",
            type: InterestType.service,
            description: "Stationnement principal pour le parc",
            coordinate: {
              latitude: 45.37721162242497,
              longitude: -71.90865071028522,
            },
            code: "17",
          },
        ],
        bottomLeftCoordinate: {
          latitude: 45.37721221352478,
          longitude: -71.91775985755135,
        },
        bottomRightCoordinate: {
          latitude: 45.37743004009683,
          longitude: -71.9044564740408,
        },
        topLeftCoordinate: {
          latitude: 45.38561913274208,
          longitude: -71.91782290753856,
        },
        topRightCoordinate: {
          latitude: 45.38567130866457,
          longitude: -71.90582513659486,
        },
      },
      {
        name: "map3",
        trails: [],
        pointsOfInterest: [],
        bottomLeftCoordinate: { longitude: 70, latitude: 70 },
        bottomRightCoordinate: { longitude: 70, latitude: 70 },
        topLeftCoordinate: { longitude: 70, latitude: 70 },
        topRightCoordinate: { longitude: 70, latitude: 70 },
      },
      {
        name: "map4",
        trails: [],
        pointsOfInterest: [],
        bottomLeftCoordinate: { longitude: 70, latitude: 70 },
        bottomRightCoordinate: { longitude: 70, latitude: 70 },
        topLeftCoordinate: { longitude: 70, latitude: 70 },
        topRightCoordinate: { longitude: 70, latitude: 70 },
      },
    ],
  },
  { name: "Estrie 2", userMaps: [] },
  { name: "Estrie 3", userMaps: [] },
  { name: "Estrie 4", userMaps: [] },
  { name: "Estrie 5", userMaps: [] },
  { name: "Estrie 6", userMaps: [] },
];
