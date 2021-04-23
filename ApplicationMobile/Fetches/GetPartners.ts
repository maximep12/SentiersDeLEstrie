import { ERROR } from "../Utils/Constants";
import { SERVER_URI } from "../Utils/ServerUris";
import { Partner } from "./../types";
export default async function GetPartners(): Promise<Partner[]> {
  try {
    var jsonReceived;
    const response: Response = await fetch(SERVER_URI.getPartners);
    /*
    Statuts:
    200 -> La requete est ok et il y a des partenaires
    204 -> La requete est ok et il n'y a pas de partenaires
    */
    if (response.status === 200) {
      jsonReceived = response.json();
      return jsonReceived as Partner[];
    } else if (response.status === 204) {
      return [];
    } else {
      throw ERROR.server_is_unreeachable;
    }
  } catch (error) {
    console.error(error);
  }
}
