import { CompleteModel } from "./completemodel";
import { Coordinate } from "./coordinatemodel";
import { InterestPointData } from "./interestpointdatamodel";
import { InterestPoint } from "./interestpointsmodel";
import { Trail } from "./trailmodel";
import { UserMap } from "./usermapmodel";

/**
 * Classe pour écrire des requêtes noSQL
 */
export class Queries {
  /**
   * Retourne un objet Zone à partir du modèle objet complet.
   *
   * @param model Le modèle de donnée complet en objet.
   * @param zoneName L'ID de la zone que l'on veut obtenir.
   * @returns un objet Zone.
   */
  static getZoneFromObjectModel(model: CompleteModel, zoneName: string) {
    let z = model.zones.get(zoneName);
    if (z === undefined) {
      throw new Error("zone inexistant: " + zoneName);
    }
    return z;
  }

  /**
   * Retourne un objet UserMap à partir d'un objet CompleteModel.
   *
   * @param model Le modèle de donnée complet en objet.
   * @param zoneName L'ID de la zone contenant le UserMap.
   * @param userMapName L'ID de la carte contenannt le UserMap.
   * @returns un objet UserMap.
   */
  static getUserMapFromObjectModel(
    model: CompleteModel,
    zoneName: string,
    userMapName: string
  ) {
    let z = model.zones.get(zoneName);
    if (z === undefined) {
      throw new Error("zone inexistante: " + zoneName);
    }

    let um = z.maps.get(userMapName);
    if (um === undefined) {
      throw new Error("carte inexistante: " + userMapName);
    }

    return um;
  }

  /**
   * Retourne un objet Sentier à partir d'un objet CompleteModel.
   *
   * @param model Le modèle de donnée complet en objet.
   * @param zoneName L'ID de la zone contenant le sentier.
   * @param userMapName L'ID de la carte contenant le sentier.
   * @param sentierName L'ID du sentier que l'on veut obtenir.
   * @returns un objet Sentier.
   */
  static getTrailFromObjectModel(
    model: CompleteModel,
    zoneName: string,
    userMapName: string,
    trailName: string
  ) {
    let z = model.zones.get(zoneName);
    if (z === undefined) {
      throw new Error("zone inexistante: " + zoneName);
    }

    let um = z.maps.get(userMapName);
    if (um === undefined) {
      throw new Error("carte inexistante: " + userMapName);
    }

    let t = um.trails.get(trailName);
    if (t === undefined) {
      throw new Error("sentier inexistant: " + trailName);
    }
    return t;
  }

  /**
   * Retourne un objet InterestPoint à partir d'un objet CompleteModel.
   *
   * @param model Le modèle de donnée complet en objet.
   * @param zoneName L'ID de la zone contenant le point d'interet.
   * @param userMapName L'ID de la carte contenant le point d'interet.
   * @param interest_id L'ID du point d'interet que l'on veut.
   * @returns un objet InterestPoint.
   */
  static getInterestPointsFromObjectModel(
    model: CompleteModel,
    zoneName: string,
    userMapName: string,
    interest_id: string
  ) {
    let z = model.zones.get(zoneName);
    if (z === undefined) {
      throw new Error("zone inexistante: " + zoneName);
    }

    let um = z.maps.get(userMapName);
    if (um === undefined) {
      throw new Error("carte inexistante: " + userMapName);
    }

    let poi = um.pointsOfInterest.get(interest_id);
    if (poi === undefined) {
      throw new Error("point d'interet inexistant: " + interest_id);
    }

    return poi;
  }

  /**
   * Insère un objet UserMap à partir d'un objet CompleteModel.
   *
   * @param model_by_ref Le modèle de donnée complet en objet, passé par référence.
   * @param value L'objet UserMap que l'on veut insérer dans le modèle.
   * @param key Les clés étrangères qui définissent un UserMap.
   */
  static insertUserMapInZoneMaps(
    model_by_ref: { ref: CompleteModel },
    value: UserMap,
    key: { zone_name: string }
  ) {
    try {
      let z = model_by_ref.ref.zones.get(key.zone_name);
      if (z === undefined) {
        throw new Error("zone inexistante: " + key.zone_name);
      }
      z.maps.set(value.name, value);
    } catch (err) {
      return err;
    }
  }

