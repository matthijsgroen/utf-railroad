import { draw, stack, choice, terminal } from "../ascii-diagram";

describe("stack", () => {
  it("can render a single item", () => {
    const diagram = stack([terminal("a")]);
    const output = draw(diagram);
    //prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ",
        "─┤ a ├─",
        " ╰───╯ ",
    ].join("\n"))
  });

  it("can render muliple items", () => {
    const diagram = stack([terminal("a"), terminal("bcdef")]);
    const output = draw(diagram);
    //prettier-ignore
    expect(output).toEqual([
        "   ╭───╮   ",
        "───┤ a ├──╮",
        "   ╰───╯  │",
        "╭────←────╯",
        "│╭───────╮ ",
        "╰┤ bcdef ├─",
        " ╰───────╯ ",
    ].join("\n"))
  });

  it("can render items with up and down height items", () => {
    const diagram = stack([
      terminal("a"),
      choice([terminal("b"), terminal("c"), terminal("d")], 1),
      terminal("ef"),
    ]);
    const output = draw(diagram);
    //prettier-ignore
    expect(output).toEqual([
        "  ╭───╮  ",
        "──┤ a ├─╮",
        "  ╰───╯ │",
        "╭───←───╯",
        "│ ╭───╮  ",
        "│╭┤ b ├╮ ",
        "││╰───╯│ ",
        "││╭───╮│ ",
        "╰┼┤ c ├┼╮",
        " │╰───╯││",
        " │╭───╮││",
        " ╰┤ d ├╯│",
        "  ╰───╯ │",
        "╭───←───╯",
        "│╭────╮  ",
        "╰┤ ef ├──",
        " ╰────╯  ",
    ].join("\n"))
    expect(diagram.up).toEqual(1);
    expect(diagram.down).toEqual(1);
    expect(diagram.height).toEqual(14);
  });
});
