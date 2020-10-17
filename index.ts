import {
  choice,
  diagram,
  draw,
  horizontalChoice,
  nonTerminal,
  optional,
  repeater,
  sequence,
  stack,
  terminal,
} from "./ascii-diagram";

console.log(
  draw(
    diagram(
      sequence([
        terminal("foo"),
        stack([
          sequence([nonTerminal("hello"), terminal("nice")]),
          choice(
            [nonTerminal("mars"), nonTerminal("world"), nonTerminal("moon")],
            1
          ),
          terminal("how are you?"),
          optional(terminal("how are you?")),
        ]),
        repeater(terminal("qux")),
        horizontalChoice([
          terminal("a"),
          stack([terminal("b"), terminal("1")]),
          terminal("c"),
        ]),
      ]),
      true
    )
  )
);
