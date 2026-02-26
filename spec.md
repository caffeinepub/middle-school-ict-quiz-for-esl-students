# Specification

## Summary
**Goal:** Build a fully frontend-based 2D auto-chess game called "Pharaoh's Conquest" with an ancient Egyptian war theme.

**Planned changes:**
- Create a main menu screen with the title "Pharaoh's Conquest", a Start Game button, and a How to Play modal explaining preparation/combat phases and synergies
- Implement the full auto-chess game loop: preparation phase (buy/place units), combat phase (units auto-battle), round progression, shop system, gold economy with interest mechanic, player HP that decreases on loss, and game-over condition
- Build a roster of 8 Egyptian-themed unit types: Pharaoh, Anubis Guard, Ra Priest, Isis Sorceress, Charioteer, Sphinx, Horus Archer, and Mummy Warrior — each with name, portrait, tier (1–3 star), HP, attack, ability description, and faction/synergy tag
- Implement a synergy/trait system with 4 synergies: Children of Ra, Pharaoh's Guard, Desert Nomads, and Undead Legion — activating passive buffs at unit count thresholds
- Render a 2D top-down 8×4 grid battle board with unit movement animations, floating damage numbers, real-time HP bars, death animations, and Egyptian-themed visual effects (golden glow, sand particles, hieroglyph flashes)
- Design the entire UI with an Egyptian aesthetic: gold/sand/turquoise/ochre palette, hieroglyph-style borders, papyrus-textured card backgrounds, and Egyptian iconography throughout
- Display a round tracker HUD showing round number, player HP, current gold, and active synergies panel during gameplay
- Integrate generated images: desert panorama as menu background, battle scene as board background, unit portraits on cards/shop, and decorative border frames on panels

**User-visible outcome:** Players can launch Pharaoh's Conquest, read the rules, then play a full auto-chess game loop — buying and placing Egyptian units, watching them auto-battle enemies, leveraging synergies, and surviving as many rounds as possible before reaching 0 HP — all within an immersive ancient Egyptian visual theme.
