/**
 * Simple seedable PRNG to ensure predictable results
 */
class PRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    // https://en.wikipedia.org/wiki/Lehmer_random_number_generator
    this.seed = (this.seed * 16807) % 2147483647; // Mersenne premier ($2^{31} - 1$)
    return (this.seed - 1) / 2147483646;
  }
}

interface Point {
  x: number;
  y: number;
}

export interface TrianglifyOptions {
  width?: number;
  height?: number;
  cellSize?: number;
  variance?: number;
  seed?: number;
}

/**
 * Generates a jittered grid triangulation as an SVG Data URI
 */
export function generateTriangulation(options: TrianglifyOptions = {}): string {
  const {
    width = 900,
    height = 300,
    cellSize = 50,
    variance = 0.75,
    seed = 1,
  } = options;

  const prng = new PRNG(seed);
  const points: Point[][] = [];

  const columns = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;

  // 1. Generate jittered points
  for (let j = 0; j < rows; j++) {
    const row: Point[] = [];
    for (let i = 0; i < columns; i++) {
      const x =
        (i - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance;
      const y =
        (j - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance;
      row.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
    points.push(row);
  }

  // 2. Build paths
  let paths = "";
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < columns - 1; i++) {
      const p1 = points[j]![i]!;
      const p2 = points[j]![i + 1]!;
      const p3 = points[j + 1]![i]!;
      const p4 = points[j + 1]![i + 1]!;

      // Two triangles per grid cell
      paths += drawTriangle(p1, p2, p3, prng.next());
      paths += drawTriangle(p2, p4, p3, prng.next());
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
    <g fill-rule="evenodd">${paths}</g>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function drawTriangle(p1: Point, p2: Point, p3: Point, rand: number): string {
  // Use random opacity of black/white to create the texture effect
  // This interacts with the CSS gradient background
  const isDark = rand > 0.5;
  const opacity = (Math.round(rand * 100) / 1000).toFixed(3); // 0.00 to 0.10
  const color = isDark ? "0,0,0" : "255,255,255";

  return `<path d="M${p1.x},${p1.y}L${p2.x},${p2.y}L${p3.x},${p3.y}Z" fill="rgba(${color},${opacity})"/>`;
}
