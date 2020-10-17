import { draw, nonTerminal } from "../utf-railroad";

describe("nonTerminal", () => {
  it("renders a box with a thick line", () => {
    // prettier-ignore
    expect(draw(nonTerminal("hello"))).toEqual([
      "┏━━━━━━━┓", 
      "┨ hello ┠", 
      "┗━━━━━━━┛"
    ].join("\n")
    );
  });
});
