import { CompleteModel } from "../models/completemodel";
import { Coordinate } from "../models/coordinatemodel";
import { InterestPoint, InterestType } from "../models/interestpointsmodel";
import { Trail } from "../models/trailmodel";
import { UserMap } from "../models/usermapmodel";
import { Zone } from "../models/zonemodel";

test(" complete model to json ", async () => {
  jest.setTimeout(30000);

  let ip1 = new InterestPoint(
    "banc_cool",
    "un endoit pour s'assoir",
    InterestType.service,
    new Coordinate(4, 5),
    "codeQR1"
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
  um1.pointsOfInterest.set(ip1.name, ip1);

  //zones
  let zone1 = new Zone("Brompt");
  zone1.maps.set(um1.name, um1);

  const model = new CompleteModel();
  model.zones.set("Brompt", zone1);

  var result = JSON.stringify(model.toJson());

  expect(
    JSON.stringify(
      Object({
        zones: [
          {
            _id: "Brompt",
            maps: [
              {
                name: "CarteBrompton1",
                map_file: "path/to/file",
                topLeftCoordinate: { longitude: 1, latitude: 1 },
                topRightCoordinate: { longitude: 1, latitude: 2 },
                bottomLeftCoordinate: { longitude: 2, latitude: 1 },
                bottomRightCoordinate: { longitude: 2, latitude: 2 },
                trails: [
                  {
                    name: "sentier1",
                    description: "Le sentier des pellerins autochtones",
                    difficulty: 36,
                    active: true,
                    color: "black",
                    trailCoordinates: [
                      { longitude: 1, latitude: 1 },
                      { longitude: 3, latitude: 9 },
                    ],
                  },
                ],
                pointsOfInterest: [
                  {
                    name: "banc_cool",
                    description: "un endoit pour s'assoir",
                    type: "service",
                    active: true,
                    code: "codeQR1",
                    coordinate: { longitude: 4, latitude: 5 },
                    data: [],
                  },
                ],
              },
            ],
          },
        ],
        partners: [],
      })
    )
  ).toBe(result);
});
