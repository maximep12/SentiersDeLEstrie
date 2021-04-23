/*
Cet appel va permettre d'aller chercher toutes les cartes relatives à une zone. 
*/
import { ERROR } from "../Utils/Constants";
import { SERVER_URI } from "../Utils/ServerUris";
import { UserMap } from "./../types";
export default async function GetMapsByZone(
  zoneName: string
): Promise<UserMap[]> {
  var jsonReceived;

  var header = new Headers();
  header.append("pragma", "no-cache");
  header.append("cache-control", "no-cache");

  const myHeader = {
    method: "GET",
    headers: header,
  };

  try {
    await fetch(SERVER_URI.getSpecificZone + zoneName, myHeader)
      .then(async (response) => {
        if (response.status === 200) {
          const json = await response.json();
          jsonReceived = json;
        } else {
          throw ERROR.server_is_unreeachable;
        }
      })
      .catch(function (error) {
        throw error;
      });

    return jsonReceived.maps as UserMap[];
  } catch (error) {
    console.error(error);
    throw { error };
  }
}
