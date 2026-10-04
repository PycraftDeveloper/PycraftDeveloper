const hexBg = document.getElementById('hexBg');

function createHexGrid() {
  hexBg.innerHTML = '';

  const width = window.innerWidth;
  const height = window.innerHeight;

  const radius = 20;

  const hexWidth = Math.sqrt(3) * radius;
  const rowHeight = radius * 1.5;

  const columns = Math.ceil(width / hexWidth) + 6;
  const rows = Math.ceil(height / rowHeight) + 6;

  const svgNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgNS, 'svg');

  svg.classList.add('hex-grid');

  svg.setAttribute('width', `${width}px`);
  svg.setAttribute('height', `${height}px`);

  /*
   * --------------------------------------------------
   * GRADIENT
   * --------------------------------------------------
   */

  const defs = document.createElementNS(svgNS, 'defs');

  const gradient = document.createElementNS(
    svgNS,
    'radialGradient'
  );

  gradient.setAttribute('id', 'hexGradient');
  gradient.setAttribute('gradientUnits', 'userSpaceOnUse');

  // Center of the page
  gradient.setAttribute('cx', width / 2);
  gradient.setAttribute('cy', height / 2);

  // Radius reaches the edges
  gradient.setAttribute(
    'r',
    Math.sqrt(
      Math.pow(width / 2, 2) +
      Math.pow(height / 2, 2)
    )
  );

  const stops = [
    ['0%',   '#8A8F94'], // grey centre
    ['25%',  '#69747F'], // grey/blue
    ['50%',  '#3E6F9F'], // blue
    ['75%',  '#214A78'], // dark blue
    ['100%', '#0A1A2B']  // deep blue edges
  ];

  stops.forEach(([offset, color]) => {
    const stop = document.createElementNS(svgNS, 'stop');

    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);

    gradient.appendChild(stop);
  });

  defs.appendChild(gradient);
  svg.appendChild(defs);

  /*
   * --------------------------------------------------
   * HEXAGONS
   * --------------------------------------------------
   */

  function getHexPoints(cx, cy) {
    const points = [];

    for (let i = 0; i < 6; i++) {

      const angle =
        (Math.PI / 180) *
        (60 * i + 30);

      points.push({
        x:
          cx +
          radius *
            Math.cos(angle),

        y:
          cy +
          radius *
            Math.sin(angle)
      });
    }

    return points;
  }

  const lineGroup =
    document.createElementNS(
      svgNS,
      'g'
    );

  lineGroup.classList.add(
    'hex-grid__lines'
  );

  const dotGroup =
    document.createElementNS(
      svgNS,
      'g'
    );

  dotGroup.classList.add(
    'hex-grid__dots'
  );

  const uniquePoints =
    new Set();

  for (
    let row = -4;
    row < rows;
    row++
  ) {

    for (
      let col = -4;
      col < columns;
      col++
    ) {

      const cx =
        col * hexWidth +
        (row % 2) *
          (hexWidth / 2);

      const cy =
        row * rowHeight;

      const points =
        getHexPoints(cx, cy);

      /*
       * Hexagon
       */

      const polygon =
        document.createElementNS(
          svgNS,
          'polygon'
        );

      polygon.setAttribute(
        'points',
        points
          .map(
            p =>
              `${p.x},${p.y}`
          )
          .join(' ')
      );

      lineGroup.appendChild(
        polygon
      );

      /*
       * Vertices
       */

      points.forEach(point => {

        const key =
          `${point.x.toFixed(3)},${point.y.toFixed(3)}`;

        uniquePoints.add(key);

      });
    }
  }

  svg.appendChild(
    lineGroup
  );

  /*
   * --------------------------------------------------
   * DOTS
   * --------------------------------------------------
   */

  uniquePoints.forEach(point => {

    const [x, y] =
      point.split(',');

    const circle =
      document.createElementNS(
        svgNS,
        'circle'
      );

    circle.setAttribute(
      'cx',
      x
    );

    circle.setAttribute(
      'cy',
      y
    );

    circle.setAttribute(
      'r',
      '1.35'
    );

    dotGroup.appendChild(
      circle
    );
  });

  svg.appendChild(
    dotGroup
  );

  hexBg.appendChild(
    svg
  );
}

createHexGrid();

let resizeTimer;

window.addEventListener(
  'resize',
  () => {

    clearTimeout(
      resizeTimer
    );

    resizeTimer = setTimeout(
      () => {
        createHexGrid();
      },
      150
    );
  }
);