import { draw, special } from "../utf-railroad";

describe("nonTerminal", () => {
  it("renders a box with a thick line", () => {
    // prettier-ignore
    expect(draw(special("hello"))).toEqual([
      "╭┄┄┄┄┄┄┄╮", 
      "┤ hello ├", 
      "╰┄┄┄┄┄┄┄╯"
    ].join("\n")
    );
  });
});
