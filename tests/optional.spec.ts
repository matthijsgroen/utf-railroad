import { draw, optional, terminal } from "../utf-railroad";

describe("optional", () => {
  it("adds a skip line", () => {
    const diagram = optional(terminal("abc"));
    const output = draw(diagram);
    // prettier-ignore
    expect(output).toEqual([
        "╭───→───╮",
        "│╭─────╮│",
        "┴┤ abc ├┴",
        " ╰─────╯ ",
    ].join("\n"))
  });
});
