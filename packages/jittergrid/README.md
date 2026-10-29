# @cjean-fr/jittergrid

Seeded triangulation of a jittered grid. The same options always give the
same pattern.

```ts
import { generateTiles, generateTriangulation } from "@cjean-fr/jittergrid";

const options = { width: 900, height: 300, cellSize: 60, variance: 0.8, seed: 188 };

generateTriangulation(options); // "data:image/svg+xml,..." for a CSS background
generateTiles(options); // { points, shades }, to redraw the pattern yourself
```

`generateTriangulation` groups the triangles by fill into one path each, in
relative coordinates. `generateTiles` returns the grid points and one shade per
triangle, in the order described in its doc comment.

Thanks to [Trianglify](https://trianglify.io/) for the inspiration.
