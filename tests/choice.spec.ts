import { draw, choice, terminal, stack } from "../ascii-railroad";

describe("choice", () => {
  it("can render a single item", () => {
    const diagram = choice([terminal("a")]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭───╮",
        "┤ a ├",
        "╰───╯"
    ].join("\n"))
  });

  it("can render multiple items and uses first as default", () => {
    const diagram = choice([terminal("a"), terminal("b"), terminal("c")]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ",
        "┬┤ a ├┬",
        "│╰───╯│",
        "│╭───╮│",
        "├┤ b ├┤",
        "│╰───╯│",
        "│╭───╮│",
        "╰┤ c ├╯",
        " ╰───╯ ",
    ].join("\n"))
  });

  it("can render multiple items and supports second default", () => {
    const diagram = choice([terminal("a"), terminal("b"), terminal("c")], 1);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ",
        "╭┤ a ├╮",
        "│╰───╯│",
        "│╭───╮│",
        "┼┤ b ├┼",
        "│╰───╯│",
        "│╭───╮│",
        "╰┤ c ├╯",
        " ╰───╯ ",
    ].join("\n"))
  });

  it("can render multiple items and supports bottom as default", () => {
    const diagram = choice([terminal("a"), terminal("b"), terminal("c")], 2);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ",
        "╭┤ a ├╮",
        "│╰───╯│",
        "│╭───╮│",
        "├┤ b ├┤",
        "│╰───╯│",
        "│╭───╮│",
        "┴┤ c ├┴",
        " ╰───╯ ",
    ].join("\n"))
  });

  it("can render items with a height", () => {
    const diagram = choice(
      [terminal("a"), stack([terminal("b"), terminal("c")]), terminal("d")],
      1
    );
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "  ╭───╮  ",
        "╭─┤ a ├─╮",
        "│ ╰───╯ │",
        "│ ╭───╮ │",
        "┼─┤ b ├╮│",
        "│ ╰───╯││",
        "│╭──←──╯│",
        "││╭───╮ │",
        "│╰┤ c ├─┼",
        "│ ╰───╯ │",
        "│ ╭───╮ │",
        "╰─┤ d ├─╯",
        "  ╰───╯  "
    ].join("\n"));
    expect(diagram.height).toEqual(4);
    expect(diagram.up).toEqual(4);
    expect(diagram.down).toEqual(4);
  });

  it("can render items with a height", () => {
    const diagram = choice(
      [terminal("a"), stack([terminal("b"), terminal("c")]), terminal("d")],
      0
    );
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "  ╭───╮  ",
        "┬─┤ a ├─┬",
        "│ ╰───╯ │",
        "│ ╭───╮ │",
        "├─┤ b ├╮│",
        "│ ╰───╯││",
        "│╭──←──╯│",
        "││╭───╮ │",
        "│╰┤ c ├─┤",
        "│ ╰───╯ │",
        "│ ╭───╮ │",
        "╰─┤ d ├─╯",
        "  ╰───╯  "
    ].join("\n"));
    expect(diagram.height).toEqual(0);
    expect(diagram.up).toEqual(1);
    expect(diagram.down).toEqual(11);
  });

  it("can supports items of different width", () => {
    const diagram = choice([
      terminal("abc"),
      terminal("d"),
      terminal("efgh"),
      terminal("i"),
      terminal("jklmnop"),
    ]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "   ╭─────╮   ",
        "┬──┤ abc ├──┬",
        "│  ╰─────╯  │",
        "│   ╭───╮   │",
        "├───┤ d ├───┤",
        "│   ╰───╯   │",
        "│ ╭──────╮  │",
        "├─┤ efgh ├──┤",
        "│ ╰──────╯  │",
        "│   ╭───╮   │",
        "├───┤ i ├───┤",
        "│   ╰───╯   │",
        "│╭─────────╮│",
        "╰┤ jklmnop ├╯",
        " ╰─────────╯ "
    ].join("\n"))
  });
});
