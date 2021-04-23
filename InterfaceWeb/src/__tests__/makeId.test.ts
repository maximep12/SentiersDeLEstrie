import makeId from "../Utils/MakeId";

describe("GenerateId", () => {
  let idGenerated1: string;
  let idGenerated2: string;

  beforeAll(() => {
    idGenerated1 = makeId();
    idGenerated2 = makeId();
  });

  it("should return a random id, never generated before", () => {
    expect(idGenerated1).not.toEqual(idGenerated2);
  });
});
