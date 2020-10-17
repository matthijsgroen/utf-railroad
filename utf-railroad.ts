type Plotter = (x: number, y: number, char: string) => void;
type Coord = { x: number; y: number };
type DiagramElement = {
  items?: DiagramElement[];
  up: number;
  down: number;
  height: number;
  width: number;
  draw(plotter: Plotter, start: Coord): void;
};

const drawLine = (plotter: Plotter, { x, y }: Coord, text: string) =>
  [...text].forEach((char, i) => plotter(x + i, y, char));

const delta = ({ x, y }: Coord, xDelta = 0, yDelta = 0): Coord => ({
  x: x + xDelta,
  y: y + yDelta,
});

const s = {
  h: "─",
  hu: "┴",
  hd: "┬",
  v: "│",
  vr: "├",
  vl: "┤",
  tl: "╭",
  tr: "╮",
  bl: "╰",
  br: "╯",
  right: "→",
  left: "←",
};

const terminal = (name: string): DiagramElement => ({
  up: 1,
  down: 1,
  height: 0,
  width: name.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), `╭${"─".repeat(name.length + 2)}╮`);
    drawLine(plotter, start, `┤ ${name} ├`);
    drawLine(plotter, delta(start, 0, 1), `╰${"─".repeat(name.length + 2)}╯`);
  },
});

const nonTerminal = (name: string): DiagramElement => ({
  up: 1,
  down: 1,
  height: 0,
  width: name.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), `┏${"━".repeat(name.length + 2)}┓`);
    drawLine(plotter, start, `┨ ${name} ┠`);
    drawLine(plotter, delta(start, 0, 1), `┗${"━".repeat(name.length + 2)}┛`);
  },
});

const special = (name: string): DiagramElement => ({
  up: 1,
  down: 1,
  height: 0,
  width: name.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), `╭${"┄".repeat(name.length + 2)}╮`);
    drawLine(plotter, start, `┤ ${name} ├`);
    drawLine(plotter, delta(start, 0, 1), `╰${"┄".repeat(name.length + 2)}╯`);
  },
});

const comment = (comment: string): DiagramElement => ({
  up: 0,
  down: 0,
  height: 0,
  width: comment.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, start, `─ ${comment} ─`);
  },
});

const commentWithLine = (comment: string): DiagramElement => ({
  up: 1,
  down: 0,
  height: 0,
  width: comment.length + 2,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), ` ${comment} `);
    drawLine(plotter, start, "─".repeat(comment.length + 2));
  },
});

const diagram = (element: DiagramElement, complex = false): DiagramElement => ({
  up: 0 + element.up,
  down: 0 + element.down + element.height,
  height: element.height,
  width: 2 + element.width,
  draw: (plotter, start) => {
    plotter(start.x, start.y, complex ? "╟" : "┠");
    plotter(
      start.x + element.width + 1,
      start.y + element.height,
      complex ? "╢" : "┨"
    );
    element.draw(plotter, delta(start, 1));
  },
});

const sequence = (elements: DiagramElement[]): DiagramElement => ({
  items: elements,
  up: Math.max(...elements.map((e) => e.up)),
  down: Math.max(...elements.map((e) => e.down)),
  height: 0,
  width: elements.reduce((acc, element) => acc + element.width + 1, 1),
  draw: (plotter, start) => {
    plotter(start.x, start.y, s.h);
    let xDelta = 1;
    elements.forEach((element) => {
      element.draw(plotter, delta(start, xDelta));
      xDelta += element.width;
      if (element.height === 0) {
        plotter(start.x + xDelta, start.y, s.h);
      } else {
        plotter(start.x + xDelta, start.y, s.tl);
        for (let h = 1; h < element.height; h++) {
          plotter(start.x + xDelta, start.y + h, s.v);
        }
        plotter(start.x + xDelta, start.y + element.height, s.br);
      }
      xDelta += 1;
    });
  },
});

const alignWidth = (
  plotter: Plotter,
  element: DiagramElement,
  { x, y }: Coord,
  width: number
) => {
  const remainingWidth = width - element.width;
  const left = Math.floor(remainingWidth / 2);
  const right = remainingWidth - left;
  element.draw(plotter, { x: x + left, y });

  for (let l = 0; l < left; l++) {
    plotter(x + l, y, s.h);
  }
  for (let r = 0; r < right; r++) {
    plotter(x + left + element.width + r, y + element.height, s.h);
  }
};

