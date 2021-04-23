import { CompleteModel } from "../models/completemodel";

export class DatabaseUtils {
  /**
   * La fonction permet d'envoyer sur le serveur le model et le excel servant à mettre à jour l'application mobile.
   * @param excel le fichier excel complet ayant servi à mettre jour l'application mobile.
   * @param model le model représentant le contenu du excel.
   * @returns un message d'erreur si une erreur est survenue, null sinon
   */
  static async sendModelToServer(excel: File, model: CompleteModel) {
    var e = null;
    try {
      // envoyer le json
      var response = await DatabaseUtils.postRequestToServer(
        JSON.stringify(model.toJson()),
        false
      );
      if (response === 200) {
        // envoyer le excel
        response = await DatabaseUtils.postRequestToServer(excel, true);
        if (response === 200) {
          return e;
        }
      }
      return " Le statut de la réponse HTTP éronée est : " + response;
    } catch (err) {
      e = err;
      console.log(e);
    }

    return e;
  }

  /**
   * La fonction qui fait une requête POST au serveur.
   * @param toSend le contenu à envoyer.
   * @param isExcel boolean indiquant si le contenu à envoyer est un fichier ou non.
   * @returns {Promise<number>} le statut de la réponse
   */
  static async postRequestToServer(
    toSend: any,
    isExcel: boolean
  ): Promise<number> {
    var formdata = toSend;
    var requestHeaders;

    var destinationUri =
      "http://sentiersest.web810.discountasp.net/updateAppContent";

    if (isExcel) {
      formdata = new FormData();
      formdata.append("spreadsheet", toSend);
      destinationUri = "http://sentiersest.web810.discountasp.net/uploadFile";
      requestHeaders = {
        Accept: "*/*",
      };
    } else {
      requestHeaders = {
        "Content-Type": "application/json",
      };
    }

    var requestOptions: RequestInit = {
      method: "POST",
      headers: requestHeaders,
      body: formdata,
    };
    try {
      var response = await fetch(destinationUri, requestOptions);
      return response.status;
    } catch (error) {
      throw error;
    }
  }

  /**
   * La fonction qui permet d'obtenir les informations de la dernière mise à jour de l'application mobile.
   * @returns {Promise<string>} la date de la dernière mise à jour de l'application mobile.
   */
  static async getDateFromAppStatus(): Promise<string> {
    try {
      var requestOptions = {
        method: "GET",
      };
      var response = await fetch(
        "http://sentiersest.web810.discountasp.net/getStatus",
        requestOptions
      );
      return response.text();
    } catch (error) {
      throw error;
    }
  }

  /**
   * La fonction qui permet de télécharger le dernier excel servant à mettre à jour l'application mobile.
   * @returns {boolean} Vrai si le téléchargement a été effectué, faux sinon.
   */
  static downloadFile(): boolean {
    try {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
      a.href = "http://sentiersest.web810.discountasp.net/downloadFile";
      a.click();
      window.URL.revokeObjectURL(
        "http://sentiersest.web810.discountasp.net/downloadFile"
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
