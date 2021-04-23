import { Workbook } from "exceljs";
import { CompleteModel } from "../../models/completemodel";
import { Coordinate } from "../../models/coordinatemodel";
import {
  DataType,
  InterestPointData,
} from "../../models/interestpointdatamodel";
import { InterestPoint, InterestType } from "../../models/interestpointsmodel";
import { Trail } from "../../models/trailmodel";
import { UserMap } from "../../models/usermapmodel";
import { Zone } from "../../models/zonemodel";
import { ImportExcelFile } from "../../Utils/ImportExcelFile";

function validateData(response2: CompleteModel): string {
  // Assertions on data
  // Zones
  expect(response2.zones.get("Zone1")!._id).toBe("Zone1");
  expect(response2.zones.get("Zone2")!._id).toBe("Zone2");
  expect(response2.zones.get("Zone3")!._id).toBe("Zone3");

  // UserMap
  expect(response2.zones.get("Zone1")!.maps.get("Carte1")!.name).toBe("Carte1");
  expect(response2.zones.get("Zone1")!.maps.get("Carte2")!.name).toBe("Carte2");
  expect(response2.zones.get("Zone2")!.maps.get("Carte3")!.name).toBe("Carte3");
  expect(response2.zones.get("Zone3")!.maps).toStrictEqual(new Map());
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte1")!.bottomLeftCoordinate
      .longitude
  ).toBe(2);

  // Trail
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte1")!.trails.get("sentier1")!
      .name
  ).toBe("sentier1");
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte2")!.trails.get("sentier2")!
      .name
  ).toBe("sentier2");
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte2")!.trails.get("sentier3")!
      .name
  ).toBe("sentier3");
  expect(
    response2.zones.get("Zone2")!.maps.get("Carte3")!.trails
  ).toStrictEqual(new Map());
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte1")!.trails.get("sentier1")!
      .active
  ).toBe(true);
  expect(
    response2.zones.get("Zone1")!.maps.get("Carte2")!.trails.get("sentier2")!
      .color
  ).toBe("blue");

  // Coordonnées de sentier
  expect(
    Number(
      response2.zones.get("Zone1")!.maps.get("Carte1")!.trails.get("sentier1")!
        .trailCoordinates[0].longitude
    )
  ).toBe(100);
  expect(
    Number(
      response2.zones.get("Zone1")!.maps.get("Carte2")!.trails.get("sentier2")!
        .trailCoordinates[0].longitude
    )
  ).toBe(50);
  expect(
    Number(
      response2.zones.get("Zone1")!.maps.get("Carte2")!.trails.get("sentier3")!
        .trailCoordinates[0].longitude
    )
  ).toBe(1);

  // Interest Point
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte1")!
      .pointsOfInterest.get("point111")!.name
  ).toBe("point111");
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte2")!
      .pointsOfInterest.get("point121")!.name
  ).toBe("point121");
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte2")!
      .pointsOfInterest.get("point122")!.name
  ).toBe("point122");
  expect(
    response2.zones.get("Zone2")!.maps.get("Carte3")!.pointsOfInterest
  ).toStrictEqual(new Map());
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte1")!
      .pointsOfInterest.get("point111")!.active
  ).toBe(true);

  // Interest Point Data
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte1")!
      .pointsOfInterest.get("point111")!.name
  ).toBe("point111");
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte2")!
      .pointsOfInterest.get("point121")!.name
  ).toBe("point121");
  expect(
    response2.zones
      .get("Zone1")!
      .maps.get("Carte2")!
      .pointsOfInterest.get("point122")!.name
  ).toBe("point122");
  expect(
    response2.zones.get("Zone2")!.maps.get("Carte3")!.pointsOfInterest
  ).toStrictEqual(new Map());

  expect(response2.partners[0].name).toBe("exemple");
  expect(response2.partners[0].uri).toBe("exemple");

  return "ok";
}

