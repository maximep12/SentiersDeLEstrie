import { CompleteModel } from "../../models/completemodel";
import { Coordinate } from "../../models/coordinatemodel";
import { InterestPoint, InterestType } from "../../models/interestpointsmodel";
import { Queries } from "../../models/queries";
import { Trail } from "../../models/trailmodel";
import { UserMap } from "../../models/usermapmodel";
import { Zone } from "../../models/zonemodel";

let model: CompleteModel;

beforeAll(async (done) => {
  //interest points
  let ip1 = new InterestPoint(
    "banc_cool",
    "un endoit pour s'assoir",
    InterestType.service,
    new Coordinate(4, 5),
    "codeQR1"
  );
  let ip2 = new InterestPoint(
    "vue_Orford",
    "le mont Orford a un angle de 45 degres",
    InterestType.summit,
    new Coordinate(9, 10),
    "codeQR2"
  );
  let ip3 = new InterestPoint(
    "gros_arbre",
    "en bois",
    InterestType.nature,
    new Coordinate(50, 50),
    "codeQR3"
  );
  let ip4 = new InterestPoint(
    "riviere_st_francois",
    "qwertyuio",
    InterestType.view,
    new Coordinate(60, 50),
    "codeQR4"
  );
  let ip5 = new InterestPoint(
    "toilettes",
    "des toilettes",
    InterestType.service,
    new Coordinate(78, 58),
    "codeQR5"
  );

  //sentiers
  let sentier1 = new Trail(
    "sentier1",
    "Le sentier des pellerins autochtones",
    36,
    undefined,
    undefined
  );
  sentier1.addPoint(new Coordinate(1, 1));
  sentier1.addPoint(new Coordinate(3, 9));
  sentier1.addPoint(new Coordinate(4, 10));
  sentier1.addPoint(new Coordinate(5, 12));
  sentier1.addPoint(new Coordinate(8, 20));
  sentier1.addPoint(new Coordinate(8, 10));
  sentier1.addPoint(new Coordinate(8, 1));

  let sentier2 = new Trail(
    "sentier2",
    "Le sentier des pellerins autochtones",
    2,
    undefined,
    undefined
  );
  sentier2.addPoint(new Coordinate(50, 0));
  sentier2.addPoint(new Coordinate(50, 10));
  sentier2.addPoint(new Coordinate(50, 20));
  sentier2.addPoint(new Coordinate(50, 30));
  sentier2.addPoint(new Coordinate(50, 40));
  sentier2.addPoint(new Coordinate(50, 50));

  let sentier3 = new Trail(
    "sentier3",
    "Le sentier des pellerins autochtones",
    50,
    undefined,
    undefined
  );
  sentier2.addPoint(new Coordinate(10, 20));
  sentier2.addPoint(new Coordinate(10, 10));
  sentier2.addPoint(new Coordinate(10, 20));
  sentier2.addPoint(new Coordinate(10, 30));
  sentier2.addPoint(new Coordinate(50, 40));
  sentier2.addPoint(new Coordinate(50, 50));

  //user maps
  let um1 = new UserMap(
    "CarteBrompton1",
    "path/to/file",
    new Coordinate(1, 1),
    new Coordinate(1, 2),
    new Coordinate(2, 1),
    new Coordinate(2, 2)
  );
  um1.trails.set(sentier1.name, sentier1);
  um1.trails.set(sentier2.name, sentier2);
  um1.pointsOfInterest.set(ip1.name, ip1);
  um1.pointsOfInterest.set(ip2.name, ip2);

  let um2 = new UserMap(
    "CarteBrompton2",
    "path/to/file",
    new Coordinate(1, 1),
    new Coordinate(1, 2),
    new Coordinate(2, 1),
    new Coordinate(2, 2)
  );
  um2.trails.set(sentier3.name, sentier3);
  um2.pointsOfInterest.set(ip3.name, ip3);
  um2.pointsOfInterest.set(ip4.name, ip4);
  um2.pointsOfInterest.set(ip5.name, ip5);

  //zones
  let zone1 = new Zone("Brompt");
  zone1.maps.set(um1.name, um1);
  zone1.maps.set(um2.name, um2);

  var zone2 = new Zone("Ascott");

  model = new CompleteModel();
  model.zones.set("Brompt", zone1);
  model.zones.set("Ascott", zone2);

  done();
});

describe("SELECT statements", () => {
  it("FROM Zone WHERE pk = params", async () => {
    let zone = Queries.getZoneFromObjectModel(model, "Brompt");
    expect(zone._id).toBe("Brompt");
  });

  it("FROM UserMap WHERE pk = params", async () => {
    let usermap = Queries.getUserMapFromObjectModel(
      model,
      "Brompt",
      "CarteBrompton1"
    );
    expect(usermap.name).toBe("CarteBrompton1");
  });

  it("FROM Sentier WHERE pk = params", async () => {
    let sentier = Queries.getTrailFromObjectModel(
      model,
      "Brompt",
      "CarteBrompton1",
      "sentier1"
    );
    expect(sentier.name).toBe("sentier1");
  });

  it("FROM InterestPoint WHERE pk = params", async () => {
    let interestPoint = Queries.getInterestPointsFromObjectModel(
      model,
      "Brompt",
      "CarteBrompton1",
      "banc_cool"
    );
    expect(interestPoint.name).toBe("banc_cool");
  });
});
