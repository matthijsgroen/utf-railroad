import {
  draw,
  diagram,
  sequence,
  terminal,
  nonTerminal,
} from "../utf-railroad";

console.log(
  draw(diagram(sequence([terminal("hello"), nonTerminal("world")]), true))
);
