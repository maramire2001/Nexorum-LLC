# Design System Strategy: The Architectural Authority

## 1. Overview & Creative North Star
This design system is built to reflect the uncompromising standards of high-end strategic consulting. It is designed to signal "The Architectural Authority"—a visual language that prioritizes absolute order, intellectual clarity, and a legacy-driven presence. 

While generic corporate design relies on loud imagery and rounded friendlier shapes, this system breaks from the "template" look by using **Rigid Brutalism** mixed with **Editorial Elegance**. We utilize 0px border radii across all components to establish a sharp, non-negotiable professional edge. The layout logic is inspired by traditional letterheads and white-paper manuscripts, utilizing intentional asymmetry and expansive whitespace to allow complex ideas to breathe.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in deep, authoritative blues, using subtle shifts in luminance to create structure rather than relying on decorative lines.

### Color Strategy
- **Primary & Primary-Container (`#000413` / `#121e34`):** These are the foundations. Use the deep navy for high-impact backgrounds and the primary container for sections that require a sense of enclosure.
- **Secondary (`#365da5`):** The functional engine. Used for interactive elements and primary call-to-actions.
- **Tertiary & Accents (`#090500` / Gold):** Use the Gold (`tertiary-fixed`) with extreme restraint—only for "Nexo" highlights, specific data insights, or a singular seal of quality.

### The "No-Line" Rule
Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting against a `surface` background provides all the definition needed. This "borderless" approach creates a modern, high-end editorial feel.

### Signature Textures
To avoid a "flat" digital look, main CTAs or hero sections should utilize a subtle linear gradient transitioning from `primary` to `primary-container` (at a 45-degree angle). This provides a visual "soul" and mimicry of high-quality ink on premium paper.

---

## 3. Typography: The Editorial Scale
The typography is the voice of the brand. We pair the geometric authority of **Plus Jakarta Sans** for headlines with the functional precision of **Work Sans** for body text.

- **Display (Plus Jakarta Sans):** Massive, bold, and unapologetic. Used for key high-level statements.
- **Headline & Title (Plus Jakarta Sans):** Conveying hierarchy through weight. Headlines should be "Bold" to match the All Round Gothic aesthetic of the brand logo.
- **Body (Work Sans):** Optimized for readability in long-form reports and strategic insights. Use `body-lg` (1rem) as the standard to ensure an airy, premium feel.
- **Label (Work Sans):** Used for metadata and small technical details, always in uppercase with a slight letter-spacing increase (+5%) to maintain an architectural look.

---

## 4. Elevation & Depth: Tonal Layering
In a system with **0px roundedness**, traditional shadows can look dated. We achieve depth through the **Layering Principle**.

### Layering Principle
Stacking surface-container tiers creates natural lift. 
- **Level 0 (Surface):** The base canvas.
- **Level 1 (Surface-Container-Low):** Large content blocks or sidebars.
- **Level 2 (Surface-Container-Lowest):** Interactive cards or "floating" data modules.

### Ambient Shadows & Glassmorphism
When a floating effect is mandatory (e.g., a navigation bar or a modal), use a **Ghost Shadow**:
- **Blur:** 40px - 60px.
- **Opacity:** 4%-6% of `on-surface`.
- **Color:** Tint the shadow with a hint of Navy to keep it integrated with the brand.

### Glassmorphism
For floating headers, use a semi-transparent `surface-container` with a `backdrop-filter: blur(20px)`. This allows the sophisticated deep blues of the content below to bleed through, softening the layout's rigidity.

---

## 5. Components: Sharp, Functional, Ordered

### Buttons
- **Primary:** `primary` background with `on-primary` text. No border. 0px radius.
- **Secondary:** `outline-variant` (at 20% opacity) "Ghost Border" with `secondary` text. 
- **States:** On hover, the primary button should shift to `secondary` color. Transitions must be instant (150ms) to feel responsive and sharp.

### Structured Cards (Divisions)
Forbid the use of divider lines. Separate content using the Spacing Scale (64px+ between sections) or subtle shifts between `surface-container-low` and `surface-container-highest`. Each division card should feel like a "sheet" of paper laid onto a dark desk.

### Letterhead Headers
Headers should mimic executive stationery. This means a wide-margin layout with the logo left-aligned and navigation right-aligned, separated by a vast amount of "White" (`surface-container-lowest`) space.

### Input Fields
Strictly 0px corners. Use `surface-container-high` for the fill. The active state is signaled by a 2px `secondary` bottom-border only, maintaining the "Letterhead" aesthetic.

---

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical layouts where text blocks are offset to one side, leaving the other side purely for whitespace.
- **Do** use the Gold accent exclusively for high-value highlights (e.g., a "Premium" badge or a specific data point).
- **Do** ensure all corners are 0px. This is the cornerstone of the brand's "Absolute Order."

### Don't:
- **Don't** use generic stock photography. Use abstract architectural patterns, macro-texture shots (concrete, glass, steel), or data visualizations.
- **Don't** use standard 1px borders. If you feel you need a line, use a 24px vertical space instead.
- **Don't** use "Soft" or "Playful" animations. Motion should be linear and purposeful—like a sliding drawer or a camera shutter.