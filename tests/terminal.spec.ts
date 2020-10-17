import { terminal, draw } from "../utf-railroad";

describe("terminal", () => {
  it("renders a box with a thin line", () => {
    // prettier-ignore
    expect(draw(terminal("hello"))).toEqual([
      "╭───────╮", 
      "┤ hello ├", 
      "╰───────╯"
    ].join("\n")
    );
  });
});
