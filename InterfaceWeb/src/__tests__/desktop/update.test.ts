import { sendForUpdate } from "../../DesktopViews/UpdateView";
import { CompleteModel } from "../../models/completemodel";
import { DatabaseUtils } from "../../Utils/DatabaseUtils";

describe("sendForUpdate", () => {
  jest.mock("../../Utils/DatabaseUtils");
  let consoleOutput: string = "";

  it("should retrun true, the app will be updated.", async () => {
    const expected: boolean = true;

    DatabaseUtils.sendModelToServer = jest.fn().mockImplementationOnce(() => {
      return null;
    });

    console.warn = jest.fn().mockImplementationOnce(() => {
      consoleOutput = "Erreur lors de l'envoi sur le serveur. ";
    });

    await sendForUpdate(
      new File([new ArrayBuffer(1)], "test.xlsx"),
      new CompleteModel()
    ).then((boolResponse) => {
      expect(boolResponse).toBe(expected);
      expect(consoleOutput).toBe("");
    });
  });

  it("should retrun false, the app will not be updated.", async () => {
    const expected: boolean = false;
    let serverResponseMock = "Bad request, status : 401 ";

    DatabaseUtils.sendModelToServer = jest.fn().mockImplementationOnce(() => {
      return serverResponseMock;
    });

    console.log = jest.fn().mockImplementationOnce(() => {
      consoleOutput =
        "Erreur lors de l'envoi sur le serveur. " + serverResponseMock;
    });

    await sendForUpdate(
      new File([new ArrayBuffer(1)], "test.xlsx"),
      new CompleteModel()
    ).then((boolResponse) => {
      expect(boolResponse).toBe(expected);
      expect(consoleOutput).toBe(
        "Erreur lors de l'envoi sur le serveur. " + serverResponseMock
      );
    });
  });
});
