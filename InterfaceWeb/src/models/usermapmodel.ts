import { Coordinate } from "./coordinatemodel";
import { InterestPoint } from "./interestpointsmodel";
import { Trail } from "./trailmodel";

/**
 * Modèle de donnée pour une carte
 *
 * Relations:
 *   UserMap -N---|- Zone
 *
 *   UserMap -|---N- Trail
 *   UserMap -|---N- InterestPoint
 */
export class UserMap {
  // Attributes
  name: string;
  map_file: string;
  topLeftCoordinate: Coordinate;
  topRightCoordinate: Coordinate;
  bottomLeftCoordinate: Coordinate;
  bottomRightCoordinate: Coordinate;

  // Relations
  trails: Map<string, Trail>;
  pointsOfInterest: Map<string, InterestPoint>;

  constructor(
    name: string,
    map_file: string,
    topLeftCoordinate: Coordinate,
    topRightCoordinate: Coordinate,
    bottomLeftCoordinate: Coordinate,
    bottomRightCoordinate: Coordinate
  ) {
    this.name = name;
    this.map_file = map_file;
    this.trails = new Map<string, Trail>();
    this.pointsOfInterest = new Map<string, InterestPoint>();
    this.topLeftCoordinate = topLeftCoordinate;
    this.topRightCoordinate = topRightCoordinate;
    this.bottomLeftCoordinate = bottomLeftCoordinate;
    this.bottomRightCoordinate = bottomRightCoordinate;
  }

  /**
   * Retourne un objet UserMap à partir d'un objet Zone
   *
   * params:
   *   userMaps: L'attribut 'maps' de la classe 'Zone'
   *   userMapName: L'ID de la carte que l'on veut obtenir
   */
  static getFromObjectModel(usermaps: Array<UserMap>, userMapName: string) {
    var index = usermaps
      .map(function (x) {
        return x.name;
      })
      .indexOf(userMapName);
    var usermap = usermaps[index];

    return usermap;
  }

  toJson() {
    let a: any[] = [];

    let b: any[] = [];

    let jsonObject: any = {};
    jsonObject["name"] = this.name;
    jsonObject["map_file"] = this.map_file;
    jsonObject["topLeftCoordinate"] = this.topLeftCoordinate;
    jsonObject["topRightCoordinate"] = this.topRightCoordinate;
    jsonObject["bottomLeftCoordinate"] = this.bottomLeftCoordinate;
    jsonObject["bottomRightCoordinate"] = this.bottomRightCoordinate;
    this.trails.forEach((value: Trail) => {
      a.push(value.toJson());
    });

    if (a.length !== 0) {
      jsonObject["trails"] = a;
    }

    this.pointsOfInterest.forEach((value: InterestPoint) => {
      b.push(value.toJson());
    });
    if (b.length !== 0) {
      jsonObject["pointsOfInterest"] = b;
    }
    return jsonObject;
  }
}
