```markdown
# Design System Document: The Obsidian Grimoire

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Illuminated Descent."** 

We are moving away from the "sterile utility" of modern mobile games and toward an experience that feels like a hand-inked relic discovered in a subterranean vault. This system rejects the rigid, mathematical precision of standard grids in favor of **Organic Brutalism**. We achieve this through intentional asymmetry—UI elements should feel like they were carved into the stone or scrawled by a flickering torch. Overlapping layers, rough ink-like linework, and a "light-from-within" glow strategy define this high-end editorial approach to dark fantasy.

---

## 2. Colors: Tonal Submersion
The palette is designed to simulate atmospheric perspective within a dungeon. We do not use "gray"; we use "stone." We do not use "blue"; we use "bioluminescence."

*   **Primary (#00DFC1):** The Teal Glow. Reserved strictly for active magic, bioluminescent fungal elements, and "Proceed" actions. It represents the only life in the dark.
*   **Secondary (#FFD799):** The Amber Ambient. Used for human-made light (torches, gold, loot). It provides a warm, high-contrast counterpoint to the cold teal.
*   **Tertiary Container (#2D1B4E):** The Deep Purple. This is our "shadow" color. Use this to provide atmospheric depth in headers or to ground floating elements.
*   **Surface Hierarchy & Nesting:**
    *   Avoid the "flat screen" look. Treat the screen as a cavern.
    *   **Surface (#131411):** The base stone floor.
    *   **Surface-Container-Low:** Recessed areas, like grooves in stone.
    *   **Surface-Container-Highest:** Elevated altars or active interactive panels.
*   **The "No-Line" Rule:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts (e.g., a `surface-container-high` card sitting on a `surface` background). 
*   **Signature Textures:** Apply subtle gradients transitioning from `primary` to `primary-container` (Teal to Dark Teal) on main CTAs to mimic a pulsating fungal glow.

---

## 3. Typography: The Chronicler's Hand
We use **Newsreader** exclusively. Its high-contrast serifs and slightly irregular, calligraphic nature evoke aged manuscripts and forgotten histories.

*   **Display (LG/MD/SM):** Set with tight letter-spacing and negative leading to create a dense, "heavy" feeling for chapter titles and boss names.
*   **Headline & Title:** Used for navigation and item headers. These should always be in `on-surface` or `secondary` (Amber) to denote importance.
*   **Body (LG/MD/SM):** The "ink" of our grimoire. Use `on-surface-variant` for long-form lore to reduce eye strain against the dark background.
*   **Labels:** For technical stats, use `label-md` with increased tracking (letter-spacing) to differentiate game-mechanic data from narrative text.

---

## 4. Elevation & Depth: Atmospheric Layering
Forget drop shadows. In the depths of Grimhold, depth is created by light and haze, not artificial offsets.

*   **The Layering Principle:** Stack tiers to create "lift." A `surface-container-lowest` element should feel like a hole in the ground, while a `surface-container-highest` element feels like a raised stone plinth.
*   **Ambient Shadows:** If an element must "float" (like a modal), use a massive, extra-diffused blur (40px+) with the shadow color set to `surface-container-lowest` at 40% opacity. This mimics the way light wraps around objects in a smoke-filled room.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` at 15% opacity. It should look like a faint scratch in the stone, not a digital line.
*   **Glassmorphism:** For overlays, use `surface-variant` with a 20px backdrop blur. This allows the "bioluminescent" background colors to bleed through the UI, making the interface feel like a magical projection.

---

## 5. Components: Arcane Modules

### Buttons
*   **Primary:** Fill with `primary-container` and a `primary` (Teal) inner glow. The edges should feature "rough ink" linework (0.5px) to prevent it from looking like a standard material button.
*   **Secondary:** No fill. Use an `amber` (Secondary) ghost border at 30% opacity. 
*   **Tertiary:** Text only using `primary-fixed-dim`. 

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Implementation:** Separate list items using 8px of vertical space (from the Spacing Scale) and a subtle shift from `surface-container-low` to `surface-container-high`.
*   **Linework:** Integrate "hand-drawn" corner accents using the `outline` token to reinforce the "Grimhold" aesthetic.

### Input Fields
*   **Styling:** Inputs should not be boxes. They are "underlines" with rough, tapering ink ends. 
*   **Focus State:** The underline transitions from `outline` to a pulsating `primary` (Teal) glow.

### Chips (Alchemical Tags)
*   Used for item categories (e.g., "Cursed," "Relic"). Use `tertiary-container` backgrounds with `tertiary` text. The roundedness should be `sm` (0.125rem) to maintain a jagged, crystalline feel.

### Specialized Component: The Sanity Meter (Progress Bar)
*   A custom component using a gradient from `surface-variant` to `primary`. The "fill" should have a jittery, hand-animated ink texture on the leading edge.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** If a menu has four icons, consider making one slightly larger or offset to break the "app" feel.
*   **Use Tonal Transitions:** Use the `surface-dim` to `surface-bright` range to guide the player's eye toward the most important interaction.
*   **Think in Layers:** Treat every screen like a multi-plane camera setup in an old film.

### Don't:
*   **Never use pure white (#FFFFFF):** It shatters the dark fantasy immersion. Use `on-surface` (#E5E2DD) for high-contrast text.
*   **Avoid Perfect Circles:** Use `rounded-sm` or `rounded-md` for most containers. Perfect circles feel too "modern/tech."
*   **No 100% Opacity Borders:** They create a "boxed-in" feeling that fights the atmospheric haze of the game world.
*   **No Standard Grids:** While the underlying logic is a grid, the visual output should look like an organic arrangement of artifacts.```