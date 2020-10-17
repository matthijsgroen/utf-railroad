import { draw, group, choice, terminal, stack } from "../utf-railroad";

describe("choice", () => {
  it("can render a single item", () => {
    const diagram = group(terminal("a"));
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
      "╭╌╌╌╌╌╮",
      "╎╭───╮╎",
      "┼┤ a ├┼",
      "╎╰───╯╎",
      "╰╌╌╌╌╌╯",
    ].join("\n"))
  });

  it("can contain items with an up and down in the group", () => {
    const diagram = group(
      choice([terminal("a"), terminal("b"), terminal("c")], 1)
    );
    const output = draw(diagram);
    expect(output).toEqual(
      [
        "╭╌╌╌╌╌╌╌╮",
        "╎ ╭───╮ ╎",
        "╎╭┤ a ├╮╎",
        "╎│╰───╯│╎",
        "╎│╭───╮│╎",
        "┼┼┤ b ├┼┼",
        "╎│╰───╯│╎",
        "╎│╭───╮│╎",
        "╎╰┤ c ├╯╎",
        "╎ ╰───╯ ╎",
        "╰╌╌╌╌╌╌╌╯",
      ].join("\n")
    );
  });

  it("can render items with a height", () => {
    const diagram = group(stack([terminal("b"), terminal("c")]));
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭╌╌╌╌╌╌╌╮",
        "╎ ╭───╮ ╎",
        "┼─┤ b ├╮╎",
        "╎ ╰───╯│╎",
        "╎╭──←──╯╎",
        "╎│╭───╮ ╎",
        "╎╰┤ c ├─┼",
        "╎ ╰───╯ ╎",
        "╰╌╌╌╌╌╌╌╯",
    ].join("\n"));
    expect(diagram.height).toEqual(4);
    expect(diagram.up).toEqual(2);
    expect(diagram.down).toEqual(2);
  });

  it("can render a label longer than contents", () => {
    const diagram = group(terminal("a"), "nice label");
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
      "╭╴nice label╶╮",
      "╎   ╭───╮    ╎",
      "┼───┤ a ├────┼",
      "╎   ╰───╯    ╎",
      "╰╌╌╌╌╌╌╌╌╌╌╌╌╯",
    ].join("\n"))
  });

  it("can render a label shorter than contents", () => {
    const diagram = group(terminal("abcdefghijklemnop"), "nice");
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
      "╭╴nice╶╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮",
      "╎╭───────────────────╮╎",
      "┼┤ abcdefghijklemnop ├┼",
      "╎╰───────────────────╯╎",
      "╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯",
    ].join("\n"))
  });
});
