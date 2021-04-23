import { Coordinate } from "./coordinatemodel";

/**
 * Modèle de donnée pour un Sentier
 *
 * Relations:
 *   Sentier -N---|- UserMap
 *
 *   Sentier -|---N- Coordinate
 */
export class Trail {
  // Attributes
  name: string;
  description: string | undefined;
  difficulty: number;
  uri?: string[];
  active?: boolean;
  color?: string;

  // Relations
  trailCoordinates: Coordinate[];

  constructor(
    name: string,
    description: string | undefined,
    difficulty: number,
    active: boolean = true,
    color = "black"
  ) {
    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.color = color;
    this.trailCoordinates = Array<Coordinate>();
    this.active = active;
  }

  /** Ajoute un point au sentier */
  addPoint(point: Coordinate) {
    this.trailCoordinates.push(point);
  }

  /**
   * Retourne un objet Sentier à partir d'un objet UserMap
   *
   * params:
   *   sentiers: L'attribut 'sentiers' de la classe 'UserMap'
   *   sentierName: L'ID du sentier que l'on veut obtenir
   */
  static getFromObjectModel(sentiers: Array<Trail>, sentierName: string) {
    var index = sentiers
      .map(function (x) {
        return x.name;
      })
      .indexOf(sentierName);
    var sentier = sentiers[index];

    return sentier;
  }

  toJson() {
    let jsonObjectT: any = {};
    jsonObjectT["name"] = this.name;
    jsonObjectT["description"] = this.description;
    jsonObjectT["difficulty"] = this.difficulty;
    if (this.uri !== undefined) {
      jsonObjectT["uri"] = this.uri;
    }
    jsonObjectT["active"] = this.active;
    if (this.color !== undefined) {
      jsonObjectT["color"] = this.color;
    }
    jsonObjectT["trailCoordinates"] = this.trailCoordinates;
    return jsonObjectT;
  }
}
