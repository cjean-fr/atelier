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

type Triangle = [Point, Point, Point];

export interface TrianglifyOptions {
  width?: number;
  height?: number;
  cellSize?: number;
  variance?: number;
  seed?: number;
}

/**
 * Generates a jittered grid triangulation as an SVG Data URI
 * @param options
 * @returns
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
  const points = generatePoints(width, height, cellSize, variance, prng);
  const groups = generateTriangleGroups(points, prng);
  const svg = buildSvgData(width, height, groups);

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate points for the triangulation.
 * @param width
 * @param height
 * @param cellSize
 * @param variance
 * @param prng
 * @returns
 */
function generatePoints(
  width: number,
  height: number,
  cellSize: number,
  variance: number,
  prng: PRNG,
): Point[][] {
  const points: Point[][] = [];
  const columns = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;

  for (let j = 0; j < rows; j++) {
    const row: Point[] = [];
    for (let i = 0; i < columns; i++) {
      const x = Math.round(
        (i - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance,
      );
      const y = Math.round(
        (j - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance,
      );
      row.push({ x, y });
    }
    points.push(row);
  }

  return points;
}

/**
 * Get a random fill color.
 * @param prng
 * @returns
 */
function getRandomFillColor(prng: PRNG): string {
  const rand = prng.next();
  const hexColor = rand > 0.5 ? "#000000" : "#ffffff";
  const alpha = (Math.round(rand * 5) * 5).toString(16).padStart(2, "0");
  return hexColor + alpha;
}

/**
 * Format a triangle path in relative coordinates.
 * @param triangle
 * @param lastPoint
 * @returns
 */
function formatRelativeTrianglePath(
  triangle: Triangle,
  lastPoint: Point,
): string {
  const [p0, p1, p2] = triangle;
  const dx0 = p0.x - lastPoint.x;
  const dy0 = p0.y - lastPoint.y;
  const dx1 = p1.x - p0.x;
  const dy1 = p1.y - p0.y;
  const dx2 = p2.x - p1.x;
  const dy2 = p2.y - p1.y;

  return `m${dx0} ${dy0} ${dx1} ${dy1} ${dx2} ${dy2}`.replace(/ -/g, "-");
}

/**
 * Generate triangle groups.
 * @param points
 * @param prng
 * @returns
 */
function generateTriangleGroups(
  points: Point[][],
  prng: PRNG,
): Record<string, string> {
  const svgPathsByColor: Record<string, string> = {};
  const lastPointByColor: Record<string, Point> = {};
  const rows = points.length;
  const columns = points[0]?.length ?? 0;

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < columns - 1; i++) {
      const triangles: Triangle[] = [
        [points[j]![i]!, points[j]![i + 1]!, points[j + 1]![i]!],
        [points[j]![i + 1]!, points[j + 1]![i + 1]!, points[j + 1]![i]!],
      ];

      triangles.forEach((triangle) => {
        const fill = getRandomFillColor(prng);

        if (!svgPathsByColor[fill]) {
          svgPathsByColor[fill] = "";
          lastPointByColor[fill] = { x: 0, y: 0 };
        }

        const lastPoint = lastPointByColor[fill]!;
        const relativePath = formatRelativeTrianglePath(triangle, lastPoint);

        svgPathsByColor[fill] += relativePath;
        lastPointByColor[fill] = triangle[2]!;
      });
    }
  }

  return svgPathsByColor;
}

/**
 * Build the SVG data.
 * @param width
 * @param height
 * @param groups
 * @returns
 */
function buildSvgData(
  width: number,
  height: number,
  groups: Record<string, string>,
): string {
  let paths = "";
  for (const [fill, data] of Object.entries(groups)) {
    paths += `<path fill="${fill}" d="${data}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}
