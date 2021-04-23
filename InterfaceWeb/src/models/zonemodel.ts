import { UserMap } from "./usermapmodel";

/**
 * Modèle de donnée pour une zone.
 *
 * Relations:
 *   Zone -|---N- UserMap
 */
export class Zone {
  // Attributes
  _id: string; // nom de la zone

  // Relations
  maps: Map<string, UserMap>;

  constructor(name: string) {
    this._id = name;
    this.maps = new Map<string, UserMap>();
  }

  toJson() {
    let a: any[] = [];
    let jsonObject: any = {};
    jsonObject["_id"] = this._id;
    if (this.maps.size !== undefined) {
      this.maps.forEach((value: UserMap) => {
        a.push(value.toJson());
      });
    }

    jsonObject["maps"] = a;

    return jsonObject;
  }
}
