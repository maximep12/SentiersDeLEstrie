import {
  downloadFile,
  getLastUpdatedDate,
} from "../../DesktopViews/DownloadLastFile";
import { DatabaseUtils } from "../../Utils/DatabaseUtils";

describe("getLastUpdatedExcel", () => {
  jest.mock("../../Utils/DatabaseUtils");

  it("should retrun date.", async () => {
    DatabaseUtils.getDateFromAppStatus = jest.fn().mockImplementation(() => {
      return "27-03-1997";
    });

    await getLastUpdatedDate().then((result) => {
      expect(result).toBe("27-03-1997");
    });
  });
});

describe("downloadFile", () => {
  it("should retrun true, no error while invoking.", async () => {
    window.URL.revokeObjectURL = jest.fn().mockImplementation(() => {
      return;
    });
    var result = await downloadFile();
    expect(result).toBe(true);
  });

  it("should retrun false, there was an error while invoking the url.", async () => {
    window.URL.revokeObjectURL = jest.fn().mockImplementation(() => {
      throw " error ";
    });
    var result = await downloadFile();
    expect(result).toBe(false);
  });
});
