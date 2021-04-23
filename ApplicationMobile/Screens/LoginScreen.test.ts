import userPassIsStillAvailable from "./LoginScreen.utils";

describe("Tests on loginScreen", () => {
  const loginDate: Date = new Date(2020, 3, 1, 0, 0, 0, 0);
  const sameDayLaterHour: Date = new Date(2020, 3, 1, 1, 0, 0, 0);
  const oneDayApart: Date = new Date(2020, 3, 2, 0, 0, 0, 0);
  const oneWeekApart: Date = new Date(2020, 3, 8, 0, 0, 0, 0);

  it("should accept to log the user with the same code", async () => {
    expect(userPassIsStillAvailable(sameDayLaterHour, loginDate)).toBe(true);
  });

  it("should reject to log the user with the same code ", async () => {
    expect(userPassIsStillAvailable(oneDayApart, loginDate)).toBe(false);
    expect(userPassIsStillAvailable(sameDayLaterHour, oneWeekApart)).toBe(
      false
    );
  });
});
