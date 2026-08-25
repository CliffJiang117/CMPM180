/*
POEM RULES

1. The poem uses contributions from every successfully redeemed password.

2. Each contribution contains:
   - word1
   - word2
   - place
   - time

3. Only word1, word2, and place are currently used to construct the poem.
   Time is stored in the database but is not used as poem vocabulary.

4. All user contributions are placed into one shared fragment pool.
   The original relationship between one user's word1, word2, and place
   is not preserved.

5. The fragment pool is shuffled before each generation.
   Regenerating the poem may therefore produce a different result.

6. A user fragment may only be used once during one poem generation.
   This only removes it from the temporary generation pool.
   Nothing is deleted from Firebase.

7. Connector words belong to the program, not to users.
   Connector words may be reused any number of times.

8. The poem follows a continuous alternating word-count structure:
   5 words
   7 words
   5 words
   repeat...

9. A complete 5-word line follows this structure:

   USER USER CONNECTOR USER USER

   The connector is always the third word.

10. A complete 7-word line follows this structure:

   USER USER CONNECTOR USER CONNECTOR USER USER

   Connectors are always the third and fifth words.

11. User words are not analyzed grammatically.
    The program does not care whether a fragment is a noun,
    verb, adjective, or another part of speech.

12. A place may contain multiple words.

    Example:
    "Santa Cruz" counts as two words.

    However, a multi-word place is treated as one complete fragment
    and may never be split apart.

    Allowed:
    "memory rain under Santa Cruz"
    but not:
    "memory Santa under Cruz rain"

13. The code does not currently limit how many words a place may contain.

14. If a fragment does not fit into the remaining space of the current line, it is skipped temporarily and may be used later.

15. The generator should tries to create complete 5-word and 7-word lines for as long as possible.

16. If the remaining user fragments can no longer form the next complete 5-word or 7-word line, the generator stops following the strict pattern.

17. All remaining user fragments are then displayed together as the final line.

18. The final incomplete line does not need to contain exactly 5 or 7 words.

19. Connectors are not added to the final incomplete line, prevents a connector from being left alone at the end of the poem.

20. Every regeneration starts again from the complete Firebase corpus.
*/




// Connector vocabulary
const connectorsA = [
  "in",
  "at",
  "under",
  "above",
  "through",
  "beside",
  "beyond",
  "before",
  "after",
  "with",
  "without"
];

const connectorsB = [
  "and",
  "but",
  "while",
  "with",
  "without",
  "under",
  "after",
  "before"
];



// Return a shuffled copy of an array

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// Pick one random item from an array

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Count the number of words inside a fragment
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}



// Convert all Firebase entries into one shared fragment pool

function createFragmentPool(entries) {
  const fragments = [];

  for (const entry of entries) {
    const values = [entry.word1, entry.word2, entry.place];

    for (const value of values) {
      if (typeof value !== "string" || value.trim() === "") {
        continue;
      }

      const text = value.trim();

      fragments.push({
        text,
        wordCount: countWords(text)
      });
    }
  }

  return shuffle(fragments);
}


// Find possible fragment combinations for one user section.
//
// A section currently needs either:
// - exactly 1 user word
// - exactly 2 user words
//
// A two-word section may be:
// one complete two-word fragment
// two separate one-word fragments

function getSectionOptions(pool, usedIndices, targetWords) {
  const availableIndices = shuffle(
    pool
      .map((fragment, index) => index)
      .filter(index => !usedIndices.has(index))
  );

  const options = [];

  if (targetWords === 1) {
    for (const index of availableIndices) {
      if (pool[index].wordCount === 1) {
        options.push([index]);
      }
    }
  }

  if (targetWords === 2) {
    // First allow complete two-word fragments such as "Santa Cruz".
    for (const index of availableIndices) {
      if (pool[index].wordCount === 2) {
        options.push([index]);
      }
    }

    // Then allow two separate one-word fragments.
    const oneWordIndices = availableIndices.filter(index => pool[index].wordCount === 1);

    for (let i = 0; i < oneWordIndices.length; i++) {
      for (let j = i + 1; j < oneWordIndices.length; j++) {
        options.push([oneWordIndices[i], oneWordIndices[j]]);
      }
    }
  }

  return shuffle(options);
}


