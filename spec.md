# Specification

## Summary
**Goal:** Polish and fix the Pharaoh's Conquest Egyptian auto-chess game so it renders correctly end-to-end, replacing all legacy/stub components with the proper game UI.

**Planned changes:**
- Fix `App.tsx` to render the full game flow (MainMenu → GameHUD + BattleBoard + Shop + SynergyPanel + Bench), removing all quiz, ecosystem, Header, and Footer references
- Update `frontend/index.html` page title to "Pharaoh's Conquest"
- Implement/complete the `MainMenu` screen with Egyptian-styled title, Start Game button, How to Play button (opening HowToPlayModal), and desert background image
- Remove or replace empty stub components (`ControlPanel.tsx`, `GameScene.tsx`, `StatsPanel.tsx`, `Terrain.tsx`, `PlantMesh.tsx`, `AnimalMesh.tsx`) that belong to prior unrelated apps
- Fix unit portrait image paths in `units.ts` so all 8 unit cards correctly reference assets under `/assets/generated`

**User-visible outcome:** The app opens to a proper Egyptian-themed main menu titled "Pharaoh's Conquest," and gameplay shows the full auto-chess UI with all unit portraits displayed correctly — no quiz or ecosystem content appears anywhere.