  /**
   * Insère un objet Trail à partir d'un objet CompleteModel.
   *
   * @param model_by_ref Le modèle de donnée complet en objet, passé par référence.
   * @param value L'objet Sentier que l'on veut insérer dans le modèle.
   * @param key Les clés étrangères qui définissent un Sentier.
   */
  static insertTrailInUserMap(
    model_by_ref: { ref: CompleteModel },
    value: Trail,
    key: { zone_name: string; usermap_name: string }
  ) {
    try {
      let z = model_by_ref.ref.zones.get(key.zone_name);
      if (z === undefined) {
        throw new Error("zone inexistante: " + key.zone_name);
      }

      let um = z.maps.get(key.usermap_name);
      if (um === undefined) {
        throw new Error("carte inexistante: " + key.usermap_name);
      }

      um.trails.set(value.name, value);
    } catch (err) {
      return err;
    }
  }

  /**
   * Insère un objet Coordinate à partir d'un objet CompleteModel.
   *
   * @param model_by_ref Le modèle de donnée complet en objet, passé par référence.
   * @param value L'objet Coordinate que l'on veut insérer dans le modèle.
   * @param key Les clés étrangères qui définissent un Coordinate.
   */
  static insertCoordinateInTrail(
    model_by_ref: { ref: CompleteModel },
    value: Coordinate,
    key: { usermap_name: string; zone_name: string; trail_name: string }
  ) {
    try {
      let z = model_by_ref.ref.zones.get(key.zone_name);
      if (z === undefined) {
        throw new Error("zone inexistante: " + key.zone_name);
      }
      let um = z.maps.get(key.usermap_name);
      if (um === undefined) {
        throw new Error("carte inexistante: " + key.usermap_name);
      }

      let t = um.trails.get(key.trail_name);
      if (t === undefined) {
        throw new Error("sentier inexistant: " + key.usermap_name);
      }

      t.trailCoordinates.push(value);
    } catch (err) {
      return err;
    }
  }

  /**
   * Insère un objet InterestPoint à partir d'un objet CompleteModel.
   *
   * @param model_by_ref Le modèle de donnée complet en objet, passé par référence.
   * @param value L'objet InterestPoint que l'on veut insérer dans le modèle.
   * @param key Les clés étrangères qui définissent un InterestPoint.
   */
  static insertInterestPointInUserMap(
    model_by_ref: { ref: CompleteModel },
    poi: InterestPoint,
    key: { usermap_name: string; zone_name: string }
  ) {
    try {
      let z = model_by_ref.ref.zones.get(key.zone_name);
      if (z === undefined) {
        throw new Error("zone inexistante: " + key.zone_name);
      }

      let um = z.maps.get(key.usermap_name);
      if (um === undefined) {
        throw new Error("carte inexistante: " + key.usermap_name);
      }

      um.pointsOfInterest.set(poi.name, poi);
    } catch (err) {
      return err;
    }
  }

  /**
   * Insère un objet Sentier à partir d'un objet CompleteModel.
   *
   * @param model_by_ref Le modèle de donnée complet en objet, passé par référence.
   * @param value L'objet InterestPointData que l'on veut insérer dans le modèle.
   * @param key Les clés étrangères qui définissent un InterestPointData.
   */
  static insertInterestPointDataInInterestPoint(
    model_by_ref: { ref: CompleteModel },
    ipd: InterestPointData,
    key: {
      usermap_name: string;
      zone_name: string;
      interest_point_name: string;
    }
  ) {
    try {
      let z = model_by_ref.ref.zones.get(key.zone_name);
      if (z === undefined) {
        throw new Error("zone inexistante: " + key.zone_name);
      }
      let um = z.maps.get(key.usermap_name);
      if (um === undefined) {
        throw new Error("carte inexistante: " + key.usermap_name);
      }

      let poi = um.pointsOfInterest.get(key.interest_point_name);
      if (poi === undefined) {
        throw new Error(
          "point d'interet inexistant: " + key.interest_point_name
        );
      }
      poi.data.push(ipd);
    } catch (err) {
      return err;
    }
  }
}
