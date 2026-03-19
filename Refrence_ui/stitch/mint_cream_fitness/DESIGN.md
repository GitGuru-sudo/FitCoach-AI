```markdown
# Design System Document: Editorial Athleticism

## 1. Overview & Creative North Star

**Creative North Star: "The Performance Editorial"**

This design system moves away from the sterile, modular appearance of traditional fitness trackers and towards a high-end, editorial aesthetic. It treats the user's health journey like a premium publication—bold, authoritative, yet approachable. We balance the aggressive energy of performance athletics (high-contrast dark headers and vibrant accents) with the sophisticated calm of a wellness retreat (soft cream/beige content areas and generous whitespace).

The system breaks the "standard app" feel by using **intentional asymmetry** in its card layouts, **overlapping elements** (such as buttons that break the container's edge), and a typography scale that favors dramatic headlines over small, cramped labels.

---

## 2. Colors

The palette is designed to create a clear mental shift between "The Mindset" (the dark, focused header) and "The Action" (the soft, accessible content area).

### Primary Accents
*   **Mint Green (`primary` #006d3e):** Used for growth-oriented actions and success states.
*   **Coral (`secondary` #a83639):** Reserved for high-energy interactions or critical secondary information.
*   **Gold (`tertiary` #735c00):** Symbolizing achievement, used for premium insights and leaderboard highlights.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through:
1.  **Background Shifts:** Using `surface-container-low` (#f5f5dc) elements against a `surface` (#fbfbe2) background.
2.  **Tonal Transitions:** Using the hierarchy of surface tokens to create "perceived" boundaries.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base Layer:** `surface` (#fbfbe2)
*   **Secondary Content:** `surface-container-low` (#f5f5dc)
*   **Elevated Cards:** `surface-container-lowest` (#ffffff)
*   **Nesting:** An inner element (like a text input) should always sit on a surface one tier higher or lower than its parent to maintain clarity without borders.

### The "Glass & Gradient" Rule
To add soul to the UI, main CTAs (like "Save Workout") should utilize a subtle linear gradient transitioning from `primary` (#006d3e) to `primary_container` (#86efac). For floating profile cards or AI overlays in the header, use **Glassmorphism**: a semi-transparent `inverse_surface` with a 20px backdrop-blur to maintain legibility while feeling integrated into the environment.

---

## 3. Typography

The typography uses the **Manrope** family to bridge the gap between technical precision and human warmth.

*   **Display (lg/md):** Used for big motivational moments. Bold weights, tight letter-spacing.
*   **Headline (lg/md):** The "Editorial" voice. Used for section titles (e.g., "Log Workout").
*   **Body (lg/md):** Optimized for readability. Use `on_surface_variant` (#3e4a40) to reduce eye strain against the cream background.
*   **Label (md/sm):** Always uppercase with slightly increased letter-spacing (0.05rem) to evoke a premium, "metadata" feel.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is created by "stacking." A `surface-container-highest` card placed on a `surface` background provides all the "lift" required for the eye to perceive a new layer.
*   **Ambient Shadows:** Where a floating effect is non-negotiable (e.g., a modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(27, 29, 14, 0.06);`. The shadow color must be a tint of `on_surface`, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., an empty state), use the `outline_variant` (#bdcabe) at **15% opacity**.
*   **Soft Radii:** Components use the `xl` (3rem) or `lg` (2rem) roundedness tokens. This "generous rounding" mimics organic shapes, making the high-contrast data feel less intimidating.

---

## 5. Components

### Buttons
*   **Primary:** Gradient-filled (Mint to Light Mint), `full` roundedness, bold `on_primary` text.
*   **Secondary:** Ghost-style with a `tertiary` (#735c00) text color and a semi-transparent `tertiary_container` background.
*   **Action Chips:** Small, `md` (1.5rem) rounded pills used for quick filters or "AI Motivation" triggers.

### Cards & Lists
*   **Standard Card:** Use `surface-container-lowest` (#ffffff) with `lg` (2rem) corners. 
*   **The "No Divider" Rule:** Never use a horizontal line to separate list items. Use the **Spacing Scale** (token `6` - 2rem) to create clear breathing room between items, or use alternating `surface-container` background tints.

### Input Fields
*   Text inputs should be `surface_container_lowest` (#ffffff) with a `DEFAULT` (1rem) corner radius. Use `label-md` for floating labels, always in the `outline` (#6e7a70) color.

### Progress Bars (Custom)
*   In the "Weekly Tournament" section, use a thick, `full` rounded track in `inverse_surface` (#303221) with a `primary` (#006d3e) indicator to maintain the dark, high-contrast header aesthetic.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. If a card has 2rem padding on the top/left, try 2.5rem on the bottom/right to create a sense of movement.
*   **Do** use "surface-on-surface" nesting to define input areas.
*   **Do** embrace the Gold accent (`tertiary`) for small, "jewel-like" highlights (e.g., a trophy icon or a premium badge).

### Don't:
*   **Don't** use pure black (#000000) or pure white (#ffffff) for large surfaces. Use the `surface` and `inverse_surface` tokens to maintain the soft editorial tone.
*   **Don't** use 1px solid borders. If a container feels "lost," increase the background color contrast between it and the base layer.
*   **Don't** cram content. If a card feels full, use the next size up in the **Spacing Scale** rather than shrinking the typography.

---

## 7. Spacing & Rhythm

*   **Vertical Rhythm:** Use the `8` (2.75rem) or `10` (3.5rem) tokens between major dashboard cards to create a "scrolling gallery" feel.
*   **Internal Padding:** Cards should never have less than the `4` (1.4rem) spacing token for internal padding. This ensures the content feels "cradled" within the generous rounded corners.```