import { CompleteModel } from "../models/completemodel";
import { DatabaseUtils } from "../Utils/DatabaseUtils";

/**
 * Méthode pour confirmer la mise à jour de l'application selon le preview.
 *
 * @param excel Le fichier excel à envoyer sur le serveur..
 * @param model Le model à envoyer sur le serveur.
 * @returns {Promise<boolean>} vrai si les informations ont été envoyées au serveur.
 */
export async function sendForUpdate(
  excel: File,
  model: CompleteModel
): Promise<boolean> {
  var error = await DatabaseUtils.sendModelToServer(excel, model);
  if (error === null) {
    return Promise.resolve(true);
  } else {
    console.log("Erreur lors de l'envoi sur le serveur. " + error);
    return Promise.resolve(false);
  }
}
