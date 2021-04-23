import { InterestType, PointOfInterest } from "./../types";
import { CATEGORY_COLORS, getPOIInfosByType } from "./POIIcon.utils";

describe("Tests to ensure that the icon scheme on map follows the POI scheme", () => {
  const service: PointOfInterest = {
    code: "service",
    coordinate: { latitude: 0, longitude: 0 },
    description: "service",
    name: "service",
    type: InterestType.service,
  };
  const summit: PointOfInterest = {
    code: "summit",
    coordinate: { latitude: 0, longitude: 0 },
    description: "summit",
    name: "summit",
    type: InterestType.summit,
  };

  const view: PointOfInterest = {
    code: "view",
    coordinate: { latitude: 0, longitude: 0 },
    description: "view",
    name: "view",
    type: InterestType.view,
  };

  const nature: PointOfInterest = {
    code: "nature",
    coordinate: { latitude: 0, longitude: 0 },
    description: "nature",
    name: "nature",
    type: InterestType.nature,
  };

  const parking: PointOfInterest = {
    code: "parking",
    coordinate: { latitude: 0, longitude: 0 },
    description: "parking",
    name: "parking",
    type: InterestType.parking,
  };

  const restroom: PointOfInterest = {
    code: "restroom",
    coordinate: { latitude: 0, longitude: 0 },
    description: "restroom",
    name: "restroom",
    type: InterestType.restroom,
  };

  const camping: PointOfInterest = {
    code: "camping",
    coordinate: { latitude: 0, longitude: 0 },
    description: "camping",
    name: "camping",
    type: InterestType.camping,
  };

  const telephone: PointOfInterest = {
    code: "telephone",
    coordinate: { latitude: 0, longitude: 0 },
    description: "telephone",
    name: "telephone",
    type: InterestType.telephone,
  };

  const picnic: PointOfInterest = {
    code: "picnic",
    coordinate: { latitude: 0, longitude: 0 },
    description: "picnic",
    name: "picnic",
    type: InterestType.picnic,
  };

  const refuge: PointOfInterest = {
    code: "refuge",
    coordinate: { latitude: 0, longitude: 0 },
    description: "refuge",
    name: "refuge",
    type: InterestType.refuge,
  };

  const hosting: PointOfInterest = {
    code: "hosting",
    coordinate: { latitude: 0, longitude: 0 },
    description: "hosting",
    name: "hosting",
    type: InterestType.hosting,
  };

  const unknown: PointOfInterest = {
    code: "unknown",
    coordinate: { latitude: 0, longitude: 0 },
    description: "unknown",
    name: "unknown",
    type: InterestType.unknown,
  };

  it("Should return the right color for each type of POI", () => {
    expect(getPOIInfosByType(summit.type).color).toBe(CATEGORY_COLORS.nature);
    expect(getPOIInfosByType(view.type).color).toBe(CATEGORY_COLORS.nature);
    expect(getPOIInfosByType(nature.type).color).toBe(CATEGORY_COLORS.nature);
    expect(getPOIInfosByType(picnic.type).color).toBe(CATEGORY_COLORS.nature);
    expect(getPOIInfosByType(service.type).color).toBe(CATEGORY_COLORS.service);
    expect(getPOIInfosByType(parking.type).color).toBe(CATEGORY_COLORS.service);
    expect(getPOIInfosByType(restroom.type).color).toBe(
      CATEGORY_COLORS.service
    );
    expect(getPOIInfosByType(camping.type).color).toBe(CATEGORY_COLORS.service);
    expect(getPOIInfosByType(telephone.type).color).toBe(
      CATEGORY_COLORS.service
    );
    expect(getPOIInfosByType(refuge.type).color).toBe(CATEGORY_COLORS.service);
    expect(getPOIInfosByType(hosting.type).color).toBe(CATEGORY_COLORS.service);
    expect(getPOIInfosByType(unknown.type).color).toBe(CATEGORY_COLORS.unknown);
  });
});
