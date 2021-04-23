import { Coordinate } from "./coordinatemodel";
import { InterestPointData } from "./interestpointdatamodel";

/**
 * Les types de points qui sont possible d'utiliser. Nous pourrons appliquer des comportements à l'application en
 * fonction du type de point.
 */
export enum InterestType {
  service = "service",
  summit = "summit",
  view = "view",
  nature = "nature",
  parking = "parking",
  restroom = "restroom",
  camping = "camping",
  telephone = "telephone",
  picnic = "picnic",
  refuge = "refuge",
  hosting = "hosting",
  unknown = "unknown",
}

export function getInterestType(x: string): InterestType {
  return (InterestType as any)[x];
}

/**
 * Modèle de donnée pour un point d'intérêt
 *
 * Relations:
 *   InterestPoint -N---|- UserMap
 *
 *   InterestPoint -|---|- Coordinate
 */
export class InterestPoint {
  // Attributes
  name: string;
  description: string;
  type: InterestType;
  uri?: string[];
  active?: boolean;
  code: string;

  // Relations
  coordinate: Coordinate;
  data: Array<InterestPointData>;

  constructor(
    name: string,
    description: string,
    type: InterestType,
    coordinate: Coordinate,
    code: string,
    active = true
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.coordinate = coordinate;
    this.data = new Array<InterestPointData>();
    this.code = code;
    this.active = active;
  }

  /**
   * Retourne un objet InterestPoint à partir d'un objet UserMap
   *
   * params:
   *   interestPoints: L'attribut 'interestPoint' de la classe 'UserMap'
   *   sentierName: L'ID du sentier que l'on veut obtenir
   */
  static getFromObjectModel(
    interestPoints: Array<InterestPoint>,
    interest_id: string
  ) {
    var index = interestPoints
      .map(function (x) {
        return x.name;
      })
      .indexOf(interest_id);
    var sentier = interestPoints[index];

    return sentier;
  }

  static getTypeFromString(type: string) {
    switch (type) {
      case "Parking":
        return InterestType.parking;
      case "Point de vue":
        return InterestType.view;
      case "TÃ©lÃ©phone":
        return InterestType.telephone;
      case "Piquenique":
        return InterestType.picnic;
      case "Camping rustique" || "Camping":
        return InterestType.camping;
      case "Refuge":
        return InterestType.refuge;
      case "HÃ©bergement":
        return InterestType.hosting;
      case "Toilettes":
        return InterestType.restroom;
      default:
        return InterestType.unknown;
    }
  }

  toJson() {
    let jsonObjectT: any = {};
    jsonObjectT["name"] = this.name;
    jsonObjectT["description"] = this.description;
    jsonObjectT["type"] = this.type;
    if (this.uri !== undefined) {
      jsonObjectT["uri"] = this.uri;
    }
    jsonObjectT["active"] = this.active;
    if (this.code !== undefined) {
      jsonObjectT["code"] = this.code;
    }
    jsonObjectT["coordinate"] = this.coordinate;
    jsonObjectT["data"] = this.data;

    return jsonObjectT;
  }
}
