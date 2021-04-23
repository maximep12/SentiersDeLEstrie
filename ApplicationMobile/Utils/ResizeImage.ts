/*
Permet le bon calcul pour ne pas perdre les proportions d'une image
S'assure qu'une image a le bon format pour entrer dans le screen
*/
export function calculateProportions(
  resizedWidth: number,
  resizedHeight: number,
  maxWidth: number
): { resizedWidth: number; resizedHeight: number } {
  let h = resizedHeight;
  let w = resizedWidth;
  const proportions = {
    resizedWidth: w,
    resizedHeight: h,
  };
  const ratio = (w * 100) / maxWidth;
  w = (w / ratio) * 100;

  h = (h / ratio) * 100;
  proportions.resizedWidth = w;
  proportions.resizedHeight = h;
  return proportions;
}
