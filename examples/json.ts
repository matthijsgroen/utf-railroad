import {
  draw,
  diagram,
  terminal,
  sequence,
  nonTerminal,
  repeater,
  choice,
  special,
  optional,
  commentWithLine,
  comment,
} from "../utf-railroad";

const jsonArray = sequence([
  terminal("["),
  nonTerminal("value"),
  repeater(nonTerminal("value"), terminal(",")),
  terminal("]"),
]);

console.log("JSON - array:");
console.log(draw(diagram(jsonArray, true)));

const jsonString = sequence([
  terminal('"'),
  optional(
    repeater(
      choice([
        special('Any unicode character except " or \\ or control character'),
        sequence([
          terminal("\\"),
          choice([
            sequence([terminal('"'), commentWithLine("quotation mark")]),
            sequence([terminal("\\"), commentWithLine("reverse solidus")]),
            sequence([terminal("/"), commentWithLine("solidus")]),
            sequence([terminal("b"), commentWithLine("backspace")]),
            sequence([terminal("f"), commentWithLine("formfeed")]),
            sequence([terminal("n"), commentWithLine("newline")]),
            sequence([terminal("r"), commentWithLine("carriage return")]),
            sequence([terminal("t"), commentWithLine("horizontal tab")]),
            sequence([
              terminal("u"),
              repeater(special("hexadecimal digit"), comment("4 x")),
            ]),
          ]),
        ]),
      ])
    )
  ),
  terminal('"'),
]);

console.log("JSON - string:");
console.log(draw(diagram(jsonString, false)));
