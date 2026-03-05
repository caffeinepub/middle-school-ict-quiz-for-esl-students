// Hexagonal grid math utilities
// Using "flat-top" hexagons with offset rows for a 7×4 grid

export const HEX_SIZE = 36; // radius from center to corner
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
export const HEX_HORIZ_SPACING = HEX_WIDTH * 0.75; // 3/4 of width for flat-top
export const HEX_VERT_SPACING = HEX_HEIGHT;

export const COLS = 7;
export const PLAYER_ROWS = 4;

/**
 * Convert grid col/row to pixel center (flat-top hexagons)
 * Odd columns are offset downward by half a hex height
 */
export function hexToPixel(col: number, row: number): { x: number; y: number } {
  const x = col * HEX_HORIZ_SPACING + HEX_SIZE;
  const y = row * HEX_VERT_SPACING + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0) + HEX_HEIGHT / 2;
  return { x, y };
}

/**
 * Get the total pixel dimensions needed for the grid
 */
export function getGridDimensions(cols: number, rows: number): { width: number; height: number } {
  const width = (cols - 1) * HEX_HORIZ_SPACING + HEX_WIDTH;
  const height = rows * HEX_VERT_SPACING + HEX_HEIGHT / 2 + 4;
  return { width, height };
}

/**
 * Generate SVG polygon points for a flat-top hexagon centered at (cx, cy)
 */
export function hexPolygonPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i; // flat-top: 0°, 60°, 120°, ...
    const angleRad = (Math.PI / 180) * angleDeg;
    const x = cx + size * Math.cos(angleRad);
    const y = cy + size * Math.sin(angleRad);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

/**
 * Convert a linear position index to col/row for the player board (0-27)
 */
export function posToColRow(pos: number): { col: number; row: number } {
  return { col: pos % COLS, row: Math.floor(pos / COLS) };
}

/**
 * Convert col/row to linear position
 */
export function colRowToPos(col: number, row: number, isEnemy: boolean): number {
  const base = isEnemy ? COLS * PLAYER_ROWS : 0;
  return base + row * COLS + col;
}
