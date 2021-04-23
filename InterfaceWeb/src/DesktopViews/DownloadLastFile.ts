import { DatabaseUtils } from "../Utils/DatabaseUtils";

/**
 *
 * Méthode pour télécharger le dernier Excel utilisé pour mettre à jour l'aplication.
 * @returns {boolean} Vrai si le fichier a été téléchargé. Faux si le fichier n'a pas été téléchargé.
 */
export function downloadFile(): boolean {
  return DatabaseUtils.downloadFile();
}

/**
 * Méthode pour avoir la date du dernier update.
 * @returns {Promise<string>} La date et l'heure de la dernière mise à jour.
 */
export async function getLastUpdatedDate(): Promise<string> {
  return await DatabaseUtils.getDateFromAppStatus();
}
