/*
Gestion des données gardées en mémoire dans l'appareil de l'utilisateur
*/
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppAccessType, LoginStatus } from "../types";

//Connexion de l'utilisateur
export async function storeLogInUser(loginType: AppAccessType, token: string) {
  const loginInfos: LoginStatus = {
    isLogged: true,
    lastLogin: new Date(),
    loginType: loginType,
    customToken: token,
  };

  await AsyncStorage.setItem("loginState", JSON.stringify(loginInfos));
}

//Reconnecte un utilisateur avec la date d'activation de code
export async function storeLogInUserByDate(date: Date, token: string) {
  const loginInfos: LoginStatus = {
    isLogged: true,
    lastLogin: date,
    loginType: AppAccessType.code,
    customToken: token,
  };

  await AsyncStorage.setItem("loginState", JSON.stringify(loginInfos));
}

//Déconnecte l'utilisateur
export async function logOutUser() {
  const status = await getLoginStatus();

  const loginInfos: LoginStatus = {
    isLogged: false,
    lastLogin: status.lastLogin,
    loginType: status.loginType,
    customToken: null,
  };

  await AsyncStorage.setItem("loginState", JSON.stringify(loginInfos));
}

//Retourne le statut de connection d'un utilisateur
export async function getLoginStatus(): Promise<LoginStatus> {
  return AsyncStorage.getItem("loginState").then((obj) => {
    if (obj) {
      return JSON.parse(obj);
    } else {
      return {
        isLogged: false,
        lastLogin: new Date(),
        loginType: AppAccessType.membership,
      };
    }
  });
}

//Retourne le statut de connection d'un utilisateur
export async function setSessionId(): Promise<LoginStatus> {
  return AsyncStorage.getItem("sessionId").then((obj) => {
    if (obj) {
      return JSON.parse(obj);
    } else {
      return {
        isLogged: false,
        lastLogin: new Date(),
        loginType: AppAccessType.membership,
      };
    }
  });
}
