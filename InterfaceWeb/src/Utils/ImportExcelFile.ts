import { Workbook, Worksheet } from "exceljs";
import { CompleteModel } from "../models/completemodel";
import { Coordinate } from "../models/coordinatemodel";
import {
  getDataType,
  InterestPointData,
} from "../models/interestpointdatamodel";
import { getInterestType, InterestPoint } from "../models/interestpointsmodel";
import { Partner } from "../models/partner";
import { Queries } from "../models/queries";
import { Trail } from "../models/trailmodel";
import { UserMap } from "../models/usermapmodel";
import { Zone } from "../models/zonemodel";

/** Classe d'intégration avec Excel */
export class ImportExcelFile {

  /**
   * La fonction qui permet définit les sentiers pour l'application à partir des données du client.
   * @param csv le nom du fichier csv du client qui définit les sentiers ainsi que dans quels fichiers sont les coordonnées.
   */
  static async MigrateSentiersDBF(csv: string, xlsx: string) {
    try {
      let wb: Workbook = new Workbook();
      let model = new CompleteModel();
      let defaultMap = "default";
      const trailID: string[][] = [];

      await wb.csv.readFile(csv);

      const ws = wb.worksheets[0];

      ws.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          let zoneString = row.getCell(3).value!.toString();

          // Zone
          if (!model.zones.has(zoneString))
            model.zones.set(zoneString, new Zone(zoneString));

          // Carte
          if (!model.zones.get(zoneString)!.maps.has(defaultMap)) {
            let insertMap = new UserMap(
              defaultMap,
              "none",
              new Coordinate(-1, -1),
              new Coordinate(-1, -1),
              new Coordinate(-1, -1),
              new Coordinate(-1, -1)
            );
            Queries.insertUserMapInZoneMaps({ ref: model }, insertMap, {
              zone_name: zoneString,
            });
          }

          // Trail
          let trailName = row.getCell(2).value!.toString();
          let trailFile = row.getCell(1).value!.toString();
          trailID.push([zoneString, trailName, trailFile]);

          let newTrail = new Trail(trailName, "none", -1, true);

          Queries.insertTrailInUserMap({ ref: model }, newTrail, {
            usermap_name: defaultMap,
            zone_name: zoneString,
          });
        }
      });

      await ImportExcelFile.MigrateServicesData("donnees/services.csv", {
        ref: model,
      });
      await ImportExcelFile.MigrateTrailCoordinate(trailID, { ref: model });
      let write_success = this.ReverseEngineerWorkbookProgrammatically(
        "output.xlsx",
        model
      );
      return write_success;
    } catch (err) {
      console.log(err);
    }
  }

  static async MigrateTrailCoordinate(
    trailID: string[][],
    model: { ref: CompleteModel }
  ) {
    for (const id of trailID) {
      let wb: Workbook = new Workbook();
      let csvFile = "donnees/".concat(id[2]);
      await wb.csv.readFile(csvFile);
      const ws = wb.worksheets[0];

      ws.eachRow((row, rowNumber) => {
        let longitude = Number(row.getCell(1).value!.toString());
        let latitude = Number(row.getCell(2).value!.toString());
        let altitude = Number(row.getCell(3).value!.toString());
        let c = new Coordinate(longitude, latitude, altitude);
        model.ref.zones
          .get(id[0])!
          .maps.get("default")!
          .trails.get(id[1])!
          .trailCoordinates.push(c);
      });
    }
  }

  /**
   * Méthode pour migrer les données du client vers le fichier Excel d'entrée de données. Le fichier d'entrée doit
   * etre en CSV.
   *
   * @param csv Le nom du fichier duquel on veut extraire les données, en csv.
   * @param xlsx Le nom du fichier qu'on veut générer avec les données, en xlsx.
   * @returns write_succesful Un string qui indique si l'écriture du fichier Excel résultant est un succès.
   */
  static async MigrateServicesData(
    csv: string,
    model_by_ref: { ref: CompleteModel }
  ) {
    let defaultMap = "default";

    let wb = new Workbook();
    await wb.csv.readFile(csv);

    const ws = wb.worksheets[0];
    ws.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        let zoneString = row.getCell(4).value!.toString();

        // Zone
        if (!model_by_ref.ref.zones.has(zoneString))
          model_by_ref.ref.zones.set(zoneString, new Zone(zoneString));

        // Carte
        if (!model_by_ref.ref.zones.get(zoneString)!.maps.has(defaultMap)) {
          let insertMap = new UserMap(
            defaultMap,
            "none",
            new Coordinate(-1, -1),
            new Coordinate(-1, -1),
            new Coordinate(-1, -1),
            new Coordinate(-1, -1)
          );
          model_by_ref.ref.zones
            .get(zoneString)!
            .maps.set(defaultMap, insertMap);
        }

        // InterestPoint
        let type = row.getCell(5).value!.toString();
        let poiName = row.getCell(2).value!.toString();
        let altitude = row.getCell(3).value!.toString();
        let longitude = row.getCell(18).value!.toString();
        let latitude = row.getCell(19).value!.toString();
        let insertedType = InterestPoint.getTypeFromString(type);

        let newPOI = new InterestPoint(
          poiName,
          "none",
          insertedType,
          new Coordinate(Number(longitude), Number(latitude), Number(altitude)),
          "none",
          true
        );

        model_by_ref.ref.zones
          .get(zoneString)!
          .maps.get(defaultMap)!
          .pointsOfInterest.set(poiName, newPOI);
      }
    });
  }

  /**
   * Méthode pour aller chercher des données à partir d'un fichier Excel.
   * Fonctionne pour le panneau de contrôle administrateur
   *
   * @param file Le fichier duquel on veut extraire les données.
   * @returns un objet CompleteModel.
   */
  static async fetchDataFromExcel(filename: string) {
    let wb: Workbook = new Workbook();
    let model = new CompleteModel();
    let model_by_ref = { ref: model };
    let separator = ", ";

    await wb.xlsx.readFile(filename);

    await this.parseExcelFile(wb, model, model_by_ref, separator);

    return model;
  }

  /**
   * Prends les informations du fichier Excel d'entrée de données et les ajoute à un objet CompleteModel.
   *
   * @param wb un objet ExcelJS.Workbook qui contient les données que le client veut ajouter à l'application.
   * @param model un objet CompleteModel dans lequel on veut insérer les nouvelles données.
   * @param model_by_ref un pointeur vers le deuxième paramètre qui permet d'entrer des données dans le modèle à partir
   * des fonctions appelées par parseExcelFile()
   * @param separator la chaine de caractère utilisée pour séparer les clés naturelles des entitées dépendantes dans le
   * fichier Excel.
   */
  private static async parseExcelFile(
    wb: Workbook,
    model: CompleteModel,
    model_by_ref: { ref: CompleteModel },
    separator: string
  ) {
    try {
      // Zone
      const ws_Zone = wb.getWorksheet("Zones");
      ws_Zone.eachRow(function (row, rowNumber) {
        if (rowNumber !== 1) {
          let cellvalue = row.getCell(1).value!.toString();
          let z = new Zone(cellvalue);
          model.zones.set(z._id, z);
        }
      });

      // UserMap
      const ws_UserMap = wb.getWorksheet("Carte");
      ws_UserMap.eachRow(
        await async function (row, rowNumber) {
          if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
            let key = {
              zone_name: row.getCell(1).value!.toString(),
            };
            let usermap_name = row.getCell(2).value!.toString();
            let filepath = row.getCell(3).value!.toString();

            let tlLong = undefined;
            let tlLat = undefined;
            let trLong = undefined;
            let trLat = undefined;
            let blLong = undefined;
            let blLat = undefined;
            let brLong = undefined;
            let brLat = undefined;

            if (row.getCell(4).value)
              tlLong = Number(row.getCell(4).value!.toString());
            if (row.getCell(5).value)
              tlLat = Number(row.getCell(5).value!.toString());
            if (row.getCell(6).value)
              trLong = Number(row.getCell(6).value!.toString());
            if (row.getCell(7).value)
              trLat = Number(row.getCell(7).value!.toString());
            if (row.getCell(8).value)
              blLong = Number(row.getCell(8).value!.toString());
            if (row.getCell(9).value)
              blLat = Number(row.getCell(9).value!.toString());
            if (row.getCell(10).value)
              brLong = Number(row.getCell(10).value!.toString());
            if (row.getCell(11).value)
              brLat = Number(row.getCell(11).value!.toString());

            let um = new UserMap(
              usermap_name,
              filepath,
              new Coordinate(tlLong, tlLat),
              new Coordinate(trLong, trLat),
              new Coordinate(blLong, blLat),
              new Coordinate(brLong, brLat)
            );

            Queries.insertUserMapInZoneMaps(model_by_ref, um, key);
          }
        }
      );

      // Trail
      const ws_Trail = wb.getWorksheet("Sentier");
      ws_Trail.eachRow(
        await async function (row, rowNumber) {
          if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
            let keyCell = row.getCell(1).value!.toString().split(separator);

            let key = {
              zone_name: keyCell[0],
              usermap_name: keyCell[1],
            };

            let trailDescription = undefined;
            let difficulty = 1;
            let color = "black";
            let active = true;

            let trailName = row.getCell(2).value!.toString();
            if (row.getCell(3).value) {
              trailDescription = row.getCell(3).value!.toString();
            }
            if (row.getCell(4).value) {
              difficulty = Number(row.getCell(4).value!.toString());
            }
            if (row.getCell(5).value) {
              color = row.getCell(5).value!.toString();
            }
            if (row.getCell(6)) {
              active = row.getCell(6).value!.valueOf() as boolean;
            }

            let s = new Trail(
              trailName,
              trailDescription,
              difficulty,
              active,
              color
            );

            Queries.insertTrailInUserMap(model_by_ref, s, key);
          }
        }
      );

      // Coordonnées de sentiers
      const ws_coordinateSentier = wb.getWorksheet("Coordonnees de Sentier");
      ws_coordinateSentier.eachRow(
        await async function (row, rowNumber) {
          if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
            let keyCell = row.getCell(1).value!.toString().split(separator);

            let key = {
              zone_name: keyCell[0],
              usermap_name: keyCell[1],
              trail_name: keyCell[2],
            };

            let longitude = undefined;
            let latitude = undefined;
            let altitude = undefined;

            if (row.getCell(2).value)
              longitude = Number(row.getCell(2).value!.toString());
            if (row.getCell(3).value)
              latitude = Number(row.getCell(3).value!.toString());
            if (row.getCell(4).value)
              altitude = Number(row.getCell(4).value!.toString());

            let c = new Coordinate(longitude, latitude, altitude);

            Queries.insertCoordinateInTrail(model_by_ref, c, key);
          }
        }
      );

      // Point d'interet
      const ws_interestPoints = wb.getWorksheet("Point d'interet");
      ws_interestPoints.eachRow(
        await async function (row, rowNumber) {
          if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
            let keyCell = row.getCell(1).value!.toString().split(separator);

            let key = {
              zone_name: keyCell[0],
              usermap_name: keyCell[1],
            };

            let poiTypeString = "unknown";
            let description = "";
            let poiLong = undefined;
            let poiLat = undefined;
            let active = true;

            let poiName = row.getCell(2).value!.toString();
            if (row.getCell(3).value)
              description = row.getCell(3).value!.toString();

            if (row.getCell(4).value)
              poiTypeString = row.getCell(4).value!.toString();
            let it = getInterestType(poiTypeString);

            if (row.getCell(5))
              active = row.getCell(5).value!.valueOf() as boolean;

            if (row.getCell(6))
              poiLong = Number(row.getCell(6).value!.toString());
            if (row.getCell(7))
              poiLat = Number(row.getCell(7).value!.toString());

            let ip = new InterestPoint(
              poiName,
              description,
              it,
              new Coordinate(poiLong, poiLat),
              "code",
              active
            );

            Queries.insertInterestPointInUserMap(model_by_ref, ip, key);
          }
        }
      );

      // Données d'un point d'interet
      const ws_interestPointsData = wb.getWorksheet(
        "Fichiers de point d'interet"
      );
      ws_interestPointsData.eachRow(async function (row, rowNumber) {
        if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
          let keyCell = row.getCell(1).value!.toString().split(separator);

          let key = {
            zone_name: keyCell[0],
            usermap_name: keyCell[1],
            interest_point_name: keyCell[2],
          };

          let ipd_type = row.getCell(2).value!.toString();
          let datatype = getDataType(ipd_type);

          let ipd_data = row.getCell(3).value!.toString();

          let ip = new InterestPointData(datatype, ipd_data);

          Queries.insertInterestPointDataInInterestPoint(model_by_ref, ip, key);
        }
      });

      // Partners
      const ws_Partners = wb.getWorksheet("Partners");
      ws_Partners.eachRow(
        await async function (row, rowNumber) {
          if (rowNumber !== 1 && row.getCell(1).value !== undefined) {
            let p = new Partner(row.getCell(1).toString());
            if (row.getCell(2).value) p.uri = row.getCell(2).toString();
            model.partners.push(p);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Méthode pour aller chercher des données à partir d'un fichier Excel.
   * Fonctionne pour le panneau de contrôle administrateur
   *
   * @param file Le fichier duquel on veut extraire les données.
   * @returns un objet CompleteModel.
   */
  static async fetchDataFromExcelFromBrowser(file: File) {
    const Excel = require("exceljs");
    let wb: Workbook = new Excel.Workbook();
    let model = new CompleteModel();
    let model_by_ref = { ref: model };
    let separator = ", ";

    // @ts-ignore
    let arrayBuff = await file.arrayBuffer();
    let buffer = await ImportExcelFile.toBuffer(arrayBuff);
    try {
      return Promise.resolve(
        await wb.xlsx.load(buffer).then(async (book) => {
          try {
            // Zone
            await this.parseExcelFile(book, model, model_by_ref, separator);
          } catch (err) {
            console.log(err);
            return Promise.resolve(new CompleteModel());
          }
          return Promise.resolve(model);
        })
      );
    } catch (err) {
      console.log(err);
      return Promise.resolve(new CompleteModel());
    }
  }

  /**
   * Produit un Buffer à partir d'un objet 'ArrayBuffer'.
   *
   * @param model L'objet 'ArrayBuffer'.
   * @returns un Buffer.
   */
  static async toBuffer(ab: ArrayBuffer) {
    let buf = Buffer.alloc(ab.byteLength);
    let view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }

  /**
   * Produit un fichier Excel à partir d'un objet 'CompleteModel'.
   *
   * @param filename Le nom que l'on veut donner à notre feuille Excel.
   * @param model L'objet 'CompleteModel' à insérer dans une feuille Excel.
   * @returns "write succesful" si la méthode n'a pas rencontré d'erreur.
   */
  static async ReverseEngineerWorkbookProgrammatically(
    filename: string,
    model: CompleteModel
  ) {
    const wb: Workbook = new Workbook();

    /** # general info */
    wb.creator = "Sentiers de l'Estrie";
    wb.created = new Date();

    /** # make sheets */
    const key_sheet = wb.addWorksheet("Keys", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const zone_sheet = wb.addWorksheet("Zones", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const usermap_sheet = wb.addWorksheet("Carte", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const sentier_sheet = wb.addWorksheet("Sentier", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const coordinateSentier_sheet = wb.addWorksheet("Coordonnees de Sentier", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const interestPoint_sheet = wb.addWorksheet("Point d'interet", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const interestPointData_sheet = wb.addWorksheet(
      "Fichiers de point d'interet",
      { views: [{ state: "frozen", ySplit: 1 }] }
    );
    const partners_sheet = wb.addWorksheet("Partners", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    /** ## make tables within spreadsheets that contain row names, column names, data */
    let ExcelModel = this.FormatModelToExcel(model);
    let ColumnsModel = this.MakeColumnsMap();

    this.addTableWrapper(
      zone_sheet,
      "tableau_zones",
      ColumnsModel,
      ExcelModel,
      "zones"
    );
    this.addTableWrapper(
      usermap_sheet,
      "tableau_cartes",
      ColumnsModel,
      ExcelModel,
      "user_maps"
    );
    this.addTableWrapper(
      sentier_sheet,
      "tableau_sentiers",
      ColumnsModel,
      ExcelModel,
      "sentiers"
    );
    this.addTableWrapper(
      coordinateSentier_sheet,
      "tableau_coordinateSentiers",
      ColumnsModel,
      ExcelModel,
      "coordinate_sentiers"
    );
    this.addTableWrapper(
      interestPoint_sheet,
      "tableau_interestPoint",
      ColumnsModel,
      ExcelModel,
      "interest_points"
    );
    this.addTableWrapper(
      interestPointData_sheet,
      "tableau_interestPointData",
      ColumnsModel,
      ExcelModel,
      "interest_points_data"
    );
    this.addTableWrapper(
      partners_sheet,
      "tableau_partners",
      ColumnsModel,
      ExcelModel,
      "partners"
    );

    /** # Data validation */
    /** ## Configure single key as defined name */
    zone_sheet
      .getColumn("A")
      .eachCell({ includeEmpty: true }, function (cell, rowNumber) {
        if (rowNumber !== 1) {
          cell.name = "Zone_ID";
        }
      });

    /** ## Configure composite keys sheet */
    let separator = '", "';
    // @ts-ignore
    wb.definedNames.addFormula(
      "CONCATENATE(tableau_cartes[ID: Zone]," +
        separator +
        ",tableau_cartes[ID: Nom])",
      "Cartes_PK"
    );
    // @ts-ignore
    wb.definedNames.addFormula(
      "CONCATENATE(tableau_sentiers[ID: Zone, Carte]," +
        separator +
        ",tableau_sentiers[ID: Nom])",
      "Sentier_PK"
    );
    // @ts-ignore
    wb.definedNames.addFormula(
      "CONCATENATE(tableau_interestPoint[ID: Zone, Carte]," +
        separator +
        ",tableau_interestPoint[ID: Nom])",
      "PointInteret_PK"
    );

    //keys
    key_sheet.getCell("A1").value = "Cartes_PK";
    key_sheet.getCell("A2").value = "=Cartes_PK";

    key_sheet.getCell("B1").value = "Sentier_PK";
    key_sheet.getCell("B2").value = "=Sentier_PK";

    key_sheet.getCell("C1").value = "PointInteret_PK";
    key_sheet.getCell("C2").value = "=PointInteret_PK";

    /** # Add validation to first column */
    this.dataValidationWrapper(
      usermap_sheet,
      "Zone_ID",
      "'ID: Zone'",
      "'Zone'"
    );
    this.dataValidationWrapper(
      sentier_sheet,
      "Keys!A:A",
      "'ID: Zone', 'ID: Nom'",
      "'Carte'"
    );
    this.dataValidationWrapper(
      coordinateSentier_sheet,
      "Keys!B:B",
      "'ID: Carte', 'ID: Nom'",
      "'Sentier'"
    );
    this.dataValidationWrapper(
      interestPoint_sheet,
      "Keys!A:A",
      "'ID: Zone', 'ID: Nom'",
      "'Carte'"
    );
    this.dataValidationWrapper(
      interestPointData_sheet,
      "Keys!C:C",
      "'ID: Sentier', 'ID: Nom'",
      "'Point d'interet'"
    );

    await wb.xlsx.writeFile(filename);

    return "write succesful";
  }

  /**
   * Abstraction pour ajouter un 'table Excel' contenant les données dans un fichier Excel
   * @param sheet Une feuille du fichier Excel.
   * @param table_name Nom à attribuer à la table.
   * @param columns Le nom donné à chaque colonne de l'entité 'table Excel'.
   * @param excel_model La map des colonnes pour chaque feuille Excel.
   * @param model_key La clé du paramètre 'excel_model' pour obtenir les colonnes à ajouter au 'table Excel'.
   */
  private static addTableWrapper(
    sheet: Worksheet,
    table_name: string,
    columns: any,
    excel_model: Map<any, any>,
    model_key: string
  ) {
    sheet.addTable({
      name: table_name,
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleDark3",
        showRowStripes: true,
      },
      columns: columns.get(model_key),
      rows: excel_model.get(model_key),
    });
    this.makeColumnsPretty(sheet);
  }

  /** Création statique de la définition des colonnes pour les 'tables Excel'. */
  private static MakeColumnsMap() {
    let ColumnsMap = new Map();

    let zone_columns = [{ name: "ID: Nom", filterButton: true }];

    let usermap_columns = [
      { name: "ID: Zone", filterButton: true },
      { name: "ID: Nom", filterButton: true },
      { name: "Path", filterButton: true },
      { name: "Coin gauche sup. longitude", filterButton: true },
      { name: "Coin gauche sup. latitude", filterButton: true },
      { name: "Coin droit sup. longitude", filterButton: true },
      { name: "Coin droit sup. latitude", filterButton: true },
      { name: "Coin gauche inf. longitude", filterButton: true },
      { name: "Coin gauche inf. latitude", filterButton: true },
      { name: "Coin droit inf. longitude", filterButton: true },
      { name: "Coin droit inf. latitude", filterButton: true },
    ];

    let sentier_columns = [
      { name: "ID: Zone, Carte", filterButton: true },
      { name: "ID: Nom", filterButton: true },
      { name: "Description", filterButton: true },
      { name: "Difficultée", filterButton: true },
      { name: "Couleur du sentier", filterButton: true },
      { name: "Active", filterButton: true },
    ];

    let trailCoordinates_columns = [
      { name: "ID: Zone, Carte, Sentier", filterButton: true },
      { name: "Longitude", filterButton: true },
      { name: "Latitude", filterButton: true },
      { name: "Altitude", filterButton: true },
    ];

    let interestPoint_columns = [
      { name: "ID: Zone, Carte", filterButton: true },
      { name: "ID: Nom", filterButton: true },
      { name: "Description", filterButton: true },
      { name: "Type d'intérêt", filterButton: true },
      { name: "Active", filterButton: true },
      { name: "Longitude", filterButton: true },
      { name: "Latitude", filterButton: true },
    ];

    let interestPointData_columns = [
      { name: "ID: Point d'interet", filterButton: true },
      { name: "Type de donnee", filterButton: true },
      { name: "Donnee", filterButton: true },
    ];

    let partners_columns = [
      { name: "nom", filterButton: true },
      { name: "uri", filterButton: true },
    ];

    ColumnsMap.set("zones", zone_columns);
    ColumnsMap.set("user_maps", usermap_columns);
    ColumnsMap.set("sentiers", sentier_columns);
    ColumnsMap.set("coordinate_sentiers", trailCoordinates_columns);
    ColumnsMap.set("interest_points", interestPoint_columns);
    ColumnsMap.set("interest_points_data", interestPointData_columns);
    ColumnsMap.set("partners", partners_columns);

    return ColumnsMap;
  }

  /**
   * Insère les lignes de Excel dans un objet CompleteModel.
   * @param model Un objet CompleteModel.
   * @returns Un objet CompleteModel.
   */
  static FormatModelToExcel(model: CompleteModel) {
    const separator = ", ";
    let ExcelModel = new Map();

    const zoneRows: string[][] = [];
    const usermapRows: any[][] = [];
    const sentierRows: any[][] = [];
    const coordinateSentierRows: any[][] = [];
    const interestPointRows: any[][] = [];
    const interestPointDataRows: any[][] = [];
    const partnersRows: any[][] = [];

    model.zones.forEach(function (zone) {
      zoneRows.push([zone._id]);

      zone.maps.forEach(function (usermap) {
        usermapRows.push([
          zone._id,
          usermap.name,
          usermap.map_file,
          usermap.topLeftCoordinate.longitude,
          usermap.topLeftCoordinate.latitude,
          usermap.topRightCoordinate.longitude,
          usermap.topRightCoordinate.latitude,
          usermap.bottomLeftCoordinate.longitude,
          usermap.bottomLeftCoordinate.latitude,
          usermap.bottomRightCoordinate.longitude,
          usermap.bottomRightCoordinate.latitude,
        ]);

        usermap.trails.forEach(function (trail) {
          sentierRows.push([
            zone._id + separator + usermap.name,
            trail.name,
            trail.description,
            trail.difficulty,
            trail.color,
            trail.active,
          ]);

          trail.trailCoordinates.forEach(function (point) {
            coordinateSentierRows.push([
              zone._id + separator + usermap.name + separator + trail.name,
              point.longitude,
              point.latitude,
              point.altitude,
            ]);
          });
        });

        usermap.pointsOfInterest.forEach(function (interest_point) {
          interestPointRows.push([
            zone._id + separator + usermap.name,
            interest_point.name,
            interest_point.description,
            interest_point.type,
            interest_point.active,
            interest_point.coordinate.longitude,
            interest_point.coordinate.latitude,
          ]);

          interest_point.data.forEach(function (interest_point_data) {
            interestPointDataRows.push([
              zone._id +
              separator +
              usermap.name +
              separator +
              interest_point.name,
              interest_point_data.type,
              interest_point_data.data,
            ]);
          });
        });
      });
    });

    model.partners.forEach(function (partner) {
      partnersRows.push([partner.name, partner.uri]);
    });

    if (interestPointDataRows.length === 0)
      interestPointDataRows.push([
        "Bolton, default, Lac Trousers",
        "image",
        "img",
      ]);

    if (partnersRows.length === 0) partnersRows.push(["exemple", "exemple"]);

    ExcelModel.set("zones", zoneRows);
    ExcelModel.set("user_maps", usermapRows);
    ExcelModel.set("sentiers", sentierRows);
    ExcelModel.set("coordinate_sentiers", coordinateSentierRows);
    ExcelModel.set("interest_points", interestPointRows);
    ExcelModel.set("interest_points_data", interestPointDataRows);
    ExcelModel.set("partners", partnersRows);

    return ExcelModel;
  }

  /**
   * Ajuste la longueur des colonnes
   * @param sheet Une feuille du fichier Excel.
   */
  static makeColumnsPretty(sheet: Worksheet) {
    sheet.columns.forEach((column) => {
      var maxLength = 0;
      // @ts-ignore
      column.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }

  /**
   * Abstraction pour ajouter une validation des données à la première colonne d'une feuille Excel
   * @param sheet Une feuille du fichier Excel.
   * @param formula La formule en VBA pour la validation des données.
   * @param foreign_key Spécifie à l'utilisateur quelles colonnes composent la clé étrangère de cette feuille.
   * @param feuille Spécifie à l'utilisateur l'entitée parente de cette feuille, le lien de dépendance.
   */
  private static dataValidationWrapper(
    sheet: Worksheet,
    formula: string,
    foreign_key: string,
    feuille: string
  ) {
    sheet
      .getColumn("A")
      .eachCell({ includeEmpty: true }, function (cell, rowNumber) {
        if (rowNumber !== 1) {
          cell.dataValidation = {
            type: "list",
            allowBlank: true,
            showInputMessage: true,
            formulae: [formula],
            // showErrorMessage: true,
            promptTitle: "Foreign Key",
            prompt:
              "La valeur doit être présente dans la colonne " +
              foreign_key +
              " de la feuille " +
              feuille +
              ".",
          };
        }
      });
  }
}