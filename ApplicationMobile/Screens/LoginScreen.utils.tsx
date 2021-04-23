/*
Fonction qui s'assure qu'un code de permis journalier est encore valide.
Vérifie que l'activation de ce code date de moins de 24h
*/
export default function userPassIsStillAvailable(
  today: any,
  lastLogin: any
): boolean {
  return Math.abs(today - lastLogin) / 36e5 < 24;
}
