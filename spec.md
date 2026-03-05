# Specification

## Summary
**Goal:** Overhaul the Pharaoh's Conquest battle board to use a hexagonal grid layout and apply an Iron Command-inspired dark tactical visual theme across all game UI components.

**Planned changes:**
- Replace square grid cells in BattleBoard.tsx and GridTile.tsx with regular hexagons (pointy-top or flat-top) using CSS clip-path or SVG polygon, with correct hex grid spacing and tessellation for 7×4 player and 7×4 enemy sections
- Adapt unit sprites, HP bars, star indicators, portraits, and drag-and-drop logic to work on the hexagonal grid
- Add coordinate labels (column letters, row numbers) along the battle board edges and a dark vignette border around the board
- Redesign the overall visual aesthetic to a dark tactical war-room style: deep desert night palette (dark sand, aged bronze, deep lapis, ember gold) with high-contrast unit highlights
- Redesign the HUD into a tactical command interface with segmented sharp-bordered stat panels (HP, Gold, Round, Wins, Losses)
- Restyle Shop cards to a compact military-briefing card style with dark backgrounds and gold/bronze accents
- Apply dark backgrounds with gold/bronze accent borders to SynergyPanel, Shop, Bench, and all game panels
- Shift stat number typography to monospaced or condensed sans-serif; retain Cinzel/Cinzel Decorative for headings
- Add new CSS custom property tokens (deep-sand-dark, aged-bronze, ember-gold, deep-lapis-dark, command-panel) to index.css and extend tailwind.config.js with these tokens
- Apply the new dark battle board background image to BattleBoard and the new command panel frame image to EgyptianPanel and all major game panels

**User-visible outcome:** The game now displays a hexagonal battle grid with a gritty, high-contrast Iron Command-style dark tactical aesthetic, including coordinate labels, redesigned HUD panels, military-style unit tokens, and a consistent dark desert night color palette throughout all UI components.
