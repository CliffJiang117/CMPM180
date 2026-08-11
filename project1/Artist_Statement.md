# Read the Air

## Artist Statement

**Read the Air** is an interactive code artwork about social pressure, conformity, and the way people may change how they express an opinion depending on the atmosphere around them.

The title comes from the idea of **“reading the air”**: noticing the mood, expectations, or unspoken rules surrounding a group and adjusting yourself to fit them. I became interested in taking something normally invisible—social pressure—and turning it into a visible rule that could operate on language.

---

## Inspiration: Moving Text

One of the main inspirations for this project came from Chapter 5 of *Electronic Literature*, particularly its discussion of **kinetic poetry**.

The reading describes words and letters as more than containers for linguistic meaning. In digital poetry, they can also operate as material objects whose position, appearance, movement, and other properties can change. It also argues that movement itself can communicate meaning.

That changed the way I thought about animated text.

Instead of asking:

> *How can I make these words move?*

I became more interested in asking:

> **What can the movement and transformation of the words mean?**

The chapter also describes digital text as something that can be understood as a **process rather than a fixed object**. The text we experience is produced through code running over time. In interactive work, physical action and the changing text can form a feedback loop.

That idea became especially important for **Read the Air**, because the ratings on screen do not have one permanently fixed appearance. Their behavior changes depending on their relationship with another force in the program.

---

## The Work

When **Read the Air** begins, the screen is filled with ratings written in many different languages.

These include languages such as:

- Chinese
- English
- Japanese
- Korean
- French
- Spanish
- German
- Russian
- Ukrainian
- Polish
- Greek
- Arabic
- Persian
- Hebrew
- Turkish

Each rating is generated from a set of possible values between `1/10` and `9/10`.

The program also randomly determines properties such as:

- position
- color
- size
- rotation
- language
- rating

Languages can repeat, so the screen is not designed as a clean demonstration where every language appears exactly once.

Instead, I wanted it to feel closer to a crowd.

One area might contain several similar ratings while another contains completely different ones. Some text may appear close together or partially overlap. Because these decisions are made by the program, the composition is different every time the work is loaded.

The initial screen is intentionally irregular.

There are different opinions, different languages, different colors, and different visual orientations.

There is no single **correct** rating.

---

## Social Pressure

The cursor introduces another force into this space.

However, I do **not** think of the cursor as literally representing the viewer personally looking at each opinion.

Instead, I see it as a moving field of:

> **social pressure**  
> **public opinion**  
> **trends**  
> **expectations**  
> **the surrounding atmosphere**

The ratings react to the position of this pressure.

When it gets close enough, a rating changes from its `NORMAL` state into its `CONFORM` state.

As that happens, several things begin to change.

The text straightens from its original rotation.  
Its original color moves toward black.  
Its original rating begins to disappear.  
Its original language also disappears.

Everything is replaced with the same response:

> **10/10**

It does not matter whether the original opinion was extremely positive or extremely negative.

It does not matter whether it was written in Chinese, English, Russian, Arabic, or another language.

Under sufficient pressure, the answer becomes the same.

---

## Why `10/10`?

I originally considered allowing every language to keep its own way of writing “ten out of ten.”

Instead, I decided that every transformed opinion should become the exact same:

`10/10`

This makes the transformation more than a change in numerical rating.

The program also removes the original **way of expressing that rating**.

For example:

```text
七 / 十
        ↓
      10/10

три / десять
        ↓
      10/10

٤ / ١٠
        ↓
      10/10
````

The standardized answer looks simple, neutral, and widely recognizable.

That apparent neutrality is useful to the piece.

The result appears clean and universally understandable, but achieving that visual cleanliness requires removing the differences that existed before it.

---

## Rules, Randomness, and Conceptual Writing

Another influence on the project was Jacquelyn Ardam's *The ABCs of Conceptual Writing*.

The reading discusses conceptual writing in relation to **procedures, rules, constraints, organization, and artificial systems**.

That made me think differently about what the code itself was doing.

I do not manually decide:

> This Russian rating should appear here.
> This Chinese rating should be red.
> This opinion should receive a score of six.
> This one should rotate twelve degrees.

Instead, I construct a system that makes many of those decisions.

The starting diversity is produced through randomness.

The movement toward sameness is produced through rules.

The most important rule is extremely simple:

```text
If social pressure becomes close enough:
    conform.
