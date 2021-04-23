export type Coordinate = {
  latitude: number;
  longitude: number;
  altitude?: number;
};

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

export enum AppAccessType {
  code = "code",
  membership = "membership",
}

export type PointOfInterest = {
  name: string;
  description: string;
  coordinate: Coordinate;
  uri?: string[];
  type: InterestType;
  active?: boolean;
  code: string;
};

export type Trail = {
  name: string;
  description: string;
  difficulty: number;
  trailCoordinates: Coordinate[];
  uri?: string[];
  active?: boolean;
  color?: string;
};

export type Zone = {
  name: string;
  userMaps: UserMap[];
};

export type ZoneSummary = {
  name: string;
  mapCount: number;
};

export type UserMap = {
  name: string;
  trails: Trail[];
  pointsOfInterest: PointOfInterest[];
  topLeftCoordinate: Coordinate;
  topRightCoordinate: Coordinate;
  bottomLeftCoordinate: Coordinate;
  bottomRightCoordinate: Coordinate;
};

export type LoginStatus = {
  lastLogin: Date;
  loginType: AppAccessType;
  isLogged: boolean;
  customToken: string;
};

export type Partner = {
  name: string;
  uri?: string;
};