function makeTestModel(): CompleteModel {
  const model = new CompleteModel();
  model.zones.set("Zone1", new Zone("Zone1"));
  model.zones.set("Zone2", new Zone("Zone2"));
  model.zones.set("Zone3", new Zone("Zone3"));

  model.zones
    .get("Zone1")!
    .maps.set(
      "Carte1",
      new UserMap(
        "Carte1",
        "path/to/file",
        new Coordinate(1, 1),
        new Coordinate(1, 2),
        new Coordinate(2, 1),
        new Coordinate(2, 2)
      )
    );
  model.zones
    .get("Zone1")!
    .maps.set(
      "Carte2",
      new UserMap(
        "Carte2",
        "path/to/file",
        new Coordinate(1, 1),
        new Coordinate(1, 2),
        new Coordinate(2, 1),
        new Coordinate(2, 2)
      )
    );
  model.zones
    .get("Zone2")!
    .maps.set(
      "Carte3",
      new UserMap(
        "Carte3",
        "path/to/file",
        new Coordinate(1, 1),
        new Coordinate(1, 2),
        new Coordinate(2, 1),
        new Coordinate(2, 2)
      )
    );

  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .trails.set("sentier1", new Trail("sentier1", "description1", 200));
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .trails.set(
      "sentier2",
      new Trail("sentier2", "description2", 12, true, "blue")
    );
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .trails.set("sentier3", new Trail("sentier3", "description3", 1));

  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .trails.get("sentier1")!
    .trailCoordinates.push(new Coordinate(100, 100));
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .trails.get("sentier2")!
    .trailCoordinates.push(new Coordinate(50, 50));
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .trails.get("sentier3")!
    .trailCoordinates.push(new Coordinate(1, 3));

  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .pointsOfInterest.set(
      "point111",
      new InterestPoint(
        "point111",
        "description1",
        InterestType.service,
        new Coordinate(20, 20),
        "code1"
      )
    );
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .pointsOfInterest.set(
      "point121",
      new InterestPoint(
        "point121",
        "description2",
        InterestType.service,
        new Coordinate(39, 70),
        "code2",
        true
      )
    );
  model.zones
    .get("Zone1")!
    .maps.get("Carte2")!
    .pointsOfInterest.set(
      "point122",
      new InterestPoint(
        "point122",
        "description3",
        InterestType.service,
        new Coordinate(99, 99),
        "code3",
        false
      )
    );

  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .pointsOfInterest.get("point111")!
    .data.push(new InterestPointData(DataType.image, "image"));
  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .pointsOfInterest.get("point111")!
    .data.push(new InterestPointData(DataType.image, "image2"));
  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .pointsOfInterest.get("point111")!
    .data.push(new InterestPointData(DataType.image, "image3"));
  model.zones
    .get("Zone1")!
    .maps.get("Carte1")!
    .pointsOfInterest.get("point111")!
    .data.push(new InterestPointData(DataType.image, "image4"));

  return model;
}

test.skip("Reverse engineer workbook with ExcelJS, from browser", async () => {
  // Init test data
  let excelFileOK = new File([new ArrayBuffer(1)], "fileOk.xlsx");

  let model = makeTestModel();

  // Write Excel file
  let response = await ImportExcelFile.ReverseEngineerWorkbookProgrammatically(
    "testBook2.xlsx",
    model
  );
  expect(response).toBe("write succesful");

  // Fetch data from Excel file
  let response2 = await ImportExcelFile.fetchDataFromExcelFromBrowser(
    excelFileOK
  );
  let status: string = validateData(response2);
  expect(status).toBe("ok");
});

test("Reverse engineer workbook with ExcelJS, from NodeJS", async () => {
  // Init test data
  let model = makeTestModel();

  // Write Excel file
  let response = await ImportExcelFile.ReverseEngineerWorkbookProgrammatically(
    "testBook2.xlsx",
    model
  );
  expect(response).toBe("write succesful");

  // Fetch data from Excel file
  let response2 = await ImportExcelFile.fetchDataFromExcel("testBook2.xlsx");
  let status: string = validateData(response2);
  expect(status).toBe("ok");
});

/**
 *  L'utilisateur devrait pouvoir entrer des doublons mais l'application devrait prendre en charge si les données sont
 *  sauvegardées ou non.
 *
 *  Comportement souhaité: On veut que l'utilisateur aie un message lorsqu'il entre un doublon.
 *  Si jamais des doublons arrivent à entrer dans l'application, on veut que les donnees de la premiere entree soient effacees
 */
test("User entering duplicates in Excel file ", async () => {
  // Init test data
  let model = new CompleteModel();
  let wb: Workbook = new Workbook();

  let response = await ImportExcelFile.ReverseEngineerWorkbookProgrammatically(
    "testBook4.xlsx",
    model
  );
});

test("Migration", async () => {
  jest.setTimeout(30000);

  let response = await ImportExcelFile.MigrateSentiersDBF(
    "donnees/Sentiers_dbf.csv",
    "sentierDBF.xlsx"
  );
});

test("Migration fetch", async () => {
  jest.setTimeout(30000);

  let model: CompleteModel = await ImportExcelFile.fetchDataFromExcel(
    "output.xlsx"
  );
  console.log(model);
});
