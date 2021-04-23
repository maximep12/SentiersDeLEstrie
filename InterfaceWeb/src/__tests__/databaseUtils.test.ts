import { CompleteModel } from "../models/completemodel";
import { Coordinate } from "../models/coordinatemodel";
import { InterestPoint, InterestType } from "../models/interestpointsmodel";
import { Trail } from "../models/trailmodel";
import { UserMap } from "../models/usermapmodel";
import { Zone } from "../models/zonemodel";
import { DatabaseUtils } from "../Utils/DatabaseUtils";

describe("sendModelToServer", () => {
  let excelFileOK = new File([new ArrayBuffer(1)], "fileOk.xlsx");
  let model: CompleteModel;

  CompleteModel.prototype.toJson = jest.fn().mockImplementation(() => {
    return new Object();
  });

  beforeAll(async (done) => {
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

    //Complete model
    model = new CompleteModel();
    model.zones.set("Brompt", zone1);

    done();
  });

  it("should retrun true, the informations were sent correctly", async () => {
    const expected: boolean = true;
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementation(() => {
      return 200;
    });
    const result =
      (await DatabaseUtils.sendModelToServer(excelFileOK, model)) === null;
    expect(result).toBe(expected);
  });

  it("should retrun false, the Excel file was not sent correctly", async () => {
    const expected: boolean = false;
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementationOnce(() => {
      return 200;
    });
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementationOnce(() => {
      return 400;
    });
    const result =
      (await DatabaseUtils.sendModelToServer(excelFileOK, model)) === null;
    expect(result).toBe(expected);
  });

  it("should retrun false, the json was not sent correctly", async () => {
    const expected: boolean = false;
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementationOnce(() => {
      return 400;
    });
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementationOnce(() => {
      return 200;
    });
    const result =
      (await DatabaseUtils.sendModelToServer(excelFileOK, model)) === null;
    expect(result).toBe(expected);
  });

  it("should retrun false, an error was thrown", async () => {
    const expected: boolean = false;
    DatabaseUtils.postRequestToServer = jest.fn().mockImplementationOnce(() => {
      throw " There was an error communicating with the server! ";
    });
    const result =
      (await DatabaseUtils.sendModelToServer(excelFileOK, model)) === null;
    expect(result).toBe(expected);
  });
});