const skip = (content = ""): DiagramElement => ({
  up: 0,
  down: 0,
  height: 0,
  width: content.length,
  draw: (plotter, start) => {
    drawLine(plotter, start, content);
  },
});

const choice = (
  elements: DiagramElement[],
  defaultChoice = 0
): DiagramElement => {
  if (elements.length === 1) {
    return elements[0];
  }
  const up = elements.reduce(
    (acc, element, i) =>
      i === defaultChoice
        ? acc + element.up
        : i < defaultChoice
        ? acc + element.up + element.down + element.height + 1
        : acc,
    0
  );
  const down = elements.reduce(
    (acc, element, i) =>
      i === defaultChoice
        ? acc + element.down + element.height
        : i > defaultChoice
        ? acc + element.up + element.down + element.height + 1
        : acc,
    0
  );

  const width = Math.max(...elements.map((e) => e.width));
  const height = elements[defaultChoice].height;

  return {
    items: elements,
    up,
    down: down - height,
    height,
    width: width + 2,
    draw: (plotter, start) => {
      let yDelta = -up;
      elements.forEach((element, i, l) => {
        if (i === 0) {
          plotter(
            start.x,
            start.y + yDelta + element.up,
            yDelta < -element.up ? s.tl : s.hd
          );
          plotter(
            start.x + width + 1,
            start.y + yDelta + element.height + element.up,
            yDelta < -element.up ? s.tr : s.hd
          );
        } else if (i === l.length - 1) {
          plotter(
            start.x,
            start.y + yDelta + element.up,
            yDelta > 0 ? s.bl : s.hu
          );
          plotter(
            start.x + width + 1,
            start.y + yDelta + element.height + element.up,
            yDelta > 0 ? s.br : s.hu
          );
        } else {
          plotter(
            start.x,
            start.y + yDelta + element.up,
            i === defaultChoice ? "┼" : "├"
          );
          plotter(
            start.x + width + 1,
            start.y + yDelta + element.height + element.up,
            i === defaultChoice ? "┼" : "┤"
          );
        }

        if (i !== l.length - 1) {
          for (let y = 1; y <= element.down + element.height; y++) {
            plotter(start.x, start.y + element.up + yDelta + y, s.v);
          }
          for (let y = 1; y <= element.down; y++) {
            plotter(
              start.x + 1 + width,
              start.y + element.up + yDelta + y + element.height,
              s.v
            );
          }
        }
        if (i !== 0) {
          for (let y = 1; y <= element.up; y++) {
            plotter(start.x, start.y + element.up + yDelta - y, s.v);
          }
          for (let y = 1; y <= element.up + element.height; y++) {
            plotter(
              start.x + 1 + width,
              start.y + element.up + yDelta - y + element.height,
              s.v
            );
          }
        }
        alignWidth(
          plotter,
          element,
          delta(start, 1, yDelta + element.up),
          width
        );

        yDelta += element.height + element.down + +element.up + 1;
      });
    },
  };
};

const optional = (element: DiagramElement): DiagramElement =>
  choice([skip(s.right), element], 1);

const stack = (elements: DiagramElement[]): DiagramElement => {
  const up = elements[0].up;
  const down = elements[elements.length - 1].down;
  const height = elements.reduce(
    (acc, element, i, l) =>
      i === 0
        ? acc + element.height + 1
        : acc + l[i - 1].down + element.up + element.height + 1,
    elements.length - 2
  );

  const width = Math.max(...elements.map((e) => e.width));

  return {
    items: elements,
    up,
    down,
    height,
    width: width + 2,
    draw: (plotter, start) => {
      plotter(start.x, start.y, s.h);
      let yDelta = -up;
      elements.forEach((element, i, l) => {
        alignWidth(
          plotter,
          element,
          delta(start, 1, yDelta + element.up),
          width
        );

        if (i < l.length - 1) {
          alignWidth(
            plotter,
            skip(s.left),
            delta(
              start,
              1,
              yDelta + element.up + element.height + element.down + 1
            ),
            width
          );
          plotter(
            start.x + width + 1,
            start.y + element.up + element.height + yDelta,
            s.tr
          );
          for (let y = 1; y <= element.down; y++) {
            plotter(
              start.x + width + 1,
              start.y + element.up + element.height + yDelta + y,
              s.v
            );
          }
          plotter(
            start.x + width + 1,
            start.y + element.up + element.height + yDelta + element.down + 1,
            s.br
          );
        }

        if (i > 0) {
          plotter(start.x, start.y + yDelta - 1, s.tl);
          for (let y = 0; y < element.up; y++) {
            plotter(start.x, start.y + yDelta + y, s.v);
          }
          plotter(start.x, start.y + yDelta + element.up, s.bl);
        }

        yDelta += element.up + element.height + 2 + element.down;
      });
      plotter(start.x + width + 1, start.y + height, s.h);
    },
  };
};

