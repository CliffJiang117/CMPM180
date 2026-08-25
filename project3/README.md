# Project 3 — Collective Poem

## Overview

This project is a networked poetry website that behaves differently on mobile devices and desktop computers.

On a mobile device, the user enters:

* two words
* one place

The website records the current local time and creates a temporary password using the first letter of each input followed by the time in 24-hour `HHMM` format.

Example:

```text
memory
rain
Santa Cruz
21:39

MRS2139
```

The contribution is temporarily stored in Firebase Realtime Database together with the generated password.

The user then carries the password to a desktop computer.

On desktop, the user enters the password. If the password is valid:

1. The contribution is moved into the permanent poem database.
2. The temporary password is deleted and cannot be reused.
3. The desktop is marked as already used through `localStorage`.
4. The collective poem is generated from all successfully redeemed contributions.

Invalid passwords do not lock the computer.

The basic interaction flow is:

```text
Mobile User
↓
Enter two words + one place
↓
Generate temporary password
↓
Carry password to desktop
↓
Enter password
↓
Contribution enters shared poem corpus
↓
Password is deleted
↓
Collective poem appears
```

---

# Database Structure

Temporary contributions are stored under:

```text
active_passwords
    └── PASSWORD
        ├── word1
        ├── word2
        ├── place
        └── time
```

After a password is successfully redeemed, its contribution is moved to:

```text
poem_entries
    └── Firebase generated ID
        ├── word1
        ├── word2
        ├── place
        └── time
```

The password itself disappears after use, but the language it carried remains in the shared corpus.

---

# Poem Rules

1. The poem uses contributions from every successfully redeemed password.

2. Each contribution contains:

   * `word1`
   * `word2`
   * `place`
   * `time`

3. Only `word1`, `word2`, and `place` are currently used to construct the poem.
   `time` is stored in the database but is not currently used as poem vocabulary.

4. All user contributions are placed into one shared fragment pool.
   The original relationship between one user's `word1`, `word2`, and `place` is not preserved.

5. The fragment pool is shuffled before each generation.
   Regenerating the poem may therefore produce a different result.

6. A user fragment may only be used once during one poem generation.
   This only removes it from the temporary generation pool. Nothing is deleted from Firebase.

7. Connector words belong to the program, not to users.
   Connector words may be reused any number of times.

8. Each complete poem follows a **5 / 7 / 5 word structure**:

```text
5 words
7 words
5 words
```

9. If enough user fragments remain after one complete 5 / 7 / 5 poem, the program begins another one:

```text
5
7
5

5
7
5

5
7
5
```

10. A complete 5-word line follows this structure:

```text
USER USER CONNECTOR USER USER
```

The connector is always the third word.

11. A complete 7-word line follows this structure:

```text
USER USER CONNECTOR USER CONNECTOR USER USER
```

The connectors are always the third and fifth words.

12. User fragments are not analyzed grammatically.
    The program does not determine whether a fragment is a noun, verb, adjective, or another part of speech.

13. A place may contain multiple words.

Example:

```text
Santa Cruz
```

counts as two words.

14. A multi-word place is treated as one complete fragment and may never be split apart.

Allowed:

```text
memory rain under Santa Cruz
```

Not allowed:

```text
memory Santa under Cruz rain
```

15. The code does not currently limit how many words a place may contain.

16. If a fragment does not fit into the remaining space of the current line, it is temporarily skipped and may be used later.

17. The generator tries to create complete 5-word and 7-word lines for as long as possible.

18. If the remaining user fragments cannot complete the next required line, the generator stops following the strict 5 / 7 / 5 structure.

19. All remaining user fragments are displayed together as the final incomplete line.

20. The final incomplete line does not need to contain exactly 5 or 7 words.

21. Connector words are not added to the final incomplete line.
    This prevents a connector from being left alone at the end of the poem.

22. Every regeneration starts again from the complete Firebase corpus and reshuffles all available fragments.

---

# Files

```text
index.html
style.css
script.js
poem.js
```

### `index.html`

Contains the mobile contribution interface, desktop password interface, and poem display.

### `script.js`

Handles:

* Firebase initialization
* mobile / desktop detection
* mobile form submission
* password generation
* duplicate password checking
* temporary Firebase storage
* desktop password validation
* password deletion
* moving contributions into `poem_entries`
* desktop `localStorage`
* loading the collective poem

### `poem.js`

Handles:

* collecting all user fragments
* counting words inside fragments
* shuffling fragments
* preserving multi-word places
* selecting connector words
* constructing 5-word lines
* constructing 7-word lines
* organizing lines into 5 / 7 / 5 poems
* displaying remaining fragments as the final incomplete line

### `style.css`

