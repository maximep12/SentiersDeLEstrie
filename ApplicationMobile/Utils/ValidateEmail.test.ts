import ValidateEmail from "./ValidateEmail";

describe("ValidateEmail", () => {
  const invalidInput = "123456";
  const invalidInput2 = "123456@";
  const invalidInput3 = "123456@12354";
  const invalidInput4 = "123456@12354.";
  const invalidInput5 = "123456@12354.c";
  const invalidInput6 = "";
  const validInput = "test@test.com";

  it("should reject every invalid input", async () => {
    expect(ValidateEmail(invalidInput)).toBe(false);
    expect(ValidateEmail(invalidInput2)).toBe(false);
    expect(ValidateEmail(invalidInput3)).toBe(false);
    expect(ValidateEmail(invalidInput4)).toBe(false);
    expect(ValidateEmail(invalidInput5)).toBe(false);
    expect(ValidateEmail(invalidInput6)).toBe(false);
  });

  it("should accept a valid input", async () => {
    expect(ValidateEmail(validInput)).toBe(true);
  });
});
