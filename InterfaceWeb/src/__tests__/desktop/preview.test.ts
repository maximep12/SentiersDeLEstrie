import sendForPreview from "../../DesktopViews/PreviewView";
import { CompleteModel } from "../../models/completemodel";
import { Coordinate } from "../../models/coordinatemodel";
import { InterestPoint, InterestType } from "../../models/interestpointsmodel";
import { Trail } from "../../models/trailmodel";
import { UserMap } from "../../models/usermapmodel";
import { Zone } from "../../models/zonemodel";
import { ImportExcelFile } from "../../Utils/ImportExcelFile";

describe("sendForPreview", () => {
  let model: CompleteModel;
  let excelFileOK = new File([new ArrayBuffer(1)], "fileOk.xlsx");
  let excelFileErr = new File([new ArrayBuffer(1)], "");

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

    model = new CompleteModel();
    model.zones.set("Brompt", zone1);

    done();
  });

  it("should retrun false, no file selected", async () => {
    const expected: boolean = false;
    const result = await sendForPreview(excelFileErr);
    expect(await result.isSent).toBe(expected);
  });

  it("should retrun true, the excel was fill properly", async () => {
    const expected: boolean = true;
    ImportExcelFile.fetchDataFromExcelFromBrowser = jest
      .fn()
      .mockImplementation(() => {
        return model;
      });
    const result = await sendForPreview(excelFileOK);
    expect(await result.isSent).toBe(expected);
  });

  it("should retrun false, the excel was not fill properly", async () => {
    const expected: boolean = false;
    ImportExcelFile.fetchDataFromExcelFromBrowser = jest
      .fn()
      .mockImplementationOnce(() => {
        return undefined;
      });
    const result = await sendForPreview(excelFileOK);
    expect(await result.isSent).toBe(expected);
  });

  it("should retrun false, the excel was not fill properly", async () => {
    const expected: boolean = false;
    ImportExcelFile.fetchDataFromExcelFromBrowser = jest
      .fn()
      .mockImplementationOnce(() => {
        return new CompleteModel();
      });
    const result = await sendForPreview(excelFileOK);
    expect(await result.isSent).toBe(expected);
  });
});
