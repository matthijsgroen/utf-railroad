import { draw, sequence, stack, terminal } from "../utf-railroad";

describe("sequence", () => {
  it("can render a single element", () => {
    const diagram = sequence([terminal("a")]);
    const output = draw(diagram);

    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ",
        "─┤ a ├─",
        " ╰───╯ "
    ].join("\n"))
  });

  it("can render multiple elements", () => {
    const diagram = sequence([terminal("a"), terminal("b"), terminal("c")]);
    const output = draw(diagram);

    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ╭───╮ ╭───╮ ",
        "─┤ a ├─┤ b ├─┤ c ├─",
        " ╰───╯ ╰───╯ ╰───╯ "
    ].join("\n"))
  });

  it("items can have different widths", () => {
    const diagram = sequence([
      terminal("a"),
      terminal("bcdef"),
      terminal("ghi"),
    ]);
    const output = draw(diagram);

    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮ ╭───────╮ ╭─────╮ ",
        "─┤ a ├─┤ bcdef ├─┤ ghi ├─",
        " ╰───╯ ╰───────╯ ╰─────╯ "
    ].join("\n"))
  });

  it("supports items that have a height", () => {
    const diagram = sequence([
      terminal("a"),
      stack([terminal("b"), terminal("c")]),
      terminal("d"),
    ]);
    const output = draw(diagram);

    // prettier-ignore
    expect(output).toEqual([
        " ╭───╮  ╭───╮  ╭───╮ ",
        "─┤ a ├──┤ b ├╮╭┤ d ├─",
        " ╰───╯  ╰───╯││╰───╯ ",
        "       ╭──←──╯│      ",
        "       │╭───╮ │      ",
        "       ╰┤ c ├─╯      ",
        "        ╰───╯        ",
    ].join("\n"))
  });
});
