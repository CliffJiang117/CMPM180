# Word Field

**Word Field** is an interactive code artwork about searching for, losing, arranging, and preserving language.

Words continuously appear and disappear inside three areas: **Noun**, **Verb**, and **Adjective**. The contents of each area are covered, and moving the cursor across the surface opens a small circular window that reveals the words underneath.

The player can collect words and drag them into ten composition slots. Once inside the composition, words slowly decay by losing individual letters. Three limited **Anchor** tools can stop this decay, while punctuation can be freely added and rearranged.

The player may preserve the line at any moment. The final line is uploaded to a shared online archive, where it can be viewed together with lines preserved by other players.

---

# How to Interact

- Move the cursor across a **Noun**, **Verb**, or **Adjective** area to reveal the words underneath.
- Words appear and disappear over time and can only be collected while they are active.
- Drag a word into one of the ten slots at the bottom of the screen.
- Words inside the slots gradually lose letters.
- Drag words between slots to rearrange the line.
- Drag a word out of the composition to return it to the field. It will remain there only briefly before disappearing.
- Drag punctuation directly into a slot to use it in the composition.
- Drag one of the three **◆ Anchor** tools onto a word to stop its decay.
- An Anchor preserves the word in its current state. It does not restore letters that have already disappeared.
- Press **SUBMIT** whenever the current line is something you want to preserve.
- A name can be added before submission, but signing the work is optional.
- After submitting, use **VIEW GALLERY** to see lines preserved by other players.

There is no required number of words, grammar check, score, or traditional win condition. An incomplete, damaged, or fragmented line can still be preserved.

---

# Artist Statement / Explication

One of the starting points for *Word Field* actually came from a question someone asked while testing my previous project in class: **“Do you feel you own the poem?”**

My Project 3 was built around multiple people contributing words that were later mixed together and reorganized by a system. Because the contributors could not fully control how their words appeared in the final result, authorship became difficult to define. I did not originally build that project around the question of ownership, but the question stayed with me afterward. For this project, I wanted to approach it from another direction. If the player does not create the available vocabulary, cannot control exactly when words appear, and cannot completely prevent those words from changing, how much can the final poem still belong to them?

This question connected strongly with Giselle Beiguelman’s *Nomadic Poetry*. Beiguelman describes digital writing as something built around instability, movement, fragmentation, and changing interfaces rather than the permanence associated with printed writing. One passage that especially interested me states that digital writing “celebrates the loss of inscription by removing the trace from acts of erasure.” She later describes digital culture as rebuilding the reading place as a “temporal interface.” Instead of treating digital text as something permanently placed in front of a reader, this suggests a form of writing that exists through time and through changing conditions.

My initial idea therefore became: **What if the player had to search for language before it disappeared, and what if finding a word still did not guarantee that they could keep it?**

Formally, *Word Field* is divided into a changing word field and a ten-slot composition area. The field contains three regions representing nouns, verbs, and adjectives. The words are not immediately visible. A colored layer covers each region, and the cursor creates a circular opening through that layer. The player has to physically search across the areas to discover what is currently available. Meanwhile, words continue to follow their own lifetimes. They fade in, remain available for a limited and partly randomized amount of time, and then fade away. The vocabulary therefore does not wait for the player.

Dragging a word into the composition does not permanently rescue it. Once placed into a slot, the word begins to decay. Individual characters disappear at random intervals. `remember`, for example, might gradually become `rem_mber`, then `r_m__ber`, and eventually become only a trace. Even when a word dies, its remains continue to occupy the slot. I wanted loss to leave a consequence rather than simply cleaning itself away and giving the player another empty space.

This part of the project also developed through Stephen Ramsay’s *Reading Machines*. Ramsay argues that interpretation already involves transforming texts: selecting, truncating, rearranging, and translating material into another form. Later, he describes algorithmic criticism as creating situations where readers confront not only “deformed texts” but also the **“how”** of those deformations. That idea was especially useful to me because I did not want the code to function only as a tool for displaying a poem. I wanted the program itself to participate in what the poem could become.

The deformation in *Word Field* is deliberately visible. The player can watch letters disappear, see words enter and leave the field, and understand that these changes are produced by rules. The poem is created through an interaction between the player’s choices and those rules. The player chooses where to search, which word to grab, where to place it, what to discard, and when to submit, but the system determines what vocabulary is currently available and how quickly most of it deteriorates.

The three Anchor tools create a limited possibility of resistance. An Anchor stops a word from decaying further, but it cannot reconstruct what has already been erased. If `remember` has already become `rem_mber`, the player can preserve `rem_mber`, but cannot return it to `remember`. Because there are only three Anchors, preservation also becomes a choice. Not everything can be protected.

I intentionally avoided grammar checking, minimum word requirements, scoring, or a definition of what counts as a completed poem. The player can submit whenever they decide that the current state should survive. A line containing damaged words or only a few fragments is just as valid to the system as a grammatically complete sentence. In this sense, the final action is less about “finishing” the poem and more about choosing when to stop its transformation.

The shared archive brings the earlier question of ownership back into the project. Each browser is allowed to submit only one line. The artwork can still be played again afterward, but that browser cannot contribute another result to the archive. Playing is repeatable; preservation is not.

Before preserving the line, the player is also given the option to leave a name. I chose to make this optional because I did not want the system to answer the ownership question for the player. Signing the line can become a small claim of authorship: **I made this. I want my name attached to it.** Leaving the field empty instead allows the same line to become an anonymous part of the collective archive.

This creates an authorship that I think is intentionally unclear. The player did not write the vocabulary. They did not decide when each word appeared. They did not completely control the deformation of the words. At the same time, they searched for them, selected them, arranged them, decided what was worth protecting, and chose the exact moment when the process should stop.

Because of this, I do not think the poem exists only as the final sentence displayed in the gallery. The poem also includes the process that produced it: searching, missing words, watching them decay, trying to preserve some of them, abandoning others, and finally deciding what can be left behind.

---

# Color Palette

The visual palette for the project was selected using [Coolors](https://coolors.co/a9ddd6-7a8b99-91adc2-9ba0bc-c1b8c8).

The palette is:

- `#A9DDD6`
- `#7A8B99`
- `#91ADC2`
- `#9BA0BC`
- `#C1B8C8`

The same palette is reused across the word field, composition area, slots, Anchors, submission popup, drag feedback, and public archive.

---