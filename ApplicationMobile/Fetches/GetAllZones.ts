/*
Cette fonction permet réduire le nombre d'appels qu'auraient occasionnés une base de données noSQL tel Firebase.
On reçoit toutes les zones disponibles et le nombre de cartes par zone. 
*/

import { ERROR } from "../Utils/Constants";
import { SERVER_URI } from "../Utils/ServerUris";
import { ZoneSummary } from "./../types";
export default async function GetAllZones(): Promise<ZoneSummary[]> {
  var jsonReceived;

  try {
    const response = await fetch(SERVER_URI.getAllZonesSummary, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    });

    if (response.status !== 200) {
      throw ERROR.server_is_unreeachable;
    }
    const json = await response.json();
    return json as ZoneSummary[];
  } catch (error) {
    console.error(error);
  }
}
