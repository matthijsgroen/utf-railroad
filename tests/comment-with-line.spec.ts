import { draw, commentWithLine } from "../utf-railroad";

describe("commentWithLine", () => {
  it("renders text", () => {
    // prettier-ignore
    expect(draw(commentWithLine("hello"))).toEqual([
      " hello ", 
      "───────", 
    ].join("\n"));
  });
});
