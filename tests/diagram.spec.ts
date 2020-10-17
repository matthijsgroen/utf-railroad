import { terminal, draw, nonTerminal, diagram } from "../ascii-diagram";

describe("complex diagram", () => {
  it("renders a start and end to a shape", () => {
    // prettier-ignore
    expect(draw(diagram(nonTerminal("hello"), true))).toEqual([
      " ┏━━━━━━━┓ ", 
      "╟┨ hello ┠╢", 
      " ┗━━━━━━━┛ "
    ].join("\n")
    );
  });
});

describe("simple diagram", () => {
  it("renders a start and end to a shape", () => {
    // prettier-ignore
    expect(draw(diagram(terminal("hello"), false))).toEqual([
      " ╭───────╮ ", 
      "┠┤ hello ├┨", 
      " ╰───────╯ "
    ].join("\n")
    );
  });
});
