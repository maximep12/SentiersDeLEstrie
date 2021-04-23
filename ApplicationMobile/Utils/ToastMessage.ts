/*
Comprend un message qui apparaît brièvement dans le bas de l'écran.
*/
import { Toast } from "native-base";
import { BLACK, SENTIERS_RED, WHITE } from "./Colors";

//Si la durée n'est pas précisée, le message apparaîtra pour 3 secondes
export default function ToastMessage(message: string, duration = 3000): void {
  Toast.show({
    duration,
    text: message,
    textStyle: {
      color: WHITE,
      textAlign: "center",
    },
    style: {
      backgroundColor: SENTIERS_RED,
      padding: 10,
      borderRadius: 25,
      margin: 15,
    },
  });
}
