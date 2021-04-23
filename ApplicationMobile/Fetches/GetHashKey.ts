import { AppAccessType } from "../types";
import { SERVER_URI } from "../Utils/ServerUris";

export default async function GetHashKey(
  loginType: AppAccessType
): Promise<string> {
  var content: any = { data: loginType };
  // construction de la request

  try {
    return fetch(SERVER_URI.sendUID, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error(error);
  }
}
