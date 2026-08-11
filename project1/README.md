# Read the Air

> **An interactive code artwork about social pressure, conformity, and the disappearance of difference.**

**Read the Air** is an interactive artwork created with **JavaScript** and **p5.js**.

The screen begins with ratings written in many different languages.  
Each rating has its own:

- language
- score
- position
- color
- size
- rotation

The same language may appear more than once, and the arrangement is randomly generated whenever the page is loaded.

---

## How to Interact

**Move your cursor around the screen.**

There is no need to click anything.

Pay attention to:

- how the text reacts to the cursor
- what happens when the cursor approaches a rating
- what happens when the cursor moves away
- what remains different and what becomes the same

Refresh the page to generate a new arrangement.

---

## Current Version

The current prototype includes:

- multilingual ratings
- randomly selected scores from `1/10` to `9/10`
- random positions
- random colors
- random text sizes
- random rotations
- repeated languages and ratings
- text that reacts to the location of the cursor
- a `NORMAL` state
- a `CONFORM` state
- smooth transitions between the two states
- transformation into the standardized response `10/10`
- counters that record repeated exposure to the interaction

The current state system can be simplified as:

```text
NORMAL
   ↓
social pressure approaches
   ↓
CONFORM
   ↓
10/10
   ↓
pressure leaves
   ↓
NORMAL
````

At this stage, conformity is **temporary**.
When the pressure moves away, the rating can still return to its original form.

---

## Concept

The cursor is not meant to literally represent the player looking at individual people.

Instead, it acts more like a moving field of:

**social pressure, trends, public opinion, expectations, or atmosphere.**

Different ratings begin with different languages, values, colors, and orientations.

When this pressure reaches them, those differences begin to disappear.

No matter whether the original rating was:

> 七 / 十
> three / ten
> восемь / десять
> ٤ / ١٠

the standardized response is always:

> ## 10/10

---

## Planned Development

The current version already records how many times each opinion has been affected.

A later version will use those counters to make conformity gradually become permanent.

Instead of saying:

> "After exactly five interactions, this rating changes forever."

I plan to use a probability system based on repeated exposure.

For example:

```text
random value × number of previous exposures
```

If the result becomes large enough, that individual rating will become permanently fixed as:

```text
10/10
```

Repeated exposure therefore makes permanent conformity **more likely**, but does not guarantee that every rating will change at the same moment.

Some may conform quickly.

Others may continue returning to their original state for much longer.

Eventually, however, more and more of the multilingual and colorful screen will disappear.

### Planned Ending

When every rating has permanently become:

> **10/10**

the program will treat complete conformity as a victory.

Music will begin to play, followed by an exaggerated **award / acceptance speech** scrolling upward from the bottom of the screen like a cinematic opening crawl.

The celebration is intentionally ironic.

The system congratulates itself at exactly the moment when every disagreement and visual difference has disappeared.

---

## Tools

* **JavaScript**
* **p5.js**
* **HTML**
* **GitHub Pages**

---

## Artist Statement

For a more detailed explanation of the concept, process, readings, and future development:

### [Read the Artist Statement](./Artist_Statement.md)

---

## Status

> **Work in Progress**

The central interaction is currently functional.
Permanent conformity, music, and the final scrolling ending are planned for a later version.

---

## AI Assistance

AI was used during parts of the development process to help search for implementation examples and clarify specific coding techniques.
### Links

- [AI Search 1](https://share.google/aimode/LfloynpZ6EoXFmULP)
- [AI Search 2](https://share.google/aimode/uGIO8Ojc8fDwS5d83)


