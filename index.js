const drawLine = (plotter, { x, y }, text) =>
  [...text].forEach((char, i) => plotter(x + i, y, char));

const delta = ({ x, y }, xDelta = 0, yDelta = 0) => ({
  x: x + xDelta,
  y: y + yDelta
});

const terminal = name => ({
  up: 1,
  down: 1,
  height: 0,
  width: name.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), `╭${"─".repeat(name.length + 2)}╮`);
    drawLine(plotter, start, `┤ ${name} ├`);
    drawLine(plotter, delta(start, 0, 1), `╰${"─".repeat(name.length + 2)}╯`);
  }
});

const nonTerminal = name => ({
  up: 1,
  down: 1,
  height: 0,
  width: name.length + 4,
  draw: (plotter, start) => {
    drawLine(plotter, delta(start, 0, -1), `┏${"━".repeat(name.length + 2)}┓`);
    drawLine(plotter, start, `┨ ${name} ┠`);
    drawLine(plotter, delta(start, 0, 1), `┗${"━".repeat(name.length + 2)}┛`);
  }
});

const diagram = (element, complex = false) => ({
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
  }
});

const sequence = elements => ({
  up: Math.max(...elements.map(e => e.up)),
  down: Math.max(...elements.map(e => e.down)),
  height: 0,
  width: elements.reduce((acc, element) => acc + element.width + 1, 1),
  draw: (plotter, start) => {
    plotter(start.x, start.y, "─");
    let xDelta = 1;
    elements.forEach(element => {
      element.draw(plotter, delta(start, xDelta));
      xDelta += element.width;
      if (element.height === 0) {
        plotter(start.x + xDelta, start.y, "─");
      } else {
        plotter(start.x + xDelta, start.y, "╭");
        for (let h = 1; h < element.height; h++) {
          plotter(start.x + xDelta, start.y + h, "│");
        }
        plotter(start.x + xDelta, start.y + element.height, "╯");
      }
      xDelta += 1;
    });
  }
});

const alignWidth = (plotter, element, { x, y }, width) => {
  const remainingWidth = width - element.width;
  const left = Math.floor(remainingWidth / 2);
  const right = remainingWidth - left;
  element.draw(plotter, { x: x + left, y });

  for (let l = 0; l < left; l++) {
    plotter(x + l, y, "─");
  }
  for (let r = 0; r < right; r++) {
    plotter(x + left + element.width + r, y + element.height, "─");
  }
};

const skip = () => ({
  up: 0,
  down: 0,
  height: 0,
  width: 0,
  draw: () => {}
});

const choice = (elements, defaultChoice = 0) => {
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

  const width = Math.max(...elements.map(e => e.width));

  return {
    up,
    down,
    height: 0,
    width: width + 2,
    draw: (plotter, start) => {
      let yDelta = -up;
      elements.forEach((element, i, l) => {
        if (i === 0) {
          plotter(
            start.x,
            start.y + yDelta + element.up,
            yDelta < -element.up ? "╭" : "┬"
          );
          plotter(
            start.x + width + 1,
            start.y + yDelta + element.height + element.up,
            yDelta < -element.up ? "╮" : "┬"
          );
        } else if (i === l.length - 1) {
          plotter(
            start.x,
            start.y + yDelta + element.up,
            yDelta > 0 ? "╰" : "┴"
          );
          plotter(
            start.x + width + 1,
            start.y + yDelta + element.height + element.up,
            yDelta > 0 ? "╯" : "┴"
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
            plotter(start.x, start.y + element.up + yDelta + y, "│");
          }
          for (let y = 1; y <= element.down; y++) {
            plotter(
              start.x + 1 + width,
              start.y + element.up + yDelta + y + element.height,
              "│"
            );
          }
        }
        if (i !== 0) {
          for (let y = 1; y <= element.up; y++) {
            plotter(start.x, start.y + element.up + yDelta - y, "│");
          }
          for (let y = 1; y <= element.up + element.height; y++) {
            plotter(
              start.x + 1 + width,
              start.y + element.up + yDelta - y + element.height,
              "│"
            );
          }
        }
        alignWidth(
          plotter,
          element,
          delta(start, 1, yDelta + element.up),
          width
        );

        yDelta += element.height + element.down;
        if (l[i + i]) {
          yDelta += l[i + i].up;
        }

        yDelta += 1;
      });
    }
  };
};

const optional = element => choice([skip(), element], 1);

const stack = elements => {
  const up = elements[0].up;
  const down = elements[elements.length - 1].down;
  const height = elements.reduce(
    (acc, element, i, l) =>
      i === 0
        ? acc + element.height + 1
        : acc + l[i - 1].down + element.up + element.height + 1,
    elements.length - 2
  );

  const width = Math.max(...elements.map(e => e.width));

  return {
    up,
    down,
    height,
    width: width + 2,
    draw: (plotter, start) => {
      plotter(start.x, start.y, "─");
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
            skip(),
            delta(start, 1, yDelta + element.height + element.down + 2),
            width
          );
          plotter(
            start.x + width + 1,
            start.y + element.up + element.height + yDelta,
            "╮"
          );
          for (let y = 1; y <= element.down; y++) {
            plotter(
              start.x + width + 1,
              start.y + element.up + element.height + yDelta + y,
              "│"
            );
          }
          plotter(
            start.x + width + 1,
            start.y + element.up + element.height + yDelta + element.down + 1,
            "╯"
          );
        }

        if (i > 0) {
          plotter(
            start.x,
            start.y + yDelta - element.up, // + element.down + element.height + yDelta + 1,
            "╭"
          );
          for (let y = 0; y < element.up; y++) {
            plotter(start.x, start.y + yDelta - y, "│");
          }
          plotter(start.x, start.y + yDelta + element.up, "╰");
        }

        yDelta += element.height + element.down;
        if (l[i + i]) {
          yDelta += l[i + i].up;
        }
        yDelta += 2;
      });
      plotter(start.x + width + 1, start.y + height, "─");
    }
  };
};

const draw = element => {
  // determine width / height
  const points = [];
  const plotter = (x, y, char) => {
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
      const point = points.find(e => e.x === x && e.y === y);
      if (point) {
        canvas[y - minY][x - minX] = point.char;
      }
    }
  }

  return canvas.map(l => l.join("")).join("\n");
};

console.log(
  draw(
    diagram(
      sequence([
        terminal("foo"),
        stack([
          sequence([nonTerminal("hello"), terminal("nice")]),
          nonTerminal("world"),
          terminal("how are you?")
        ]),
        terminal("qux")
      ]),
      true
    )
  )
);

module.exports = {
  choice,
  diagram,
  draw,
  nonTerminal,
  optional,
  sequence,
  skip,
  terminal
};
