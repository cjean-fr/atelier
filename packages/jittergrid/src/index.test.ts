import { generateTiles, generateTriangulation } from "./index";
import { describe, expect, it } from "bun:test";

const options = {
  width: 120,
  height: 60,
  cellSize: 30,
  variance: 0.5,
  seed: 7,
};

const uri =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60' viewBox='0 0 120 60' preserveAspectRatio='xMidYMid slice'%3E%3Cpath fill='%2300000019' d='m-22-9 34-10-22 30m82-22 6 26-30-7m30 7 33 5-38 23m-22 8 22-8-25 38'/%3E%3Cpath fill='%23ffffff00' d='m12-19 1 37-23-7'/%3E%3Cpath fill='%23ffffff0a' d='m12-19 36 4-35 33m35-33 0 23-35 10m96-32 29 1-27 33m-121-9 23 7-22 30m22-30 4 28-26 2m22-30 35-10-31 38m94-26-1 22-37 1m0 0-5 29-20 9m82-39 4 28-28 5'/%3E%3Cpath fill='%230000000f' d='m48-15 24 4-24 19m24-19 37-3-31 29m-30-7 3 43-34-5m31-38 30 7-27 36m78-36 1 27-20 0m-119 6 26-2-33 26m33-26 5 30-38-4m33-26 34 5-29 25m29-25-3 30-26-5m88-34 20 0-24 33'/%3E%3Cpath fill='%23ffffff05' d='m109-14 2 34-33-5m60-28-9 28-18 5m-33-5-5 28-22 8m59-9-4 33-38-3'/%3E%3Cpath fill='%2300000014' d='m111 20 18-5-19 27m-37 1 37-1-42 30'/%3E%3C/svg%3E";

const tiles = {
  c: 6,
  r: 4,
  p: [
    -22, -9, 12, -19, 48, -15, 72, -11, 109, -14, 138, -13, -10, 11, 13, 18, 48,
    8, 78, 15, 111, 20, 129, 15, -9, 48, 17, 46, 51, 51, 73, 43, 110, 42, 130,
    42, -16, 72, 22, 76, 48, 81, 68, 72, 106, 75, 134, 70,
  ],
  s: [
    -25, 0, 10, 10, -15, -25, -15, 5, 10, 5, 10, 10, 10, -15, -15, 5, -25, 10,
    -20, -15, -15, -15, -15, -15, -25, 10, -20, 5, -15, 10,
  ],
};

describe("generateTriangulation", () => {
  it("returns the same SVG data URI for the same options", () => {
    expect(generateTriangulation(options)).toBe(uri);
    expect(generateTriangulation(options)).toBe(
      generateTriangulation({ ...options }),
    );
  });

  it("changes with the seed", () => {
    expect(generateTriangulation({ ...options, seed: 8 })).not.toBe(uri);
  });

  it("treats seed 0 as a valid seed instead of getting stuck", () => {
    expect(generateTriangulation({ ...options, seed: 0 })).toBe(
      generateTriangulation({ ...options, seed: 1 }),
    );
  });

  it("survives non-finite seeds", () => {
    expect(
      generateTriangulation({ ...options, seed: Number.NaN }),
    ).not.toContain("NaN");
    expect(
      generateTriangulation({ ...options, seed: Number.POSITIVE_INFINITY }),
    ).not.toContain("NaN");
  });
});

describe("generateTiles", () => {
  it("returns the grid points and one shade per triangle", () => {
    const { points, shades } = generateTiles(options);
    expect({
      c: points[0]?.length,
      r: points.length,
      p: points.flat().flatMap(({ x, y }) => [x, y]),
      s: shades,
    }).toEqual(tiles);
    expect(shades).toHaveLength(
      2 * (points.length - 1) * ((points[0]?.length ?? 1) - 1),
    );
  });

  it("draws the same triangles as the SVG: a shade per triangle gives a path per visible fill", () => {
    const svg = decodeURIComponent(generateTriangulation(options));
    const { shades } = generateTiles(options);
    const fills = new Set(
      shades.map(
        (shade) =>
          `${shade < 0 ? "#000000" : "#ffffff"}${Math.abs(shade).toString(16).padStart(2, "0")}`,
      ),
    );
    const drawn = [...svg.matchAll(/fill=.#([0-9a-f]{8})/g)].map(
      (match) => `#${match[1]}`,
    );
    expect(new Set(drawn)).toEqual(fills);
  });
});
