import { draw, horizontalChoice, terminal, stack } from "../ascii-railroad";

describe("horizontalChoice", () => {
  it("can render a single item", () => {
    const diagram = horizontalChoice([terminal("a")]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭───╮",
        "┤ a ├",
        "╰───╯"
    ].join("\n"))
  });

  it("can render multiple items and uses first as default", () => {
    const diagram = horizontalChoice([
      terminal("a"),
      terminal("b"),
      terminal("c"),
    ]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭──────┬──────╮      ",
        "│╭───╮ │╭───╮ │╭───╮ ",
        "┴┤ a ├╮╰┤ b ├╮╰┤ c ├┬",
        " ╰───╯│ ╰───╯│ ╰───╯│",
        "      ╰──────┴──────╯",
    ].join("\n"))
  });

  it("can render items with a height", () => {
    const diagram = horizontalChoice([
      terminal("ab"),
      stack([terminal("b"), terminal("cdef")]),
      terminal("def"),
    ]);
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭───────┬───────────╮        ",
        "│╭────╮ │  ╭───╮    │╭─────╮ ",
        "┴┤ ab ├╮╰──┤ b ├──╮ ╰┤ def ├┬",
        " ╰────╯│   ╰───╯  │  ╰─────╯│",
        "       │ ╭───←────╯         │",
        "       │ │╭──────╮          │",
        "       │ ╰┤ cdef ├─╮        │",
        "       │  ╰──────╯ │        │",
        "       ╰───────────┴────────╯",
    ].join("\n"));
    expect(diagram.height).toEqual(0);
    expect(diagram.up).toEqual(1);
    expect(diagram.down).toEqual(5);
  });
});