const repeater = (repeat: DiagramElement, inBetween = skip()): DiagramElement =>
  choice([repeat, sequence([inBetween, skip(s.left)])]);

const horizontalChoice = (elements: DiagramElement[]): DiagramElement => {
  if (elements.length === 1) {
    return elements[0];
  }
  const up = elements.reduce(
    (acc, element) => (element.up > acc ? element.up : acc),
    -Infinity
  );

  const down = elements.reduce(
    (acc, element) =>
      element.down + element.height > acc ? element.down + element.height : acc,
    -Infinity
  );

  const width = elements.reduce((acc, element) => acc + element.width + 2, 0);

  return {
    items: elements,
    up,
    down,
    height: 0,
    width,
    draw: (plotter, start) => {
      plotter(start.x, start.y, s.hu);
      let xDelta = 1;
      elements.forEach((element, i) => {
        for (let y = 1; y <= up; y++) {
          plotter(start.x + xDelta - 1, start.y - y, s.v);
        }
        if (i === 0) {
          plotter(start.x + xDelta - 1, start.y - up - 1, s.tl);
          drawLine(
            plotter,
            delta(start, xDelta, -up - 1),
            s.h.repeat(element.width + 1)
          );
        } else if (i === elements.length - 1) {
          plotter(start.x + xDelta - 1, start.y - up - 1, s.tr);
          drawLine(
            plotter,
            delta(start, xDelta - 1, down + 1),
            s.h.repeat(element.width + 1)
          );
        } else {
          plotter(start.x + xDelta - 1, start.y - up - 1, s.hd);
          drawLine(
            plotter,
            delta(start, xDelta, -up - 1),
            s.h.repeat(element.width + 1)
          );
          drawLine(
            plotter,
            delta(start, xDelta - 1, down + 1),
            s.h.repeat(element.width + 1)
          );
        }

        element.draw(plotter, delta(start, xDelta));
        xDelta += element.width;

        for (let y = 1; y <= down - element.height; y++) {
          plotter(start.x + xDelta, start.y + y + element.height, s.v);
        }
        if (i === 0) {
          plotter(start.x + xDelta, start.y + down + 1, s.bl);
        } else if (i === elements.length - 1) {
          plotter(start.x + xDelta, start.y + down + 1, s.br);
        } else {
          plotter(start.x + xDelta, start.y + down + 1, s.hu);
        }

        if (i < elements.length - 1) {
          plotter(start.x + xDelta, start.y + element.height, s.tr);
          plotter(start.x + xDelta + 1, start.y, s.bl);
        } else {
          plotter(start.x + xDelta, start.y, s.hd);
        }
        xDelta += 2;
      });
    },
  };
};

const draw = (element: DiagramElement) => {
  type Point = { x: number; y: number; char: string };
  // determine width / height
  const points: Point[] = [];
  const plotter: Plotter = (x, y, char) => {
    points.push({ x, y, char });
  };

  element.draw(plotter, { x: 0, y: 0 });

  const minX = points.reduce(
    (min, item) => (item.x < min ? item.x : min),
    Infinity
  );
  const minY = points.reduce(
    (min, item) => (item.y < min ? item.y : min),
    Infinity
  );
  const maxX = points.reduce(
    (max, item) => (item.x > max ? item.x : max),
    -Infinity
  );
  const maxY = points.reduce(
    (max, item) => (item.y > max ? item.y : max),
    -Infinity
  );

  const height = maxY - minY;
  const width = maxX - minX;

  const canvas = Array(height + 1)
    .fill(null)
    .map(() => Array(width + 1).fill(" "));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const point = points.find((e) => e.x === x && e.y === y);
      if (point) {
        canvas[y - minY][x - minX] = point.char;
      }
    }
  }

  return canvas.map((l) => l.join("")).join("\n");
};

export {
  choice,
  comment,
  commentWithLine,
  diagram,
  draw,
  horizontalChoice,
  nonTerminal,
  optional,
  repeater,
  sequence,
  skip,
  special,
  stack,
  terminal,
};