// Find a combination of user fragments that can exactly
// fill all required user sections of a complete line.
//
// 5-word line:
// [2 user words] connector [2 user words]
//
// 7-word line:
// [2 user words] connector [1 user word] connector [2 user words]

function findLineFragments(pool, sectionTargets) {
  function search(sectionIndex, usedIndices, sections) {
    if (sectionIndex === sectionTargets.length) {
      return {
        sections,
        usedIndices
      };
    }

    const target = sectionTargets[sectionIndex];
    const options = getSectionOptions(pool, usedIndices, target);

    for (const option of options) {
      const nextUsed = new Set(usedIndices);

      for (const index of option) {
        nextUsed.add(index);
      }

      const result = search(sectionIndex + 1, nextUsed, [...sections, option]);

      if (result) {
        return result;
      }
    }

    return null;
  }

  return search(0, new Set(), []);
}


// Convert selected fragment indices into text

function sectionToText(pool, section) {
  return section.map(index => pool[index].text).join(" ");
}


// 
// Build one complete 5-word line:


function buildFiveWordLine(pool, result) {
  const firstSection = sectionToText(pool, result.sections[0]);
  const secondSection = sectionToText(pool, result.sections[1]);
  const connector = randomItem(connectorsA);

  return `${firstSection} ${connector} ${secondSection}`;
}



// Build one complete 7-word line:

function buildSevenWordLine(pool, result) {
  const firstSection = sectionToText(pool, result.sections[0]);
  const middleSection = sectionToText(pool, result.sections[1]);
  const lastSection = sectionToText(pool, result.sections[2]);

  const connector1 = randomItem(connectorsA);
  const connector2 = randomItem(connectorsB);

  return `${firstSection} ${connector1} ${middleSection} ${connector2} ${lastSection}`;
}



// Remove fragments used by a completed line from the
// temporary generation pool.

function removeUsedFragments(pool, usedIndices) {
  return pool.filter((fragment, index) => !usedIndices.has(index));
}



// Generate the final leftover line.

// No connectors are added.
// Remaining multi-word fragments stay intact.

function buildFinalLine(pool) {
  return pool.map(fragment => fragment.text).join(" ");
}


// Main poem generator
export function generatePoem(entries) {
  if (!entries || entries.length === 0) {
    return "Nothing has arrived yet.";
  }

  let pool = createFragmentPool(entries);

  const completedPoems = [];
  let currentPoem = [];

  const linePattern = [5, 7, 5];
  let patternIndex = 0;


  while (pool.length > 0) {
    const targetLength = linePattern[patternIndex];

    let sectionTargets;

    if (targetLength === 5) {
      sectionTargets = [2, 2];
    } else {
      sectionTargets = [2, 1, 2];
    }

    const result = findLineFragments(pool, sectionTargets);


    // The next required line cannot be completed.
    // Add all remaining fragments as one final line and stop generation.
    if (!result) {
      const finalLine = buildFinalLine(pool);

      if (finalLine !== "") {
        currentPoem.push(finalLine);
      }

      if (currentPoem.length > 0) {
        completedPoems.push(currentPoem.join("\n"));
      }

      return completedPoems.join("\n\n");
    }


    // Build the complete 5-word or 7-word line.

    let line;

    if (targetLength === 5) {
      line = buildFiveWordLine(pool, result);
    } else {
      line = buildSevenWordLine(pool, result);
    }

    currentPoem.push(line);

    pool = removeUsedFragments(pool, result.usedIndices);

    // Move to the next line in the 5 / 7 / 5 pattern.
    patternIndex++;

    if (patternIndex === linePattern.length) {
      completedPoems.push(currentPoem.join("\n"));

      currentPoem = [];
      patternIndex = 0;
    }
  }


  // This mainly handles the case where the fragment poolbecomes empty exactly after an incomplete poem.

  if (currentPoem.length > 0) {
    completedPoems.push(currentPoem.join("\n"));
  }


  // Separate individual 5 / 7 / 5 poems with one blank line.
  return completedPoems.join("\n\n");
}
