/**
 * Les types de données qui sont possible d'utiliser.
 */
export enum DataType {
  video = "video",
  image = "image",
  texte = "texte",
}

export function getDataType(x: string): DataType {
  return (DataType as any)[x];
}

/**
 * Modèle de donnée pour les fichiers et le texte associé à un point d'intérêt.
 *
 * Relations:
 *   InterestPointData -N---|-InterestPoint
 */
export class InterestPointData {
  // Attributes
  type: DataType;
  data: string;

  constructor(type: DataType, data: string) {
    this.type = type;
    this.data = data;
  }
}
