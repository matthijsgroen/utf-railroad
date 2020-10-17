import { terminal, draw } from "../ascii-diagram";

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
