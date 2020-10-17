import { draw, repeater, terminal } from "../ascii-diagram";

describe("repeater", () => {
  it("can repeat single item", () => {
    const diagram = repeater(terminal("abc"));
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        " ╭─────╮ ",
        "┬┤ abc ├┬",
        "│╰─────╯│",
        "╰───←───╯",
    ].join("\n"))
  });

  it("can render in between items", () => {
    const diagram = repeater(terminal("abc"), terminal(","));
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "  ╭─────╮  ",
        "┬─┤ abc ├─┬",
        "│ ╰─────╯ │",
        "│ ╭───╮   │",
        "╰─┤ , ├─←─╯",
        "  ╰───╯    ",
    ].join("\n"))
  });
});
