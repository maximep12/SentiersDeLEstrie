import { AppAccessType } from "./../types";
import { ERROR } from "../Utils/Constants";
import { SERVER_URI } from "../Utils/ServerUris";

var sha1 = require("sha1");

export default async function SendLoginToServer(
  email: string,
  password: string,
  logid: string, // actual logid string
  deviceId: string,
  loginType: AppAccessType, // valeur defaut
  permitNumber: string = null
): Promise<string> {
  var hash: any;
  if (loginType === AppAccessType.membership) {
    hash = sha1(email + sha1(password) + logid);
  } else if (loginType == AppAccessType.code) {
    hash = sha1(email + permitNumber + logid);
  }

  // correspond au AuthStructure.cs sur le serveur
  var content: any = {
    userID: email, //email
    hash: hash, // password
    logID: logid, // hashKey
    deviceID: deviceId, // uid
    loginType: loginType, // membership ou code
    permitNumber: (permitNumber = null), // present si journalier
  };

  type serverResponse = Response & {
    value?: string;
  };

  try {
    var response: serverResponse = await fetch(SERVER_URI.authUser, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson.value;
    } else if (response.status === 400) {
      throw ERROR.server_is_unreeachable;
    } else if (response.status === 401) {
      throw ERROR.wrong_credentials;
    } else {
      throw ERROR.unknown_error;
    }
  } catch (error) {
    console.error(error);
    throw { error };
  }
}
