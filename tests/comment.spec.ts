import { draw, comment } from "../utf-railroad";

describe("comment", () => {
  it("renders text", () => {
    // prettier-ignore
    expect(draw(comment("hello"))).toEqual([
      "─ hello ─", 
    ].join("\n"));
  });
});
