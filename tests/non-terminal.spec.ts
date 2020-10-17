import { draw, nonTerminal } from "../ascii-diagram";

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
