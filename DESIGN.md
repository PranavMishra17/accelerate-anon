# Design standard

Every page in this repo follows this file. Read it before any change to how a page looks.
The values live in `site/tokens.css`; a page uses those variables and adds none of its own.

It exists because the site drifted into what gets called AI slop: 24 font sizes on one page,
a handwriting face beside two others, 18px body text on a 1920x1080 screen at 125% scaling,
em dashes in the hundreds, boxes inside boxes, labels in letter-spaced capitals, and long
pages with no way around them. The fix is fewer decisions, made on purpose.

## The rules

1. **Two families.** Atkinson Hyperlegible for text, JetBrains Mono for code. No handwriting,
   no display face, no `font-stretch` tricks.
2. **Six sizes, from the tokens.** 12, 13, 15, 17, 20, 24 px, plus 13 px code. Body is 15.
   Nothing is larger than 24, and 24 appears once, as the page title. A component uses at
   most three sizes. No ad hoc pixel values, no `clamp()` on text.
3. **Hierarchy by weight and colour before size.** 600 for headings and the key term; ink,
   soft and muted greys for the rest. One accent colour, for actions and the current state
   only. Never a gradient.
4. **Density that reads as professional.** Lines at most 72 characters. Spacing on the 4 px
   scale. Tables for data with columns; definition rows at body size, not heading size.
5. **Separation without boxes.** At most two levels of nesting. Separate parts with a small
   label, a hairline and a sunken tint, not with a border around a border. Radius 6 px (8 for
   panels); no shadows except on layers that float (popups, sticky bars).
6. **No decoration that says nothing.** No emoji. No icon in a coloured square. Icons only
   where they identify (a database is a database). No decorative numbering on content that
   is not a sequence. No identical card grids for everything: use a list or a table for data,
   a card only for a thing you open.
7. **No eyebrow labels.** No tiny uppercase letter-spaced text above headings. Section labels
   are sentence case, small and muted.
8. **Navigation on every long page.** A persistent index (a sticky rail or tabs) and sections
   that show one at a time or fold. No page runs longer than about three screens without a
   way to jump.
9. **Colour with a job.** Categorical colours (`--cat-1` to `--cat-6`) mark one thing per
   colour, such as one interview loop, as a 3 px rule or a dot, never as a fill.
10. **Motion only on interaction**, 150 ms or less, and none with reduced motion.
11. **States are designed.** Empty, loading and error states say what happened and what to do.

## Words

- Plain, specific, short. Say what the thing is and does; name the concrete number.
- No em dashes in anything written for the page. Use a full stop, a comma, a colon or a
  bracket. Pranav's verbatim answers are exempt: they stay exactly as he said them.
- Never: "simply", "just", "seamless", "robust", "powerful", "comprehensive", "unlock",
  "dive in", "leverage", "elevate", "game-changer". No rhetorical triads, no "not X, but Y"
  flourishes, no summary sentence that repeats the paragraph above it.
- Sentence case everywhere. A heading is a noun phrase or a plain statement.

## Checking a page

At 1536x787 (Pranav's screen: 1920x1080 at 125%), 1920x1080, a phone upright (375x812) and
on its side (667x375), light and dark:

- Count the font sizes and families in use (`getComputedStyle` over every text node); at most
  six sizes, two families.
- No horizontal overflow; nothing clipped; the page title fits one line on a wide screen.
- Take a screenshot and look at it as a stranger would: if it looks generated, find the rule
  above it breaks.