```

This simplicity is important to me.

The project does not need a complicated simulation of society in order to suggest social pressure. A small computational rule can repeatedly produce a recognizable behavior.

Randomness also became more important as the project developed.

At first, I thought about manually placing the languages around the screen. That would have given me much more control over the composition.

Instead, random generation allows unexpected relationships to appear.

The program may create:

```text
Russian       Chinese

        Arabic

French                 Russian

           Korean
```

or something completely different.

The code first produces difference.

Then another part of the code begins removing it.

---

## Current State: Temporary Conformity

The current version uses two main states:

```text
STATE_NORMAL
STATE_CONFORM
```

When the pressure approaches, the text enters `STATE_CONFORM`.

When the pressure leaves, it returns to `STATE_NORMAL`.

A separate value called `conformity` controls the transition between these states.

Conceptually:

```text
conformity = 0
```

means that the opinion is completely in its original form.

While:

```text
conformity = 1
```

means that it has completely transformed into the standardized `10/10`.

This allows the transition to happen gradually instead of instantly.

In the current prototype, conformity is still temporary. Once the pressure moves away, the opinion can slowly recover its original language, color, angle, and rating.

This temporary behavior represents a kind of social performance.

The opinion changes because of the surrounding pressure, but it has not yet permanently lost its previous form.

---

## Planned Development: Internalized Conformity

The next stage of the project will make repeated exposure matter.

The program already records information such as how many times each opinion has entered the conforming state.

Rather than making every opinion permanently change after exactly the same number of encounters, I plan to combine the number of previous transformations with **randomness**.

The basic idea is something similar to:

```text
random value × number of exposures
```

If the result crosses a certain threshold, that opinion will become permanently locked as:

> **10/10**

This means repeated social pressure makes permanent conformity increasingly likely, but does not create a predictable countdown.

Two opinions might experience the same pressure several times and react differently.

One could permanently conform relatively early.

Another might return to its original state many more times.

I prefer this to a fixed rule such as:

```text
five interactions = permanent conformity
```

because the process should not feel like gaining experience points in a game.

The randomness introduces uncertainty into the moment when temporary performance becomes something closer to **internalized conformity**.

---

## Planned Ending

Over time, more opinions will become permanently standardized.

The screen will gradually lose:

* languages
* colors
* different scores
* rotations
* visual irregularity

Eventually there will be nothing left except repeated:

> **10/10**
> **10/10**
> **10/10**
> **10/10**

When every opinion has permanently reached this state, the program will recognize that complete conformity has been achieved.

At that moment, **music will begin to play**.

An exaggerated award or acceptance speech will then scroll upward from the bottom of the screen, similar to a cinematic opening crawl.

This ending is intentionally ironic.

From the program's perspective, the viewer has reached the perfect result:

> Everyone agrees.
> Every score is perfect.
> Nothing is out of place.

The system therefore responds as though something wonderful has happened.

But visually, this moment is also when almost everything that made the original screen interesting has disappeared.

The celebration happens at the moment when difference is gone.

---

## What, Why, and How

### What

**Read the Air** is a multilingual interactive text system in which individual ratings respond to an invisible field of social pressure and move toward the same standardized answer.

### Why

I am interested in the tension between individual expression and the pressure to recognize what the surrounding environment considers the expected or acceptable response.

I am especially interested in the point where temporary conformity can gradually become normal enough that returning to the previous state becomes more difficult.

### How

The project uses:

* JavaScript
* p5.js
* random generation
* object-oriented text objects
* a simple state machine
* distance between text and cursor
* interpolation for smooth transitions
* repeated-interaction counters
* eventually, probability-based permanent changes

The code is not only a technical system underneath the artwork.

**The behavior of the code is part of the metaphor.**

---

## Conclusion

I began this project by thinking about how text could react to a cursor.

As the idea developed, I became less interested in the cursor as a normal interface and more interested in using it as an invisible social force.

That also changed the importance of randomness.

Randomness produces different languages, positions, colors, and opinions.

Rules push those differences toward one standardized answer.

Eventually, I want repeated interaction to make some of those transformations permanent until the system reaches its supposedly perfect conclusion.

> **The program begins by producing difference.
> It gradually learns how to erase it.**