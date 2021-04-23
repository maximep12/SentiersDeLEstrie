import { CompleteModel } from "../models/completemodel";
import { ImportExcelFile } from "../Utils/ImportExcelFile";

/**
 * Méthode avoir un preview du contenu que l'utilisateur veut ajuster sur l'application
 *
 * @param excel Le fichier excel à parser.
 * @returns {Promise <{Promise<boolean>,Promise<CompleteModel>}> }, Vrai si les informations ont reussi à être parsées ainsi que le model resultant.
 */
export default async function sendForPreview(excel: File) {
  var defaultModel = new CompleteModel();
  if (excel.name === "") {
    return {
      isSent: Promise.resolve(false),
      model: Promise.resolve(defaultModel),
    };
  }
  var doneModel = await ImportExcelFile.fetchDataFromExcelFromBrowser(excel);
  if (
    doneModel === undefined ||
    doneModel.zones === undefined ||
    doneModel.zones.size === 0
  ) {
    return {
      isSent: Promise.resolve(false),
      model: Promise.resolve(defaultModel),
    };
  }
  return { isSent: Promise.resolve(true), model: Promise.resolve(doneModel) };
}
