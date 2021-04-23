/**
 * Structure de donnée pour une coordonnée
 */
export class Coordinate {
    longitude: number | undefined;
    latitude: number | undefined;
    altitude: number | undefined;

    constructor(longitude: number | undefined, latitude:number | undefined, altitude:number | undefined = undefined) {
      this.longitude = longitude;
      this.latitude = latitude;
      this.altitude = altitude;
    }
}