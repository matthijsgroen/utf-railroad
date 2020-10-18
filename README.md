# UTF Railroad

Draw railroad diagrams using UTF-8 characters.

## Usage

```javascript
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
```

output:

```
  ╭───────╮ ┏━━━━━━━┓
╟─┤ hello ├─┨ world ┠─╢
  ╰───────╯ ┗━━━━━━━┛
```

Shapes supported:

- Diagram: `diagram(element: DiagramElement, complex: boolean = false): DiagramElement`
- Terminal: `terminal(content: string): DiagramElement`
- Non-Terminal: `nonTerminal(content: string): DiagramElement`
- Special: `special(content: string): DiagramElement`
- Sequence: `sequence(elements: DiagramElement[]): DiagramElement`
- Stack: `stack(elements: DiagramElement[]): DiagramElement`
- Choice: `choice(elements: DiagramElement[], defaultOption: number = 0): DiagramElement`
- Horizontal Choice: `horizontalChoice(elements: DiagramElement[]): DiagramElement`
- Optional: `optional(element: DiagramElement): DiagramElement`
- Repeater: `repeater(element: DiagramElement, inBetween?: DiagramElement): DiagramElement`
- Group: `group(element: DiagramElement, label?: string): DiagramElement`
- Comment: `comment(comment: string): DiagramElement`
- Comment with line: `commentWithLine(comment: string): DiagramElement`

## Examples

JSON Array:

```
  ╭───╮ ┏━━━━━━━┓  ┏━━━━━━━┓  ╭───╮
╟─┤ [ ├─┨ value ┠─┬┨ value ┠┬─┤ ] ├─╢
  ╰───╯ ┗━━━━━━━┛ │┗━━━━━━━┛│ ╰───╯
                  │ ╭───╮   │
                  ╰─┤ , ├─←─╯
                    ╰───╯
```

JSON String:

```
        ╭───────────────────────────────→────────────────────────────────╮
  ╭───╮ │  ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮  │ ╭───╮
┠─┤ " ├─┴┬┬┤ Any unicode character except " or \ or control character ├┬┬┴─┤ " ├─┨
  ╰───╯  ││╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯││  ╰───╯
         ││          ╭───╮      ╭───╮  quotation mark                  ││
         │╰──────────┤ \ ├─┬────┤ " ├──────────────────────┬───────────╯│
         │           ╰───╯ │    ╰───╯                      │            │
         │                 │    ╭───╮  reverse solidus     │            │
         │                 ├────┤ \ ├──────────────────────┤            │
         │                 │    ╰───╯                      │            │
         │                 │        ╭───╮  solidus         │            │
         │                 ├────────┤ / ├──────────────────┤            │
         │                 │        ╰───╯                  │            │
         │                 │       ╭───╮  backspace        │            │
         │                 ├───────┤ b ├───────────────────┤            │
         │                 │       ╰───╯                   │            │
         │                 │       ╭───╮  formfeed         │            │
         │                 ├───────┤ f ├───────────────────┤            │
         │                 │       ╰───╯                   │            │
         │                 │        ╭───╮  newline         │            │
         │                 ├────────┤ n ├──────────────────┤            │
         │                 │        ╰───╯                  │            │
         │                 │    ╭───╮  carriage return     │            │
         │                 ├────┤ r ├──────────────────────┤            │
         │                 │    ╰───╯                      │            │
         │                 │    ╭───╮  horizontal tab      │            │
         │                 ├────┤ t ├──────────────────────┤            │
         │                 │    ╰───╯                      │            │
         │                 │ ╭───╮  ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮  │            │
         │                 ╰─┤ u ├─┬┤ hexadecimal digit ├┬─╯            │
         │                   ╰───╯ │╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯│              │
         │                         ╰───────╴4 x╶─←───────╯              │
         ╰───────────────────────────────←──────────────────────────────╯
```

## Licence

The code is licensed under MIT (see LICENSE file).

## Contributing

Thanks for your interest in contributing! There are many ways to contribute to
this project. [Get started here](CONTRIBUTING.md)
