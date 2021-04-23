import { Partner } from "./partner";
import { Zone } from "./zonemodel";

/**
 * Contient l'ensemble du modèle de données dans un objet typescript
 */
export class CompleteModel {
  zones: Map<string, Zone>;
  partners: Array<Partner>;

  constructor() {
    this.zones = new Map<string, Zone>();
    this.partners = new Array<Partner>();
  }

  toJson() {
    let jsonObject: any = {};
    let a: any[] = [];
    this.zones.forEach((value: Zone) => {
      a.push(value.toJson());
    });
    jsonObject["zones"] = a;
    jsonObject["partners"] = this.partners;

    return jsonObject;
  }
}