Handles the visual layout and formatting of both interfaces and the poem.

---

# Artist Statement

My initial inspiration for this project came from Giselle Beiguelman’s *Nomadic Poetry*. Beiguelman describes a digital environment in which “there are no statements, only inputs,” producing a form of poetry that is “fluid and transitory.” She discusses works that move across cell phones, the Web, electronic panels, and other networked interfaces, where writing operates through fragmentation, “sharing and sampling,” and movement between different media. What interested me most was not simply the idea of putting poetry onto a mobile device, but the possibility that moving between devices could become part of how a text is produced.

My first idea was therefore more complicated than the final project. I wanted mobile devices and desktop computers to contain different pieces of information and somehow recognize each other. At one point I was thinking about something similar to a public-key/private-key system, where one device could produce information that another specific device would need in order to continue. I was also interested in the possibility of several people using the website at once and having to combine information from different machines.

The problem was that this quickly became technically difficult. A website cannot easily know that one particular phone and one particular computer belong to the same participant. If several people are using the installation at the same time, I would need some kind of session, pairing system, device identification, or real-time communication to prevent their information from being mixed together. Reliable device identification is also more complicated than simply asking whether a screen is small or large. For the scale of this project, building a system that could automatically identify and pair users would add a large amount of technical complexity without necessarily improving the final interaction.

I eventually reduced this to a deliberately simple solution: the system does not identify the participant at all. Instead, the participant becomes the connection between the devices.

On a mobile device, the website asks the user to enter two words and one place. The program also records the current local time. It then creates a temporary password from the first letter of each contribution and the four-digit 24-hour time. For example, if a user enters `memory`, `rain`, and `Santa Cruz` at 21:39, the generated password is `MRS2139`. The words, place, time, and password are temporarily stored in an online database. The mobile user then has to physically remember, copy, or carry that password to a desktop computer.

The desktop version of the website has a different function. Instead of contributing words, the user is presented with a password input. If a valid password is entered, the data associated with that password is transferred into the permanent shared poetry collection. The temporary password is then deleted so that it cannot be used again. Each desktop browser can also successfully submit only once. Invalid passwords do not consume that opportunity.

This password system began primarily as a technical compromise. It was simply a much easier way to transfer the identity of a contribution from one device to another without trying to determine who owned which device. However, after implementing it, I became interested in what this limitation produced. The network does not automatically complete the transfer. The system cannot recognize the person, so the person has to carry the missing information themselves. In that sense, the temporary password became both a workaround and part of the interaction.

There is also something strange about choosing a password for this role. A password normally represents privacy, identity, and restricted access. It is something that should not be shared. In this project, the password exists specifically to be transported and surrendered. It has no permanent value. Once it reaches the desktop, it disappears, while the words that it carried remain.

After the password is redeemed, the original contribution also begins to lose its individual identity. A submission such as `memory / rain / Santa Cruz` enters a shared pool containing fragments from every successful participant. The program does not preserve which words originally belonged together. `memory` may eventually appear beside somebody else’s `Tokyo`, while `rain` may appear in another generated poem entirely.

The poem generator uses these fragments within a loose 5 / 7 / 5 structure. This is not an attempt to reproduce Japanese haiku exactly: instead of counting mora or syllables, the program counts English words. A five-word line places a program-generated connector in the third position, while a seven-word line places connectors in the third and fifth positions. The remaining positions are filled with user contributions. Multi-word places such as `Santa Cruz` are counted as multiple words but remain intact as a single fragment. The program does not analyze grammar or determine whether an input is a noun, verb, adjective, or something else. Because of this, awkward or unexpected combinations are possible. If enough fragments remain, the system continues producing additional 5 / 7 / 5 groups. If there are not enough fragments to complete the next line, the remaining material is simply displayed as an incomplete final line.

This relates back to Beiguelman’s description of digital writing as something shaped by fragmented interfaces and changing reading conditions. Her examples are not simply texts displayed on new screens; their movement through communication systems changes how they are produced and received. She describes these works as participating in the instability of contemporary networked life and as rebuilding the reading place as a “temporal interface.”

My project is much smaller and technologically simpler, but that idea became useful for understanding what the final system was doing. The poem does not exist entirely on the phone or on the computer. The phone produces a contribution but cannot display the collective result. The desktop can display the poem but cannot create the contribution by itself. The database stores the information but is invisible to the participant. The participant connects these separate parts by carrying the temporary password between them.

The final interaction therefore came partly from an artistic idea and partly from the limits of what I was able to build. Rather than hiding that limitation, I think it became one of the more interesting parts of the project. The system fails to identify people directly, so people themselves become part of the network that allows the text to move.


---

## AI Assistance

https://share.gemini.google/CgwOG6XvEJDF
